import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingTimer from '../components/LoadingTimer';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { useChat } from '../context/ChatContext';

export default function ChatRoom() {
  const { roomId } = useParams();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const { user } = useApp();
  const { isConnected, sendMessage } = useSocket();
  const { activeUsers, messages, isLoading, isServerResponding, loadMessages } = useChat();

  // Load messages when entering room
  useEffect(() => {
    if (roomId) {
      loadMessages(roomId);
    }
  }, [roomId, loadMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages[roomId]]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      sendMessage(roomId, messageInput);
      setMessageInput('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  };

  // Show loading state if we're still waiting for initial data
  if (!isServerResponding && isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <LoadingTimer />
      </div>
    );
  }

  // Show connecting message if socket isn't connected
  if (!isConnected) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Connecting to chat...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  const roomMessages = messages[roomId] || [];
  const roomActiveUsers = activeUsers[roomId] || [];

  return (
    <div className="max-w-7xl mx-auto h-screen p-4 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-sm shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-xl font-bold text-white">Let's Chat</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {roomMessages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[60%] rounded-lg p-3 ${
                      msg.sender._id === user?._id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1">
                      {msg.sender.username}
                    </div>
                    <div className="text-sm break-words">{msg.content}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send
              </motion.button>
            </div>
          </form>
        </div>

        {/* Active Users Sidebar */}
        <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Active Users ({roomActiveUsers.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {roomActiveUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-gray-900 dark:text-white">{user.username}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
