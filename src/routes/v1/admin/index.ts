import express from 'express';
const router = express.Router();
import demoRoute from './demo.router';
import isAdmin from '../../../middleware/is_admin.middleware';


router.use(isAdmin);
router.use('/demoadmin', demoRoute);


export default router;
