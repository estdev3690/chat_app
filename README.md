# Let's Chat - Real-Time Chat Application

A modern, real-time chat application built with React, Node.js, and Socket.IO. Features a beautiful UI with dark mode support, real-time messaging, and room-based conversations.

![Dashboard](./frontend/src/assets/dashboard.png)
![Chat Room](./frontend/src/assets/chatroom.png)

## Features

- 🌐 Real-time messaging with Socket.IO
- 🎨 Modern UI with dark mode support
- 👥 Room-based chat system
- 🚀 User presence indicators
- 🔍 Room search functionality
- 📱 Responsive design
- ⚡ Fast and reliable

## Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- Socket.IO Client
- Framer Motion
- React Router DOM
- React Toastify

### Backend
- Node.js
- Express
- Socket.IO
- MongoDB
- Mongoose

## Live Demo

- Frontend: [https://chat-app-teal-psi.vercel.app](https://chat-app-teal-psi.vercel.app)
- Backend: [https://chat-app-hu6l.onrender.com](https://chat-app-hu6l.onrender.com)

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lets_chat.git
cd lets_chat
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Set up Backend Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
```

4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

5. Set up Frontend Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm start
```

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. Open the application in your browser
2. Create a new room or join an existing one
3. Enter your username when prompted
4. Start chatting!

## Features in Detail

- **Real-Time Communication**: Messages appear instantly using Socket.IO
- **Room Management**: Create and join different chat rooms
- **User Status**: See who's active in each room
- **Search Functionality**: Easily find rooms with the search feature
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Built-in dark mode support for comfortable viewing

## Deployment

The application is deployed using:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web technologies
- Inspired by the need for real-time communication
<<<<<<< HEAD
- Special thanks to the open-source community 
=======
- Special thanks to the open-source community
>>>>>>> origin/main
