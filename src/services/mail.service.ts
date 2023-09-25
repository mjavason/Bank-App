import nodeMailer from 'nodemailer';

// Email account setup and login. You need to pass in your email credentials and use this app to control it.
const transporter = nodeMailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

class MailService {
  sendRegularMail = async (
    senderEmail: string,
    recipientEmail: string,
    recipientFirstName: string,
    recipientLastName: string,
    mailHtmlBody: string,
    mailSubject: string,
  ) => {
    // This is where the actual email message is built. Things like CC, recipients, attachments, and so on are configured here.
    return await transporter.sendMail({
      from: `CraftHire <${senderEmail}>`,
      to: recipientEmail,
      subject: mailSubject,
      html: mailHtmlBody,
    });
  };

  // Send the reset email
  sendPasswordResetEmail = async (email: string, token: string) => {
    try {
      // Generate the reset link with the provided token
      const resetLink = `https://yourwebsite.com/reset-password/${token}`;

      // Define the email content
      const mailOptions = {
        from: 'your-email@gmail.com', // Sender's email address
        to: email, // Recipient's email address
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetLink}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      console.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };
}

export default new MailService();
