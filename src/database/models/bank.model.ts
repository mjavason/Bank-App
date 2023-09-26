import { Schema, model } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate'; // Import the mongoose-autopopulate package
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
      autopopulate: true, // Enable autopopulation for this field
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

// Apply the autopopulate plugin to the schema
BankAccountSchema.plugin(mongooseAutopopulate);

const BankAccountModel = model(DATABASES.BANK_ACCOUNT, BankAccountSchema);

export default BankAccountModel;
