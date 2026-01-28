"""
Patient Vitals ML Analytics
- Logistic Regression for Abnormality Detection
- LSTM for Heart Rate Prediction
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

# -----------------------------
# 1. Logistic Regression
# -----------------------------

# Example dataset (replace with real ESP32 data)
data = pd.DataFrame({
    'HR': [78, 130, 95, 110, 140, 85],
    'SpO2': [96, 88, 97, 92, 85, 98],
    'Temp': [37.2, 38.5, 36.8, 37.9, 39.0, 36.5],
    'Label': [0, 1, 0, 0, 1, 0]  # 0=Normal, 1=Abnormal
})

X = data[['HR','SpO2','Temp']]
y = data['Label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

log_model = LogisticRegression()
log_model.fit(X_train, y_train)

y_pred = log_model.predict(X_test)
print("Logistic Regression Accuracy:", accuracy_score(y_test, y_pred))

# Example prediction
new_data = np.array([[125, 89, 38.0]])  # HR, SpO2, Temp
prediction = log_model.predict(new_data)
print("Prediction (0=Normal, 1=Abnormal):", prediction)

# -----------------------------
# 2. LSTM for HR Prediction
# -----------------------------

# Example HR sequence (replace with real HR time-series)
hr_data = [78, 80, 82, 85, 87, 90, 92, 95, 97, 100,
           102, 105, 107, 110, 112, 115, 117, 120, 122, 125]

# Prepare data: sliding windows
sequence_length = 30  # past 30 seconds
predict_length = 10   # predict next 10 seconds

# Pad sequence for demo
hr_data = hr_data * 3  # repeat to make longer

X_seq = []
y_seq = []
for i in range(len(hr_data) - sequence_length - predict_length):
    X_seq.append(hr_data[i:i+sequence_length])
    y_seq.append(hr_data[i+sequence_length:i+sequence_length+predict_length])

X_seq = np.array(X_seq)
y_seq = np.array(y_seq)

# Reshape for LSTM [samples, timesteps, features]
X_seq = X_seq.reshape((X_seq.shape[0], X_seq.shape[1], 1))
y_seq = y_seq.reshape((y_seq.shape[0], y_seq.shape[1]))

# Build LSTM model
model = Sequential()
model.add(LSTM(64, input_shape=(sequence_length,1)))
model.add(Dense(predict_length))
model.compile(optimizer='adam', loss='mse')

# Train
model.fit(X_seq, y_seq, epochs=20, batch_size=16, verbose=1)

# Predict next 10 seconds HR
test_input = hr_data[-sequence_length:]  # last 30 seconds
test_input = np.array(test_input).reshape((1, sequence_length, 1))
predicted_hr = model.predict(test_input)

print("Predicted HR for next 10 seconds:", predicted_hr.flatten())
