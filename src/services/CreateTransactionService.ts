// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';


interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome',
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category }
    });

    let savedCategory = null;

    if (!checkCategoryExists) {
      const newCategory = categoryRepository.create({
        title: category
      });

      savedCategory = await categoryRepository.save(newCategory);
    }

    const transactionRepository = getCustomRepository(TransactionsRepository);

    const category_id = !checkCategoryExists ? savedCategory?.id : checkCategoryExists.id;

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (balance.total < value) {
        throw new AppError('Value must be greather then a valid balance', 400);
      }
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
