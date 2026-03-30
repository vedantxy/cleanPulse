import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, user }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!user) return;

        // In development, the proxy handles this, but for sockets we often need the direct URL
        // or just use window.location.origin if front/back are on same port (not the case in Vite)
        const newSocket = io(window.location.origin === 'http://localhost:5173' ? 'http://localhost:5000' : window.location.origin, {
            transports: ['websocket'],
            reconnectionAttempts: 5
        });

        newSocket.on('connect', () => {
            console.log('[Socket] Connected to server');
            setConnected(true);
            
            // Join user-specific room
            newSocket.emit('join', user.id || user._id);
            
            // If collector, join zone room
            if (user.role === 'collector' && user.zone) {
                newSocket.emit('joinZone', user.zone);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
            setSocket(null);
        };
    }, [user]);

    // Helper to add listeners easily
    const on = useCallback((event, callback) => {
        if (socket) {
            socket.on(event, callback);
            return () => socket.off(event, callback);
        }
    }, [socket]);

    const emit = useCallback((event, data) => {
        if (socket) {
            socket.emit(event, data);
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, connected, on, emit }}>
            {children}
        </SocketContext.Provider>
    );
};
