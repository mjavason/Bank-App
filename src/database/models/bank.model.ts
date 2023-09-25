import { Schema, model } from 'mongoose';
import { DATABASES } from '../../constants';
import IBankAccount from '../../interfaces/bank.interface';

const BankAccountSchema = new Schema<IBankAccount>(
  {
    account_number: {
      type: String,
      unique: true,
      required: true,
    },
    account_holder: {
      type: Schema.Types.ObjectId,
      ref: DATABASES.USER, // Reference to the user who owns this account
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    deleted: {
      type: Schema.Types.Boolean,
      required: true,
      select: false,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const BankAccountModel = model(DATABASES.BANK_ACCOUNT, BankAccountSchema);

export default BankAccountModel;
