import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';


interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionRepository.find();

    const incomeTransactionsValues = transactions.filter(transaction =>
      transaction.type === 'income'
    ).map(transaction =>
      transaction.value
    );

    const income: number = incomeTransactionsValues.reduce((a, b) => a + b, 0);

    const outcomeTransactionValues = transactions.filter(transaction =>
      transaction.type === 'outcome'
    ).map(transaction =>
      transaction.value
    );

    const outcome: number = outcomeTransactionValues.reduce((a, b) => a + b, 0);

    return {
      income,
      outcome,
      total: income - outcome
    }
  }
}

export default TransactionsRepository;
