import { Router } from 'express'
const router = Router();
import { processRequestBody, processRequestParams, processRequestQuery } from 'zod-express-middleware';
import { demoController } from '../../../controllers';
import { demoValidation } from '../../../validation';

router.get('/', processRequestBody(demoValidation.showDemo.body), demoController.showDemo);


export default router;
