import { Router } from 'express';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/taskController.js';
import { validateQuery, validateTaskInput } from '../middleware/validateTask.js';

const router = Router();
router.route('/').post(validateTaskInput, createTask).get(validateQuery, getTasks);
router.route('/:id').get(getTask).put(validateTaskInput, updateTask).delete(deleteTask);
export default router;
