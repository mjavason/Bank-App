import Model from '../database/models/transaction.model';
import Interface from '../interfaces/transaction.interface';

class TransactionService {
  async create(body: object) {
    return await Model.create(body);
  }

  async getAll(pagination: number) {
    return await Model.find({ deleted: false })
      .limit(10)
      .skip(pagination)
      .sort({ createdAt: 'desc' })
      .select('-__v');
  }

  async update(searchDetails: object, update: object) {
    return await Model.findOneAndUpdate({ ...searchDetails, deleted: false }, update, {
      new: true,
    }).select('-__v');
  }

  async find(searchData: object) {
    return await Model.find({ ...searchData, deleted: false }).select('-__v');
  }

  async findOne(searchData: object) {
    return Model.findOne({ ...searchData, deleted: false }).select('-__v');
  }

  async softDelete(searchParams: object) {
    return await Model.findOneAndUpdate(
      { ...searchParams, deleted: false },
      { deleted: true },
      {
        new: true,
      },
    ).select('-__v');
  }

  async hardDelete(searchParams: object) {
    return await Model.findOneAndDelete(searchParams).select('-__v');
  }

  async checkForDuplicate(name: string) {
    // Check for duplicate email
    const existingEmail = await Model.findOne({ name: name }).select('-__v');
    if (existingEmail) return existingEmail;

    return false; // No duplicates found
  }
}

export const transactionService = new TransactionService();
