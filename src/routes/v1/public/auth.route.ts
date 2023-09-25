import { Router } from 'express';
const router = Router();

import {
  processRequestBody,
  processRequestParams,
  processRequestQuery,
} from 'zod-express-middleware';
import { userController } from '../../../controllers';
import { authValidation } from '../../../validation';

router.post('/register', processRequestBody(authValidation.register.body), userController.register);
router.post('/login', processRequestBody(authValidation.login.body), userController.login);

export default router;
