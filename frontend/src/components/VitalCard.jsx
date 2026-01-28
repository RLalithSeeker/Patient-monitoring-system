/**
 * VitalCard Component — Light Theme
 * Color-coded cards with vibrant accents.
 */
export function VitalCard({ type, value, unit, label }) {
    const typeClass = type.toLowerCase();

    const config = {
        hr: { icon: '❤️', range: 'Normal: 60-100 BPM' },
        spo2: { icon: '💧', range: 'Normal: 95-100%' },
        temp: { icon: '🌡️', range: 'Normal: 36.1-37.2°C' },
    };

    const { icon, range } = config[typeClass] || { icon: '📊', range: '' };

    return (
        <div className={`glass-card vital-card ${typeClass}`}>
            <div className="vital-header">
                <div className={`vital-icon ${typeClass}`}>{icon}</div>
                <span className="vital-label">{label}</span>
            </div>

            <div className="vital-body">
                <span className={`vital-value ${typeClass}`}>
                    {typeof value === 'number' ? value : '--'}
                </span>
                <span className="vital-unit">{unit}</span>
            </div>

            <div className="vital-range">{range}</div>
        </div>
    );
}
