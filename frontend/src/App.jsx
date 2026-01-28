import { useSocket } from './hooks/useSocket';
import { VitalCard } from './components/VitalCard';
import { LiveChart } from './components/LiveChart';
import { AlertPanel } from './components/AlertPanel';
import { MLPanel } from './components/MLPanel';
import './index.css';

function App() {
  const { isConnected, vitals, vitalHistory, alerts, clearAlerts } = useSocket();

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
            className={`status-badge ${vitals.Status === 'Critical' ? 'critical' : 'normal'
              }`}
          >
            <span className="status-dot"></span>
            {vitals.Status || 'Waiting'}
          </div>

          <div className="connection-status">
            <span className={`connection-dot ${isConnected ? '' : 'offline'}`}></span>
            {isConnected ? 'ESP32 Online' : 'Offline'}
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="dashboard">
        {/* Left: Vitals Cards */}
        <section className="vitals-panel">
          <VitalCard type="HR" value={vitals.HR} unit="bpm" label="Heart Rate" />
          <VitalCard type="SpO2" value={vitals.SpO2} unit="%" label="Oxygen Saturation" />
          <VitalCard type="Temp" value={vitals.Temp} unit="°C" label="Body Temperature" />
        </section>

        {/* Center: Charts */}
        <section className="charts-panel">
          <LiveChart
            history={vitalHistory}
            vitalKey="HR"
            label="Heart Rate (BPM)"
            currentValue={vitals.HR}
          />
          <LiveChart
            history={vitalHistory}
            vitalKey="SpO2"
            label="SpO₂ (%)"
            currentValue={vitals.SpO2}
          />
          <LiveChart
            history={vitalHistory}
            vitalKey="Temp"
            label="Temperature (°C)"
            currentValue={vitals.Temp}
          />
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
