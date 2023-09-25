import { Request, Response } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import ResetTokenModel from '../database/models/reset_token.model';
import UserModel from '../database/models/user.model';

class MailController {

}

export const mailController = new MailController();
