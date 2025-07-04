import express from 'express'
import { getCurrentUser, loginUser, registerUser, updatePassword, updateUser } from '../controller/usercontroller.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router();

//public routes
userRouter.post('/registerUser',registerUser);
userRouter.post('/loginUser',loginUser);


//private routes
userRouter.get('/me',authMiddleware,getCurrentUser);
userRouter.put('/profile',authMiddleware,updateUser);
userRouter.put('/password',authMiddleware,updatePassword);

 export default userRouter;