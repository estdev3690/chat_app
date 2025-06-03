// Example Mongoose model
import Message from '../models/Message.js';

export const createMessage = async (req, res) => {
  const { sender, room, content } = req.body;

  try {
    const message = await Message.create({ sender, room, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ room: roomId }).populate('sender');
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
