import { z } from 'zod';
class AuthValidation {
  // Validation schema for user registration
  register = {
    body: z.object({
      firstname: z.string().min(1).max(255),
      lastname: z.string().min(1).max(255),
      username: z.string().min(1).max(255),
      role: z.enum(['teacher', 'student', 'admin']),
      password: z.string().min(5), // Adjust the password requirements as needed
    }),
  };

  // Validation schema for user login
  login = {
    body: z.object({
      username: z.string().min(1).max(255),
      password: z.string().min(5), // Adjust the password requirements as needed
    }),
  };
}

export const authValidation = new AuthValidation();
