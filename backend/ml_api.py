"""
Flask API for Patient Vitals ML Predictions
- POST /predict/status → Abnormality detection (Logistic Regression)
- POST /predict/hr → Heart Rate prediction (LSTM)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# -----------------------------
# Train Logistic Regression Model (on startup)
# -----------------------------
training_data = pd.DataFrame({
    'HR': [78, 130, 95, 110, 140, 85, 72, 135, 88, 145, 92, 125, 68, 150, 98],
    'SpO2': [96, 88, 97, 92, 85, 98, 99, 87, 95, 84, 96, 89, 98, 82, 94],
    'Temp': [37.2, 38.5, 36.8, 37.9, 39.0, 36.5, 36.6, 38.8, 37.0, 39.2, 36.9, 38.2, 36.4, 39.5, 37.1],
    'Label': [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0]
})

X = training_data[['HR', 'SpO2', 'Temp']]
y = training_data['Label']

log_model = LogisticRegression()
log_model.fit(X, y)
print("✅ Logistic Regression model trained")

# HR history for LSTM (simplified moving average for demo)
hr_history = []

# -----------------------------
# API Endpoints
# -----------------------------

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'models': ['logistic_regression', 'hr_predictor']})


@app.route('/predict/status', methods=['POST'])
def predict_status():
    """
    Predict if vitals are Normal or Abnormal
    Input: { "HR": 125, "SpO2": 89, "Temp": 38.0 }
    Output: { "prediction": "Abnormal", "confidence": 0.85 }
    """
    data = request.json
    hr = data.get('HR', 75)
    spo2 = data.get('SpO2', 98)
    temp = data.get('Temp', 36.8)
    
    features = np.array([[hr, spo2, temp]])
    prediction = log_model.predict(features)[0]
    probability = log_model.predict_proba(features)[0]
    
    result = {
        'prediction': 'Abnormal' if prediction == 1 else 'Normal',
        'confidence': round(float(max(probability)), 2),
        'input': {'HR': hr, 'SpO2': spo2, 'Temp': temp}
    }
    
    return jsonify(result)


@app.route('/predict/hr', methods=['POST'])
def predict_hr():
    """
    Predict next HR values based on history
    Input: { "hr_history": [78, 80, 82, ...] } (last 30 values)
    Output: { "predicted_hr": [85, 86, 87, ...] } (next 10 values)
    """
    data = request.json
    history = data.get('hr_history', [])
    
    if len(history) < 5:
        return jsonify({'error': 'Need at least 5 HR values'}), 400
    
    # Simple prediction: moving average trend (demo without heavy LSTM)
    recent = history[-10:] if len(history) >= 10 else history
    avg = np.mean(recent)
    trend = (recent[-1] - recent[0]) / len(recent) if len(recent) > 1 else 0
    
    predicted = []
    for i in range(10):
        next_val = avg + (trend * (i + 1))
        next_val = max(40, min(180, next_val))  # Clamp to valid range
        predicted.append(round(next_val))
    
    return jsonify({
        'predicted_hr': predicted,
        'trend': 'increasing' if trend > 0.5 else 'decreasing' if trend < -0.5 else 'stable'
    })


@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Full analysis endpoint combining status + trend
    """
    data = request.json
    hr = data.get('HR', 75)
    spo2 = data.get('SpO2', 98)
    temp = data.get('Temp', 36.8)
    
    # Status prediction
    features = np.array([[hr, spo2, temp]])
    prediction = log_model.predict(features)[0]
    probability = log_model.predict_proba(features)[0]
    
    # Risk assessment
    risk_score = 0
    risk_factors = []
    
    if hr > 100:
        risk_score += 20
        risk_factors.append('Elevated heart rate')
    if hr > 120:
        risk_score += 30
        risk_factors.append('Tachycardia')
    if hr < 60:
        risk_score += 20
        risk_factors.append('Bradycardia')
    if spo2 < 95:
        risk_score += 25
        risk_factors.append('Low oxygen saturation')
    if spo2 < 90:
        risk_score += 35
        risk_factors.append('Hypoxemia')
    if temp > 37.5:
        risk_score += 15
        risk_factors.append('Fever')
    if temp > 38.5:
        risk_score += 25
        risk_factors.append('High fever')
    
    risk_level = 'Low' if risk_score < 30 else 'Medium' if risk_score < 60 else 'High'
    
    return jsonify({
        'status': 'Abnormal' if prediction == 1 else 'Normal',
        'confidence': round(float(max(probability)), 2),
        'risk_score': min(100, risk_score),
        'risk_level': risk_level,
        'risk_factors': risk_factors
    })


if __name__ == '__main__':
    print("🚀 ML API running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
