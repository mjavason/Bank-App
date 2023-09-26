import { Request, Response } from 'express';
import { mailService, userService } from '../services';
import { SITE_LINK } from '../constants';
import { ForbiddenResponse } from '../helpers/response';
const fs = require('fs');
const handlebars = require('handlebars');

class MailController {
  async sendWelcomeMail(req: Request, res: Response) {
    // Load the email template
    const templatePath = './email-templates/welcome-email.html';
    const emailTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Compile the template
    const compiledTemplate = handlebars.compile(emailTemplate);

    // Replace placeholders with actual data
    const data = {
      username: 'JohnDoe',
      confirmationLink: 'https://example.com/confirm/12345',
    };

    const renderedEmail = compiledTemplate(data);
  }

  async renderMailTemplate(templatePath: string, data: object) {
    try {
      // Load the email template
      // const templatePath = './email-templates/welcome-email.html';
      const emailTemplate = await fs.readFileAsync(templatePath, 'utf-8');

      // Compile the template
      const compiledTemplate = handlebars.compile(emailTemplate);
      return compiledTemplate(data);
    } catch (e) {
      console.log('Error compiling template');
      return false;
    }
  }

  // Send the reset email
  async sendPasswordResetEmail(email: string, token: string) {
    let user = await userService.findOne({ email });
    if (!user) {
      console.log(`User with email: ${email} does not exist`);
      return false;
    }

    const resetLink = `${SITE_LINK}auth/reset-password/${token}`;
    const data = {
      email: email,
      passwordResetLink: resetLink,
    };

    const renderedEmail = await this.renderMailTemplate('../templates/welcome.html', data);

    if (!renderedEmail) {
      console.log('Mail template not found');
      return false;
    }

    // Send the email
    const info = await mailService.sendMail(
      email,
      user.firstname,
      user.lastname,
      renderedEmail,
      'Password reset',
    );

    console.log(`Password reset email sent to: ${email}`);

    return { info };
  }
}

export const mailController = new MailController();
