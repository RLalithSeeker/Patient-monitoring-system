import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useSocket() {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [vitals, setVitals] = useState({
        HR: 0,
        SpO2: 0,
        Temp: 0,
        Status: 'Normal',
        timestamp: null,
    });
    const [vitalHistory, setVitalHistory] = useState([]);

    // Demo: Pre-populated critical alerts for demonstration
    const [alerts, setAlerts] = useState([
        { id: 1, timestamp: new Date(Date.now() - 120000).toISOString(), HR: 135, SpO2: 88, Temp: 38.9, Status: 'Critical' },
        { id: 2, timestamp: new Date(Date.now() - 300000).toISOString(), HR: 142, SpO2: 91, Temp: 37.2, Status: 'Critical' },
        { id: 3, timestamp: new Date(Date.now() - 480000).toISOString(), HR: 128, SpO2: 89, Temp: 38.6, Status: 'Critical' },
    ]);

    useEffect(() => {
        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });

        socketInstance.on('connect', () => {
            console.log('✅ Socket connected');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setIsConnected(false);
        });

        socketInstance.on('vital_update', (data) => {
            setVitals(data);

            // Add to history (keep last 60 data points for graph)
            setVitalHistory((prev) => {
                const newHistory = [...prev, { ...data, time: new Date() }];
                return newHistory.slice(-60);
            });

            // If critical, add to alerts
            if (data.Status === 'Critical') {
                setAlerts((prev) => [
                    { ...data, id: Date.now() },
                    ...prev.slice(0, 49), // Keep last 50 alerts
                ]);
            }
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const clearAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    return {
        socket,
        isConnected,
        vitals,
        vitalHistory,
        alerts,
        clearAlerts,
    };
}
