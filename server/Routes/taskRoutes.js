import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { createTask, deleteTask, getTask, getTaskById, updateTask } from '../controller/taskcontroller';

const taskRoutes = express.Router();

taskRoutes.route('/task')
    .get(authMiddleware,getTask)
    .post(authMiddleware,createTask)

taskRoutes.route('/:id/task')
    .get(authMiddleware,getTaskById)
    .put(authMiddleware,updateTask)
    .delete(authMiddleware,deleteTask)

export default taskRoutes;