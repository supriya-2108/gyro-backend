import {Router} from 'express';
const userRouter = Router();
import { check, validationResult } from 'express-validator';
import { createGyroUser, getOtp, loginGyroUsers } from '../controllers/gyro_users_controller.js';

userRouter.post('/get_otp',[
    check('email','Email is required').not().isEmail(),
],
 getOtp
)

userRouter.post('/create_user',[
    check('email','Email is required').not().isEmail(),
    check('password','Password is required').not().isEmpty(),
    check('number','Number is required').not().isEmpty(),
    check('otp','OTP is required').not().isEmpty(),
],
 createGyroUser
)

userRouter.post('/login_user',[
    check('email','Email is required').not().isEmail(),
    check('password','Password is required').not().isEmpty(),
],
 loginGyroUsers
)

export default userRouter;