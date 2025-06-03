import Room from '../models/Room.js';

export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Room name is required' });

    const existing = await Room.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Room already exists' });

    const newRoom = await Room.create({ name });
    res.status(201).json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create room' });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('activeUsers', 'username');
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
};
