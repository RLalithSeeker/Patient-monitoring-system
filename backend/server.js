require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Client } = require('pg');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// ML API URL
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

// --- Database Connection ---
const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch(err => console.error('❌ Database connection error:', err.message));

// --- MQTT Setup ---
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'hospital/bed1/vitals';

// Store recent HR values for prediction
let hrHistory = [];

mqttClient.on('connect', () => {
    console.log('✅ Connected to MQTT Broker');
    mqttClient.subscribe(MQTT_TOPIC, (err) => {
        if (!err) console.log(`📡 Subscribed to topic: ${MQTT_TOPIC}`);
    });
});

mqttClient.on('message', async (topic, message) => {
    const msg = message.toString();
    console.log(`📩 MQTT Msg: ${msg}`);

    try {
        const data = JSON.parse(msg);

        // Store HR for prediction
        hrHistory.push(data.HR);
        if (hrHistory.length > 60) hrHistory = hrHistory.slice(-60);

        // Get ML prediction (async, don't block)
        let mlPrediction = null;
        try {
            const response = await fetch(`${ML_API_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    HR: data.HR,
                    SpO2: data.SpO2,
                    Temp: data.Temp
                })
            });
            if (response.ok) {
                mlPrediction = await response.json();
            }
        } catch (e) {
            // ML API not available, continue without it
        }

        // Emit data with ML prediction
        io.emit('vital_update', {
            ...data,
            ml: mlPrediction
        });

    } catch (e) {
        console.error('⚠️ Failed to parse MQTT message');
    }
});

// --- Routes ---
app.get('/', (req, res) => {
    res.send('Hospital Backend is Running');
});

// Proxy endpoint for ML analysis
app.post('/api/analyze', async (req, res) => {
    try {
        const response = await fetch(`${ML_API_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(503).json({ error: 'ML API not available' });
    }
});

// Get HR prediction
app.get('/api/predict/hr', async (req, res) => {
    try {
        const response = await fetch(`${ML_API_URL}/predict/hr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hr_history: hrHistory })
        });
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(503).json({ error: 'ML API not available' });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
