export interface ITransactionContext {
  save: <T>(entity: T) => Promise<void>
  findOne: <T>(entityClass: new () => T, criteria: Partial<T>) => Promise<T | undefined>
}
