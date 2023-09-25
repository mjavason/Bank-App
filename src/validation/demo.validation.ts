import { string, object } from 'zod';

class DemoValidation {
  showDemo = {
    body: object({
      message: string({ required_error: 'message is required' }),
      title: string().optional(),
    }),
  };
}

export const demoValidation = new DemoValidation();
