import { z } from 'zod';

class BankValidation {
  // Validation schema for creating a bank account
  create = {
    body: z.object({
      account_number: z.string().min(1).max(255),
      account_holder: z.string().min(1).max(255),
    }),
  };

  // Validation schema for funding a bank account
  fund = {
    body: z.object({
      account_number: z.string().min(1).max(255),
      amount: z.number().positive(),
    }),
  };

  // Validation schema for transferring funds
  transfer = {
    body: z.object({
      from_account: z.string().min(1).max(255),
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

export const bankValidation = new BankValidation();
