import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {
    AuthFailureResponse,
    NotFoundResponse,
    ForbiddenResponse,
    BadRequestResponse,
    InternalErrorResponse,
    SuccessMsgResponse,
    FailureMsgResponse,
    SuccessResponse,
    AccessTokenErrorResponse,
    TokenRefreshResponse,
} from '../helpers/response';
import { demoService } from '../services'

class DemoController {
    async showDemo(req: Request, res: Response) {
        const data = await demoService.showDemo(req.body);
        return SuccessResponse(res, data);
    }
}

export const demoController = new DemoController();
