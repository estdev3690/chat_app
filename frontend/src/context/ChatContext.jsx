import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { useSocket } from './SocketContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { backendUrl } = useApp();
  const { socket } = useSocket();
  const [rooms, setRooms] = useState([]);
  const [activeUsers, setActiveUsers] = useState({});
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isServerResponding, setIsServerResponding] = useState(true);

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const startTime = Date.now();
        const response = await fetch(`${backendUrl}/api/rooms`);
        const data = await response.json();
        
        const elapsedTime = Date.now() - startTime;
        setIsServerResponding(elapsedTime < 2000);
        
        setRooms(data);
        
        // Initialize activeUsers state
        const initialActiveUsers = {};
        data.forEach(room => {
          initialActiveUsers[room._id] = room.activeUsers.map(user => ({
            id: user._id,
            username: user.username,
            online: true
          }));
        });
        setActiveUsers(initialActiveUsers);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setIsServerResponding(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [backendUrl]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = ({ username, activeUsers: roomActiveUsers, roomId }) => {
      setActiveUsers(prev => ({
        ...prev,
        [roomId]: roomActiveUsers
      }));
    };

    const handleUserLeft = ({ userId, roomId }) => {
      setActiveUsers(prev => ({
        ...prev,
        [roomId]: prev[roomId]?.filter(user => user.id !== userId) || []
      }));
    };

    const handleNewMessage = (message) => {
      setMessages(prev => ({
        ...prev,
        [message.roomId]: [...(prev[message.roomId] || []), message]
      }));
    };

    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  // Load messages for a specific room
  const loadMessages = async (roomId) => {
    try {
      const response = await fetch(`${backendUrl}/api/messages/${roomId}`);
      const data = await response.json();
      setMessages(prev => ({
        ...prev,
        [roomId]: data
      }));
      return data;
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };

  const value = {
    rooms,
    setRooms,
    activeUsers,
    messages,
    isLoading,
    isServerResponding,
    loadMessages
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 