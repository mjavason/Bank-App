import { z } from 'zod';

class Validation {
  // Validation schema for funding a bank account
  fund = {
    body: z.object({
      amount: z.number().positive(),
    }),
  };

  // Validation schema for transferring funds
  transfer = {
    body: z.object({
      // bank_name: z.enum(BANKS_ARRAY),
      to_account: z.string().min(1).max(255),
      amount: z.number().positive(),
    }),
  };

  // Validation schema for getting bank details
  getBankDetails = {
    query: z.object({
      // Define any specific query parameters if needed
    }),
  };
}

export const bankValidation = new Validation();
