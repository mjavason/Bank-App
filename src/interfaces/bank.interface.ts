import { Document, Types } from 'mongoose';

// Define the interface
export default interface IBankAccount extends Document {
  _id?: string | Types.ObjectId;
  account_number: string;
  account_holder: Types.ObjectId;
  balance: number;
  deleted?: boolean;
}
