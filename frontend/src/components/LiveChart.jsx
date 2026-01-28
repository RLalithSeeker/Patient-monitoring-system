import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const VITAL_CONFIG = {
    HR: {
        line: '#e11d48',
        fill: 'rgba(225, 29, 72, 0.08)',
    },
    SpO2: {
        line: '#0891b2',
        fill: 'rgba(8, 145, 178, 0.08)',
    },
    Temp: {
        line: '#ea580c',
        fill: 'rgba(234, 88, 12, 0.08)',
    },
};

/**
 * LiveChart Component — Light Theme
 */
export function LiveChart({ history, vitalKey, label, currentValue }) {
    const config = VITAL_CONFIG[vitalKey] || VITAL_CONFIG.HR;

    const data = {
        labels: history.map((_, i) => i),
        datasets: [
            {
                label: label,
                data: history.map((d) => d[vitalKey]),
                borderColor: config.line,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 160);
                    gradient.addColorStop(0, config.fill);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    return gradient;
                },
                borderWidth: 2.5,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: config.line,
                pointHoverBorderWidth: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 400,
            easing: 'easeOutQuart',
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: '#0f172a',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.04)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 10,
                        family: "'Space Mono', monospace",
                    },
                    padding: 8,
                    maxTicksLimit: 4,
                },
                border: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="glass-card chart-card">
            <div className="chart-header">
                <span className="chart-title">{label}</span>
                <span className={`chart-value ${vitalKey.toLowerCase()}`}>
                    {currentValue ?? '--'}
                </span>
            </div>
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
