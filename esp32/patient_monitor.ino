/**
 * ESP32 Code for Patient Monitoring
 * 
 * Hardware Required:
 * - MAX30102 (HR + SpO2 sensor)
 * - DS18B20 or TMP36 (Temperature sensor)
 * 
 * Libraries Required:
 * - WiFi.h
 * - PubSubClient.h
 * - MAX30105.h
 * - OneWire.h / DallasTemperature.h
 */

#include <WiFi.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT Broker (same as .env)
const char* mqtt_server = "test.mosquitto.org";
const char* mqtt_topic = "hospital/bed1/vitals";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // Connect to MQTT
  client.setServer(mqtt_server, 1883);
  
  // Initialize your sensors here
  // e.g., MAX30102, temperature sensor
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32_Patient_Monitor")) {
      Serial.println("MQTT connected!");
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // Read your sensors here
  int heartRate = 75;      // Replace with MAX30102 reading
  int spo2 = 98;           // Replace with MAX30102 reading
  float temp = 36.8;       // Replace with temperature sensor reading

  // Determine status
  String status = "Normal";
  if (heartRate > 120 || spo2 < 90 || temp > 38.5) {
    status = "Critical";
  }

  // Create JSON payload (MUST match simulator format)
  String payload = "{\"HR\":" + String(heartRate) +
                   ",\"SpO2\":" + String(spo2) +
                   ",\"Temp\":" + String(temp, 1) +
                   ",\"Status\":\"" + status + "\"}";

  // Publish to MQTT
  client.publish(mqtt_topic, payload.c_str());
  Serial.println("Sent: " + payload);

  delay(5000); // Send every 5 seconds
}
