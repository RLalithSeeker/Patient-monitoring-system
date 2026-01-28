require('dotenv').config();
const mqtt = require('mqtt');

// Configuration
const BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://test.mosquitto.org';
const TOPIC = process.env.MQTT_TOPIC || 'hospital/bed1/vitals';

const client = mqtt.connect(BROKER_URL);

// Initial Vitals
let vitals = {
    HR: 75,
    SpO2: 98,
    Temp: 36.8
};

client.on('connect', () => {
    console.log(`✅ Simulator connected to ${BROKER_URL}`);
    console.log(`🚀 Publishing to ${TOPIC} every 5 seconds...`);

    setInterval(publishVitals, 5000);  // Reduced from 2s to 5s
});

function publishVitals() {
    // Random Walk Logic (smaller variations for stability)
    vitals.HR += (Math.random() - 0.5) * 2;  // +/- 1 BPM
    vitals.SpO2 += (Math.random() - 0.5) * 0.5; // +/- 0.25 %
    vitals.Temp += (Math.random() - 0.5) * 0.1; // +/- 0.05 C

    // Constraints (keep values in normal range mostly)
    vitals.HR = Math.max(60, Math.min(100, vitals.HR));
    vitals.SpO2 = Math.max(95, Math.min(100, vitals.SpO2));
    vitals.Temp = Math.max(36, Math.min(37.5, vitals.Temp));

    // Determine Status
    let status = "Normal";
    if (vitals.HR > 120 || vitals.HR < 50 || vitals.SpO2 < 90 || vitals.Temp > 38.5) {
        status = "Critical";
    }

    const payload = {
        timestamp: new Date().toISOString(),
        HR: Math.round(vitals.HR),
        SpO2: Math.round(vitals.SpO2),
        Temp: parseFloat(vitals.Temp.toFixed(1)),
        Status: status
    };

    client.publish(TOPIC, JSON.stringify(payload));
    console.log(`📡 Sent: HR=${payload.HR} SpO2=${payload.SpO2} Temp=${payload.Temp} [${payload.Status}]`);
}
