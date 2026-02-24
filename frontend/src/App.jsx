import { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { VitalCard } from './components/VitalCard';
import { LiveChart } from './components/LiveChart';
import { AlertPanel } from './components/AlertPanel';
import { MLPanel } from './components/MLPanel';
import './index.css';

// Patient info (static demo — could be fetched from backend)
const PATIENT = {
  name: 'John Doe',
  age: 45,
  room: 'ICU-3',
  bed: 'Bed 01',
  doctor: 'Dr. Priya Sharma',
  admitted: '24 Feb 2025',
};

function App() {
  const { isConnected, vitals, prevVitals, vitalHistory, alerts, clearAlerts } = useSocket();
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode class to <html> (#4)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-icon">🏥</div>
          <div>
            <div className="header-title">Patient Monitor</div>
            <div className="header-subtitle">Real-time Vitals Dashboard + AI</div>
          </div>
        </div>

        <div className="header-controls">
          <div
            className={`status-badge ${vitals.Status === 'Critical' ? 'critical' : 'normal'}`}
          >
            <span className="status-dot"></span>
            {vitals.Status || 'Waiting'}
          </div>

          <div className="connection-status">
            <span className={`connection-dot ${isConnected ? '' : 'offline'}`}></span>
            {isConnected ? 'ESP32 Online' : 'Offline'}
          </div>

          {/* Dark Mode Toggle (#4) */}
          <button
            className="icon-btn"
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>


        </div>
      </header>

      {/* Patient Info Strip (#5) */}
      <div className="patient-strip">
        <div className="patient-field">
          <span className="pf-label">Patient</span>
          <span className="pf-value">{PATIENT.name}</span>
        </div>
        <div className="patient-divider" />
        <div className="patient-field">
          <span className="pf-label">Age</span>
          <span className="pf-value">{PATIENT.age} yrs</span>
        </div>
        <div className="patient-divider" />
        <div className="patient-field">
          <span className="pf-label">Room</span>
          <span className="pf-value">{PATIENT.room}</span>
        </div>
        <div className="patient-divider" />
        <div className="patient-field">
          <span className="pf-label">Bed</span>
          <span className="pf-value">{PATIENT.bed}</span>
        </div>
        <div className="patient-divider" />
        <div className="patient-field">
          <span className="pf-label">Doctor</span>
          <span className="pf-value">{PATIENT.doctor}</span>
        </div>
        <div className="patient-divider" />
        <div className="patient-field">
          <span className="pf-label">Admitted</span>
          <span className="pf-value">{PATIENT.admitted}</span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <main className="dashboard">
        {/* Left: Vitals Cards */}
        <section className="vitals-panel">
          <VitalCard type="HR" value={vitals.HR} prevValue={prevVitals?.HR} unit="bpm" label="Heart Rate" />
          <VitalCard type="SpO2" value={vitals.SpO2} prevValue={prevVitals?.SpO2} unit="%" label="Oxygen Saturation" />
          <VitalCard type="Temp" value={vitals.Temp} prevValue={prevVitals?.Temp} unit="°C" label="Body Temperature" />
        </section>

        {/* Center: Charts */}
        <section className="charts-panel">
          <LiveChart history={vitalHistory} vitalKey="HR" label="Heart Rate (BPM)" currentValue={vitals.HR} />
          <LiveChart history={vitalHistory} vitalKey="SpO2" label="SpO₂ (%)" currentValue={vitals.SpO2} />
          <LiveChart history={vitalHistory} vitalKey="Temp" label="Temperature (°C)" currentValue={vitals.Temp} />
        </section>

        {/* Right: Alerts + ML */}
        <section className="right-panel">
          <MLPanel mlData={vitals.ml} />
          <AlertPanel alerts={alerts} onClear={clearAlerts} />
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-label">Last update:</span>
        <span className="footer-time">
          {vitals.timestamp
            ? new Date(vitals.timestamp).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
            : '--:--:--'}
        </span>
      </footer>
    </div>
  );
}

export default App;
