import express from 'express';
import { validateSchema } from '../../../infrastructure/config/env/middleware/validateSchema';
import { registerUserSchema } from '../../../domain/schemas/user/registerUser.schema';
import { LoginUserSchema } from '../../../domain/schemas/user/loginUser.schema';
import { registerUserController } from '../../controllers/user/registerUser.Controller';
import { userRepository } from '../../../infrastructure/repositories/user.repository';
import { loginUserController } from '../../controllers/user/loginUser.Controller';
import { authMiddleware } from '../../../infrastructure/config/env/middleware/authMiddleware';
import { getUsersController } from '../../controllers/user/getUsers.Controller';
import { getUsersSchema } from '../../../domain/schemas/user/getUsers.schema';

const userRouter = express.Router();

userRouter.post('/register', authMiddleware(false), validateSchema(registerUserSchema), registerUserController(userRepository))
userRouter.post('/login', authMiddleware(false), validateSchema(LoginUserSchema), loginUserController(userRepository))
userRouter.get('/profile/:id', authMiddleware(), validateSchema(getUsersSchema), getUsersController(userRepository))

export { userRouter };