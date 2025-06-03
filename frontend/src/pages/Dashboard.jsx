import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { useChat } from '../context/ChatContext';
import ChatList from '../components/ChatList';
import { AnimatePresence } from 'framer-motion';

function Dashboard() {
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, backendUrl } = useApp();
  const { isConnected, joinRoom } = useSocket();
  const { rooms, setRooms } = useChat();

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error('Please enter a room name');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRoomName.trim() }),
      });

      if (!res.ok) throw new Error('Failed to create room');

      const newRoom = await res.json();
      // Update rooms state immediately
      setRooms(prevRooms => [...prevRooms, newRoom]);
      
      toast.success('Room created successfully!');
      setShowCreateRoomModal(false);
      setNewRoomName('');
      
      // Join the newly created room
      joinRoom(newRoom._id);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  // Setup default room if it doesn't exist
  useEffect(() => {
    async function setupDefaultRoom() {
      if (!user || !isConnected || rooms.length > 0) return;

      try {
        // First check if General room exists
        const checkRes = await fetch(`${backendUrl}/api/rooms`);
        const existingRooms = await checkRes.json();
        const generalRoom = existingRooms.find(room => room.name === 'General');
        
        if (generalRoom) {
          setRooms(existingRooms);
          return;
        }

        // Create General room if it doesn't exist
        const createRes = await fetch(`${backendUrl}/api/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'General' }),
        });
        
        if (!createRes.ok) {
          throw new Error('Failed to create default room');
        }

        const newRoom = await createRes.json();
        setRooms([newRoom]);
        joinRoom(newRoom._id);
      } catch (error) {
        console.error('Error setting up default room:', error);
        toast.error('Failed to setup chat room');
      }
    }

    setupDefaultRoom();
  }, [user, isConnected, rooms.length, backendUrl, joinRoom, setRooms]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      {/* Header/Navbar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Title */}
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-lg sm:text-xl font-bold">LC</span>
              </div>
              <div className="ml-3 flex flex-col">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Let's Chat
                </h1>
                {user && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.username}
                  </p>
                )}
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowCreateRoomModal(true)}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
                <span className="hidden sm:inline">New Room</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ChatList />
      </div>

      {/* Create Room Modal */}
      <AnimatePresence>
        {showCreateRoomModal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md m-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Create New Room
                </h3>
                <button
                  onClick={() => setShowCreateRoomModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateRoomModal(false);
                    setNewRoomName('');
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;
