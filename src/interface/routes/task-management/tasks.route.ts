import express from 'express';
import { authMiddleware } from '../../../infrastructure/config/env/middleware/authMiddleware';
import { validateSchema } from '../../../infrastructure/helper/middleware/validateSchema';
import { addTasksSchema } from '../../../domain/schemas/tasks/addTasks.schema';
import { addTasksController } from '../../controllers/tasks/addTasks.Controller';
import { userRepository } from '../../../infrastructure/repositories/user.repository';
import { tasksRepository } from '../../../infrastructure/repositories/tasks.repository';
import { projectsRepository } from '../../../infrastructure/repositories/projects.repository';
import { deleteTasksController } from '../../controllers/tasks/deleteTasks.Controller';
import { taskIdSchema } from '../../../domain/schemas/tasks/taskId.schema';
import { assignTasksController } from '../../controllers/tasks/assignTasks.Controller';
import { assignTasksSchema } from '../../../domain/schemas/tasks/assignTasks.schema';

const tasksRouter = express.Router();

tasksRouter.post('/add-tasks', authMiddleware(), validateSchema(addTasksSchema), addTasksController(projectsRepository, tasksRepository, userRepository))
tasksRouter.put('/assign-tasks/:taskId', authMiddleware(), validateSchema(assignTasksSchema), assignTasksController(tasksRepository))
tasksRouter.delete('/delete-tasks/:taskId', authMiddleware(), validateSchema(taskIdSchema), deleteTasksController(tasksRepository))

export {tasksRouter}