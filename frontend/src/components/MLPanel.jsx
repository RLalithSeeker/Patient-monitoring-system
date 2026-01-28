/**
 * MLPanel Component - Displays ML predictions
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
            case 'High': return 'risk-high';
            case 'Medium': return 'risk-medium';
            default: return 'risk-low';
        }
    };

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
                {/* Risk Score */}
                <div className="risk-meter">
                    <div className="risk-label">
                        <span>Risk Score</span>
                        <span className={getRiskColor(risk_level)}>{risk_level}</span>
                    </div>
                    <div className="risk-bar">
                        <div
                            className={`risk-fill ${getRiskColor(risk_level)}`}
                            style={{ width: `${risk_score}%` }}
                        ></div>
                    </div>
                    <span className="risk-value">{risk_score}/100</span>
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
