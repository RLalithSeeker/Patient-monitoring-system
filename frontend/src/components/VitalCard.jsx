import { useEffect, useRef, useState } from 'react';

/**
 * VitalCard Component — Enhanced
 * Features: heartbeat animation (HR), trend arrows, animated number tween
 */
export function VitalCard({ type, value, unit, label, prevValue }) {
    const typeClass = type.toLowerCase();
    const [displayValue, setDisplayValue] = useState(value);
    const animFrameRef = useRef(null);
    const startRef = useRef(null);

    const config = {
        hr: { icon: '❤️', range: 'Normal: 60-100 BPM' },
        spo2: { icon: '💧', range: 'Normal: 95-100%' },
        temp: { icon: '🌡️', range: 'Normal: 36.1-37.2°C' },
    };

    const { icon, range } = config[typeClass] || { icon: '📊', range: '' };

    // Animated number tween (#7)
    useEffect(() => {
        if (typeof value !== 'number') return;
        const from = displayValue || value;
        const to = value;
        const duration = 400; // ms

        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        startRef.current = null;

        const step = (timestamp) => {
            if (!startRef.current) startRef.current = timestamp;
            const progress = Math.min((timestamp - startRef.current) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            const current = from + (to - from) * eased;
            setDisplayValue(typeClass === 'temp' ? parseFloat(current.toFixed(1)) : Math.round(current));
            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(step);
            }
        };
        animFrameRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [value]);

    // Trend arrow (#2)
    const getTrend = () => {
        if (typeof prevValue !== 'number' || typeof value !== 'number') return null;
        const diff = value - prevValue;
        const threshold = typeClass === 'temp' ? 0.05 : 0.5;
        if (diff > threshold) return { arrow: '↑', cls: 'trend-up' };
        if (diff < -threshold) return { arrow: '↓', cls: 'trend-down' };
        return { arrow: '→', cls: 'trend-stable' };
    };

    const trend = getTrend();

    return (
        <div className={`glass-card vital-card ${typeClass}`}>
            <div className="vital-header">
                <div className={`vital-icon ${typeClass} ${typeClass === 'hr' ? 'heartbeat' : ''}`}>
                    {icon}
                </div>
                <div className="vital-header-right">
                    <span className="vital-label">{label}</span>
                    {trend && (
                        <span className={`trend-badge ${trend.cls}`}>{trend.arrow}</span>
                    )}
                </div>
            </div>

            <div className="vital-body">
                <span className={`vital-value ${typeClass}`}>
                    {typeof displayValue === 'number' ? displayValue : '--'}
                </span>
                <span className="vital-unit">{unit}</span>
            </div>

            <div className="vital-range">{range}</div>
        </div>
    );
}
