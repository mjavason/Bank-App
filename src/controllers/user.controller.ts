import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const ResetToken = require('../models/reset_token.model');
// const UserModel = require('../models/user');
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
import { mailService, resetTokenService, userService } from '../services';
import logger from '../helpers/logger';
import { signJwt } from '../utils/jwt';
import { ACCESS_TOKEN_SECRET, MESSAGES, REFRESH_TOKEN_SECRET } from '../constants';
import { mailController } from '../controllers';

class Controller {
  async hashPassword(password: string) {
    const saltRounds = 10; // You can adjust the number of rounds for security
    return await bcrypt.hash(password, saltRounds);
  }

  async register(req: Request, res: Response) {
    let existing_user = await userService.checkForDuplicate(req.body.username);

    //Hash password
    try {
      const hashedPassword = await this.hashPassword(req.body.password);
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
    let refreshToken = await signJwt({ _id, role, username }, REFRESH_TOKEN_SECRET, '24h');

    let data = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    // Return a success response or the token, depending on your authentication method
    return SuccessResponse(res, data, MESSAGES.LOGGED_IN);
  }

  async resetPasswordMail(req: Request, res: Response) {
    const { email } = req.body;

    // Find the user by email
    const user = await userService.findOne({ email });

    if (!user) return NotFoundResponse(res, 'User not found');

    // Generate a unique reset token
    const token = crypto.randomBytes(32).toString('hex');

    // Set the expiration date to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Save the reset token to the database
    const resetToken = await resetTokenService.create({ user: user._id, token, expiresAt });

    // Send the password reset email
    let mailSent = await mailController.sendPasswordResetEmail(email, token);

    if (!mailSent) return InternalErrorResponse(res, 'Error sending password reset email');

    return SuccessMsgResponse(res, 'Password reset email sent successfully');
  }

  async resetPassword(req: Request, res: Response) {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Find the reset token in the database
    const resetToken = await resetTokenService.findOne({ token });

    if (!resetToken || resetToken.expiresAt < new Date())
      return ForbiddenResponse(res, 'Invalid or expired token');

    // Find the associated user and update their password
    const user = await userService.findOne({ user: resetToken.user });

    if (!user) return res.status(404).json({ message: 'User not found' });

    let hashedPassword = await this.hashPassword(newPassword);
    let updatedUser = await userService.update({ _id: user._id }, { password: hashedPassword });

    if (!updatedUser) return InternalErrorResponse(res, 'Unable to update password');

    // Delete the used reset token
    let usedToken = await resetTokenService.softDelete({ _id: resetToken._id });

    if (!usedToken) return InternalErrorResponse(res, 'Unable to delete token');

    return SuccessMsgResponse(res, 'Password reset successful');
  }
}

export const userController = new Controller();
