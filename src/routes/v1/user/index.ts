import express from 'express';
const router = express.Router();
import demoRoute from './demo.router';
import isAuth from '../../../middleware/is_auth.middleware';


router.use(isAuth);
router.use('/user', demoRoute);


export default router;
