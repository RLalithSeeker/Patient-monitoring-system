# Patient Monitoring Dashboard

Real-time hospital-style patient monitoring system with **AI-powered risk analysis**.

## Architecture

```
ESP32/Simulator → MQTT Broker → Node.js Backend → Socket.io → React Dashboard
                                      ↓
                                  ML API (Flask)
```

## Features

- ✅ **Real-time vitals**: HR, SpO₂, Body Temperature
- ✅ **Live charts**: 60-second rolling history
- ✅ **Critical alerts**: Event logging with timestamps
- ✅ **AI Analysis**: ML-powered risk assessment
- ✅ **Light theme**: Professional hospital aesthetic
- ✅ **ESP32 ready**: Drop-in hardware support

---

## Quick Start

### 1. Install Dependencies

```bash
# Backend (Node.js)
cd backend
npm install

# ML API (Python)
pip install -r requirements.txt

# Frontend (React)
cd frontend
npm install
```

### 2. Start All Services

```bash
# Terminal 1: Backend
cd backend && node server.js

# Terminal 2: ML API
cd backend && python ml_api.py

# Terminal 3: Simulator
cd backend && node simulator.js

# Terminal 4: Frontend
cd frontend && npm run dev
```

### 3. Open Dashboard

Navigate to **http://localhost:5173**

---

## Project Structure

```
CN/
├── backend/
│   ├── server.js          # Node.js + Socket.io + MQTT
│   ├── simulator.js       # ESP32 data simulator
│   ├── ml_api.py         # Flask ML API
│   ├── ml_analytics.py   # ML training script
│   ├── requirements.txt  # Python dependencies
│   └── .env              # Configuration
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── VitalCard.jsx
│       │   ├── LiveChart.jsx
│       │   ├── AlertPanel.jsx
│       │   └── MLPanel.jsx
│       └── hooks/
│           └── useSocket.js
└── esp32/
    └── patient_monitor.ino  # Arduino code
```

---

## ML API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/predict/status` | POST | Abnormality detection |
| `/predict/hr` | POST | HR trend prediction |
| `/analyze` | POST | Full risk analysis |

---

## ESP32 Integration

1. Flash `esp32/patient_monitor.ino` to your ESP32
2. Update WiFi credentials in the code
3. Connect MAX30102 (HR/SpO₂) and temperature sensor
4. Stop `simulator.js` (not needed anymore)
5. Dashboard will automatically receive data from ESP32

---

## Configuration

All settings in `backend/.env`:

```env
PORT=5000
MQTT_BROKER_URL=mqtt://test.mosquitto.org
MQTT_TOPIC=hospital/bed1/vitals
CLIENT_URL=http://localhost:5173
ML_API_URL=http://localhost:5001
```

---

## Technologies

**Backend**: Node.js, Express, Socket.io, MQTT  
**Frontend**: React, Vite, Tailwind CSS, Chart.js  
**ML**: Python, Flask, Scikit-learn, TensorFlow  
**Hardware**: ESP32, MAX30102, DS18B20
