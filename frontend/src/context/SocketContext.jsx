import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useApp } from './AppContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { backendUrl, user } = useApp();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(backendUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [backendUrl]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Socket connected');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (user) {
      socket.connect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket, user]);

  const joinRoom = useCallback((roomId) => {
    if (socket && isConnected && user) {
      socket.emit('joinRoom', { roomId, userId: user._id });
    }
  }, [socket, isConnected, user]);

  const leaveRoom = useCallback((roomId) => {
    if (socket && user) {
      socket.emit('leaveRoom', { roomId, userId: user._id });
    }
  }, [socket, user]);

  const sendMessage = useCallback((roomId, text) => {
    if (!text.trim() || !socket || !user) return;
    socket.emit('sendMessage', {
      userId: user._id,
      roomId,
      text
    });
  }, [socket, user]);

  const value = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
} 