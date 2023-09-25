import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
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
import { userService } from '../services';
import logger from '../helpers/logger';
import { signJwt } from '../utils/jwt';
import { ACCESS_TOKEN_SECRET, MESSAGES, REFRESH_TOKEN_SECRET } from '../constants';

class UserController {
  async register(req: Request, res: Response) {
    let existing_user = await userService.checkForDuplicate(req.body.username);

    //Hash password
    try {
      const saltRounds = 10; // You can adjust the number of rounds for security
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
    } catch (error) {
      logger.error('Password hash failed');
      return InternalErrorResponse(res);
    }

    if (existing_user) return ForbiddenResponse(res, 'User already exists');
    const data = await userService.create(req.body);

    if (!data) return InternalErrorResponse(res);

    return SuccessResponse(res, data);
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    // Find the user by username
    const user = await userService.findOneReturnPassword({ username });

    if (!user) return NotFoundResponse(res, 'User not found');

    try {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return ForbiddenResponse(res, 'Invalid password');
    } catch (error) {
      logger.error('Login failed', error);
      return InternalErrorResponse(res);
    }

    // Passwords match, user is authenticated
    const { _id, role } = user;
    let accessToken = await signJwt({ _id, role, username }, ACCESS_TOKEN_SECRET, '48h');
    let refreshToken = await signJwt({_id, role, username}, REFRESH_TOKEN_SECRET, '24h');

    let data = {
      accessToken: accessToken,
      refreshToken: refreshToken
    };

    // Return a success response or the token, depending on your authentication method
    return SuccessResponse(res, data, MESSAGES.LOGGED_IN);
  }
}

export const userController = new UserController();
