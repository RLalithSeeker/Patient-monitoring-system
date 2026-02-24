/**
 * MLPanel Component — Semicircle Risk Gauge + AI Analysis
 */
export function MLPanel({ mlData }) {
    if (!mlData) {
        return (
            <div className="glass-card ml-card">
                <div className="ml-header">
                    <span className="ml-icon">🤖</span>
                    <span>AI Analysis</span>
                </div>
                <div className="ml-empty">
                    <span>Waiting for ML predictions...</span>
                    <span className="ml-hint">Start the ML API server</span>
                </div>
            </div>
        );
    }

    const { status, confidence, risk_score, risk_level, risk_factors } = mlData;

    const getRiskColor = (level) => {
        switch (level) {
            case 'High': return '#dc2626';
            case 'Medium': return '#f59e0b';
            default: return '#16a34a';
        }
    };

    // Semicircle SVG gauge (#6)
    // The arc goes from 180° to 0° (left to right), radius 54, center (60, 60)
    const R = 54;
    const cx = 60, cy = 60;
    const circumference = Math.PI * R; // half-circle
    const score = Math.min(100, Math.max(0, risk_score));
    const filled = (score / 100) * circumference;
    const color = getRiskColor(risk_level);

    // SVG path for top semicircle: start at left (180°), end at right (0°)
    const startX = cx - R, startY = cy;
    const endX = cx + R, endY = cy;

    return (
        <div className="glass-card ml-card">
            <div className="ml-header">
                <span className="ml-icon">🤖</span>
                <span>AI Analysis</span>
                <span className={`ml-confidence ${status === 'Abnormal' ? 'abnormal' : ''}`}>
                    {Math.round(confidence * 100)}% confident
                </span>
            </div>

            <div className="ml-body">
                {/* Semicircle Risk Gauge */}
                <div className="risk-gauge-wrap">
                    <svg viewBox="0 0 120 70" className="risk-gauge-svg">
                        {/* Background track */}
                        <path
                            d={`M ${startX} ${startY} A ${R} ${R} 0 0 1 ${endX} ${endY}`}
                            fill="none"
                            stroke="var(--border-medium)"
                            strokeWidth="10"
                            strokeLinecap="round"
                        />
                        {/* Filled arc */}
                        <path
                            d={`M ${startX} ${startY} A ${R} ${R} 0 0 1 ${endX} ${endY}`}
                            fill="none"
                            stroke={color}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={`${filled} ${circumference}`}
                            style={{ transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease' }}
                        />
                        {/* Score label */}
                        <text x="60" y="58" textAnchor="middle" className="gauge-score" fill={color}>
                            {score}
                        </text>
                        <text x="60" y="70" textAnchor="middle" className="gauge-label" fill="var(--text-muted)">
                            / 100
                        </text>
                    </svg>
                    <div className="gauge-risk-level" style={{ color }}>
                        {risk_level} Risk
                    </div>
                </div>

                {/* Risk Factors */}
                {risk_factors && risk_factors.length > 0 && (
                    <div className="risk-factors">
                        <span className="rf-label">Risk Factors:</span>
                        <ul className="rf-list">
                            {risk_factors.map((factor, i) => (
                                <li key={i} className="rf-item">⚠️ {factor}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {risk_factors && risk_factors.length === 0 && (
                    <div className="ml-ok">
                        <span className="ml-ok-icon">✓</span>
                        <span>All vitals within normal range</span>
                    </div>
                )}
            </div>
        </div>
    );
}
