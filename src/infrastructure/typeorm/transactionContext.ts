import { type EntityManager } from 'typeorm'
import { type ITransactionContext } from '../../domain/repositories/transactionContext'

export class TypeORMTransactionContext implements ITransactionContext {
  constructor (private readonly manager: EntityManager) {}

  save: <T>(entity: T) => Promise<void> = async (entity) => {
    await this.manager.save(entity)
  }

  async findOne<T>(entityClass: new () => T, criteria: Partial<T>): Promise<T> {
    return await this.manager.getRepository(entityClass).findOneOrFail(criteria) as T
  }
}
