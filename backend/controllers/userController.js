import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const newUser = await User.create({ username });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
