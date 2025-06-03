import express from 'express';
import {
  createMessage,
  getMessagesByRoom,
} from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/:roomId', getMessagesByRoom);

export default router;
