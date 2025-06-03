import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import LoadingTimer from './LoadingTimer';
import { useApp } from '../context/AppContext';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';

export default function ChatList() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const navigate = useNavigate();
  const { user, login, backendUrl } = useApp();
  const { rooms, activeUsers, isLoading, isServerResponding } = useChat();
  const { joinRoom } = useSocket();

  const handleRoomClick = (room) => {
    if (!user) {
      setSelectedRoom(room);
      setShowModal(true);
    } else {
      joinRoom(room._id);
      navigate(`/chat/${room._id}`);
    }
  };

  const handleRegister = async () => {
    if (!username) return;

    try {
      const res = await fetch(`${backendUrl}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) throw new Error('Failed to register');

      const data = await res.json();
      login(data);
      toast.success('Registered successfully!');
      setShowModal(false);

      joinRoom(selectedRoom._id);
      navigate(`/chat/${selectedRoom._id}`);
    } catch (err) {
      toast.error(`Registration failed: ${err.message}`);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isServerResponding && isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <LoadingTimer />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search rooms"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            onClick={() => handleRoomClick(room)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {room.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {room.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created {new Date(room.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Active users: {activeUsers[room._id]?.length || 0}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeUsers[room._id]?.map((user) => (
                    <span
                      key={user.id}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.online
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {user.username}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Join {selectedRoom?.name}
              </h3>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                placeholder="Enter your username"
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
