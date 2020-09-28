import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const checkTransactionExists = await transactionRepository.findOne({
      where: { id }
    });

    if (!checkTransactionExists) {
      throw new AppError('Transaction does not exist', 404);
    }

    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
