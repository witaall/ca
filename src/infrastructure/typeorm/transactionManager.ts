import { inject, injectable } from 'inversify'
import { type ITransactionContext } from '../../domain/repositories/transactionContext'
import { type ITransactionManager } from '../../domain/repositories/transactionManager'
import { TypeORMTransactionContext } from './transactionContext'
import { TYPES } from '../inversify/types'
import { TypeormDatasource } from './datasource'

@injectable()
export class TransactionManager implements ITransactionManager {
  constructor (
    @inject(TYPES.TypeormDatasource) private readonly dataSource: TypeormDatasource
  ) {
  }

  async executeInTransaction<T>(action: (context: ITransactionContext) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.getDataSource().createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const transactionContext = new TypeORMTransactionContext(queryRunner.manager)

    try {
      const result = await action(transactionContext)
      await queryRunner.commitTransaction()
      return result
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
}
