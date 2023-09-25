import mongoose, { Schema, Model } from 'mongoose';
import autopopulate from 'mongoose-autopopulate'; // Import the mongoose-autopopulate plugin
import { DATABASES } from '../../constants';
import ITransaction from '../../interfaces/transaction.interface';

// Define the schema
const transactionSchema = new Schema<ITransaction>(
  {
    from_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DATABASES.BANK_ACCOUNT, // Reference to the BankAccount model using the constant
      required: true,
      autopopulate: true, // Enable autopopulation
    },
    to_account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DATABASES.BANK_ACCOUNT, // Reference to the BankAccount model using the constant
      required: true,
      autopopulate: true, // Enable autopopulation
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
transactionSchema.plugin(autopopulate);

// Define the model
const TransactionModel: Model<ITransaction> = mongoose.model<ITransaction>(
  DATABASES.TRANSACTION, // Use the constant for the collection name
  transactionSchema,
);

export { ITransaction, TransactionModel };
