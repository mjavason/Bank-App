import { Request, Response } from 'express';
import { bankService } from '../services';
import {
  SuccessResponse,
  InternalErrorResponse,
  SuccessMsgResponse,
  NotFoundResponse,
  ForbiddenResponse,
  BadRequestResponse,
} from '../helpers/response';
import { MESSAGES } from '../constants';

async function generateUniqueBankAccountNumber() {
  while (true) {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number

    const accountNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const accountNumberStr = accountNumber.toString();

    const existingAccount = await bankService.findOne({ account_number: accountNumberStr });

    if (!existingAccount) return accountNumberStr;
  }
}

class Controller {
  async create(req: Request, res: Response) {
    const userId = res.locals.user._id;

    const userBankDetails = await bankService.findOne({ account_holder: userId });

    if (userBankDetails) return ForbiddenResponse(res, 'Bank account already exists');

    req.body.account_number = await generateUniqueBankAccountNumber();
    req.body.account_holder = userId;

    const data = await bankService.create(req.body);

    if (!data) return InternalErrorResponse(res);

    return SuccessResponse(res, data);
  }

  async getAll(req: Request, res: Response) {
    let pagination = parseInt(req.params.pagination);
    if (!pagination) pagination = 1;
    const data = await bankService.getAll(pagination);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async find(req: Request, res: Response) {
    const data = await bankService.find(req.query);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = await bankService.update({ _id: id }, req.body);

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.UPDATED);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await bankService.softDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }

  // Admins only
  async hardDelete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await bankService.hardDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }

  async getBankDetails(req: Request, res: Response) {
    const userId = res.locals.user._id;

    const data = await bankService.findOne({ account_holder: userId });

    if (!data) return NotFoundResponse(res, 'Bank account not found');

    return SuccessResponse(res, data);
  }

  async transfer(req: Request, res: Response) {
    const userId = res.locals.user._id;
    const recipientAccountNumber = req.body.to_account;
    const amountToTransfer = req.body.amount;

    const userBankDetails = await bankService.findOne({ account_holder: userId });
    const recipientBankDetails = await bankService.findOne({
      account_number: recipientAccountNumber,
    });

    if (!userBankDetails) return NotFoundResponse(res, 'You dont have a bank account');

    if (!recipientBankDetails) return NotFoundResponse(res, 'User bank account doesnt exist');

    if (userBankDetails.balance < amountToTransfer)
      return ForbiddenResponse(res, 'Insufficient funds');

    const updatedUserBankDetails = await bankService.update(
      { _id: userBankDetails._id },
      { balance: userBankDetails.balance - amountToTransfer },
    );

    const updatedRecipientBankDetails = await bankService.update(
      { _id: userBankDetails._id },
      { balance: userBankDetails.balance - amountToTransfer },
    );

    if (!updatedUserBankDetails)
      return InternalErrorResponse(res, 'Unable to update user bank details');
    if (!updatedRecipientBankDetails)
      return InternalErrorResponse(res, 'Unable to update recipient bank details');

    return SuccessResponse(res, updatedUserBankDetails);
  }

  async fund(req: Request, res: Response) {
    const userId = res.locals.user._id;
    const amount = req.body.amount;

    const userBankDetails = await bankService.findOne({ account_holder: userId });

    if (!userBankDetails) return NotFoundResponse(res, 'You dont have a bank account');

    const updatedUserBankDetails = await bankService.update(
      { _id: userBankDetails._id },
      { balance: userBankDetails.balance + amount },
    );

    if (!updatedUserBankDetails)
      return InternalErrorResponse(res, 'Unable to update user bank details');

    return SuccessResponse(res, updatedUserBankDetails);
  }


}

export const bankController = new Controller();
