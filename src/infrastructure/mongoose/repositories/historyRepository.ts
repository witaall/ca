import { injectable } from 'inversify'
import { History } from '../../../domain/entities/history'
import { type IListAndCount, type IRepository } from '../../../domain/repositories/genericRepository'
import { HistoryModel } from '../models/history'

@injectable()
export class HistoryRepository implements IRepository<History> {
  async save (history: History): Promise<void> {
    const historyModel = {
      type: history.type,
      message: history.message,
      createdAt: history.createdAt
    }

    await HistoryModel.create(historyModel)
  }

  async findById (id: string): Promise<History> {
    const historyModel = await HistoryModel.findById(id)

    if (historyModel == null) {
      throw new Error('History not found')
    }

    const history = new History(
      historyModel.id,
      historyModel.type,
      historyModel.message,
      historyModel.createdAt
    )

    return history
  }

  async find (): Promise<IListAndCount<History>> {
    throw new Error('Method not implemented.')
  }
}
