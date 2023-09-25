import { Router } from 'express';
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const ResetToken = require('../models/reset_token.model');
const UserModel = require('../models/user');
const router = Router();
import {
  processRequestBody,
  processRequestParams,
  processRequestQuery,
} from 'zod-express-middleware';
import { userController } from '../../../controllers';
import { authValidation } from '../../../validation';




// routes/auth.js


// // Generate a unique reset token and send a reset email
// router.post('/reset-password', async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Generate a unique reset token
//     const token = crypto.randomBytes(32).toString('hex');
    
//     // Set the expiration date to 1 hour from now
//     const expiresAt = new Date();
//     expiresAt.setHours(expiresAt.getHours() + 1);

//     // Save the reset token to the database
//     const resetToken = new ResetToken({ user: user._id, token, expiresAt });
//     await resetToken.save();

//     // Send the reset email
//     const transporter = nodemailer.createTransport({
//       // Configure your email provider here (e.g., Gmail, SMTP)
//     });

//     const resetLink = `https://yourwebsite.com/reset-password/${token}`;

//     const mailOptions = {
//       from: 'your@email.com',
//       to: email,
//       subject: 'Password Reset Request',
//       text: `Click the following link to reset your password: ${resetLink}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'Password reset email sent' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // routes/auth.js
// // ...

// // Reset the user's password
// router.post('/reset-password/:token', async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     // Find the reset token in the database
//     const resetToken = await ResetToken.findOne({ token });

//     if (!resetToken || resetToken.expiresAt < new Date()) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     // Find the associated user and update their password
//     const user = await User.findById(resetToken.user);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.password = newPassword;
//     await user.save();

//     // Delete the used reset token
//     await resetToken.remove();

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });



router.post('/register', processRequestBody(authValidation.register.body), userController.register);
router.post('/login', processRequestBody(authValidation.login.body), userController.login);

export default router;
