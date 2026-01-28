import { useState } from 'react';

/**
 * AlertPanel Component — With Load More
 */
export function AlertPanel({ alerts, onClear }) {
    const INITIAL_DISPLAY = 6; // Show 5-8 initially
    const [showAll, setShowAll] = useState(false);

    const displayedAlerts = showAll ? alerts : alerts.slice(0, INITIAL_DISPLAY);
    const hiddenCount = alerts.length - INITIAL_DISPLAY;

    const formatTime = (timestamp) => {
        if (!timestamp) return '--:--:--';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    return (
        <div className="glass-card alerts-card">
            <div className="alerts-header">
                <div className="alerts-title">
                    <span className="alerts-icon">🔔</span>
                    <span>Critical Alerts</span>
                    {alerts.length > 0 && (
                        <span className="alerts-badge">{alerts.length}</span>
                    )}
                </div>
                {alerts.length > 0 && (
                    <button onClick={onClear} className="alerts-clear">
                        Clear All
                    </button>
                )}
            </div>

            <div className="alerts-body">
                {alerts.length === 0 ? (
                    <div className="alerts-empty">
                        <span className="alerts-empty-icon">✓</span>
                        <span className="alerts-empty-text">All vitals normal</span>
                        <span className="alerts-empty-subtext">No critical events recorded</span>
                    </div>
                ) : (
                    <>
                        <table className="alert-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>HR</th>
                                    <th>SpO₂</th>
                                    <th>Temp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedAlerts.map((alert) => (
                                    <tr key={alert.id}>
                                        <td className="alert-time">
                                            {formatTime(alert.timestamp)}
                                        </td>
                                        <td>{alert.HR} bpm</td>
                                        <td>{alert.SpO2}%</td>
                                        <td>{alert.Temp}°C</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Load More Button */}
                        {hiddenCount > 0 && !showAll && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="load-more-btn"
                            >
                                Load More ({hiddenCount} more)
                            </button>
                        )}

                        {showAll && alerts.length > INITIAL_DISPLAY && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="load-more-btn"
                            >
                                Show Less
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
