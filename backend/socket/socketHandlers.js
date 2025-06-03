import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

const userSocketMap = new Map(); // socket.id -> userId
const userRoomMap = new Map(); // userId -> roomId(s)

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🟢 New connection: ${socket.id}`);

    socket.on('joinRoom', async ({ roomId, userId }) => {
      socket.join(roomId);
      userSocketMap.set(socket.id, userId);

      // Track which rooms the user joined (support multiple)
      const existingRooms = userRoomMap.get(userId) || new Set();
      existingRooms.add(roomId);
      userRoomMap.set(userId, existingRooms);

      // Update user online status
      const user = await User.findById(userId);
      if (user) {
        user.online = true;
        await user.save();
      }

      // Add to room
      await Room.findByIdAndUpdate(roomId, {
        $addToSet: { activeUsers: userId },
      });

      // Get current active users and emit
      const room = await Room.findById(roomId).populate('activeUsers', 'username');
      io.to(roomId).emit('userJoined', { 
        userId, 
        username: user?.username,
        roomId,
        activeUsers: room.activeUsers.map(u => ({ 
          id: u._id, 
          username: u.username, 
          online: true 
        }))
      });
    });

    socket.on('sendMessage', async ({ userId, roomId, text }) => {
      const message = await Message.create({ 
        sender: userId, 
        room: roomId, 
        content: text 
      });
      const populated = await Message.findById(message._id)
        .populate('sender', 'username');

      io.to(roomId).emit('newMessage', {
        _id: message._id,
        sender: {
          _id: populated.sender._id,
          username: populated.sender.username
        },
        content: text,
        createdAt: message.createdAt,
      });
    });

    socket.on('leaveRoom', async ({ roomId, userId }) => {
      socket.leave(roomId);

      // Update Room
      await Room.findByIdAndUpdate(roomId, {
        $pull: { activeUsers: userId },
      });

      // Update user status if they're not in any other rooms
      const userRooms = userRoomMap.get(userId);
      userRooms?.delete(roomId);
      
      if (!userRooms?.size) {
        const user = await User.findById(userId);
        if (user) {
          user.online = false;
          await user.save();
        }
      }

      io.to(roomId).emit('userLeft', { userId, roomId });

      // Clean up maps
      if (userRooms?.size === 0) {
        userRoomMap.delete(userId);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`🔴 Disconnected: ${socket.id}`);

      const userId = userSocketMap.get(socket.id);
      userSocketMap.delete(socket.id);

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          user.online = false;
          await user.save();
        }

        const rooms = userRoomMap.get(userId) || new Set();
        for (let roomId of rooms) {
          await Room.findByIdAndUpdate(roomId, {
            $pull: { activeUsers: userId },
          });
          io.to(roomId).emit('userLeft', { userId, roomId });
        }

        userRoomMap.delete(userId);
      }
    });
  });
};
