import express from 'express'
import { loginUser, registerUser } from '../controller/usercontroller.js';

const router = express.Router();

router.get('/registerUser',registerUser);
router.get('/loginUser',loginUser);

 export default router;