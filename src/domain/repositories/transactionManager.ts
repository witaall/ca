import { type ITransactionContext } from './transactionContext'

export interface ITransactionManager {
  executeInTransaction: <T>(action: (context: ITransactionContext) => Promise<T>) => Promise<T>
}
