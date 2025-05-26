import { type ITransactionContext } from './transactionContext'

export interface IRepository<T> {
  transactionManager?: ITransactionContext
  save: (data: T) => Promise<void>
  findById: (id: string) => Promise<T>
  find: (options?: IFindOption) => Promise<IListAndCount<T>>
}

export interface IFindOption {
  limit?: number
  offset?: number
  ids?: string[]
}

export interface IListAndCount<T> {
  list: T[]
  count: number
}
