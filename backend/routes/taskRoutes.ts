import express from 'express';
import { getTasks, createTask, updateTask } from '../controllers/taskController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
//router.delete('/:id', authMiddleware, deleteTask);


export default router;
