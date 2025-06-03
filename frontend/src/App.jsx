import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from './context/AppContext';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <AppProvider>
      <SocketProvider>
        <ChatProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat/:roomId" element={<ChatRoom />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </Router>
        </ChatProvider>
      </SocketProvider>
    </AppProvider>
  );
}

export default App;
