import { inject, injectable } from 'inversify'
import { In } from 'typeorm'
import { OrderPayment } from '../../../domain/entities/orderPayment'
import { Payment } from '../../../domain/entities/payment'
import { type IFindOption, type IListAndCount, type IRepository } from '../../../domain/repositories/genericRepository'
import { type ITransactionContext } from '../../../domain/repositories/transactionContext'
import { Order as TypeormOrder } from '../entities/order'
import { Payment as TypeormPayment } from '../entities/payment'
import { TYPES } from '../../inversify/types'
import { TypeormDatasource } from '../datasource'

@injectable()
export class PaymentRepository implements IRepository<Payment> {
  transactionManager?: ITransactionContext

  constructor (
    @inject(TYPES.TypeormDatasource) private readonly dataSource: TypeormDatasource
  ) {
  }

  async save (data: Payment): Promise<void> {
    const typeormPayment = new TypeormPayment()

    typeormPayment.id = data.id
    typeormPayment.paymentMethod = data.paymentMethod
    typeormPayment.amount = data.amount
    typeormPayment.providerReference = data.providerReference
    typeormPayment.status = data.getStatus()
    typeormPayment.message = data.message
    typeormPayment.fee = data.fee

    const typeormOrderIds = data.getOrderPayments().map(orderPayment => orderPayment.orderId)
    const typeormOrders = await this.dataSource
      .getDataSource()
      .getRepository(TypeormOrder)
      .find({ where: { id: In(typeormOrderIds) } })

    typeormPayment.orders = typeormOrders

    if (this.transactionManager != null) {
      await this.transactionManager.save(typeormPayment)
      return
    }

    await this.dataSource
      .getDataSource()
      .getRepository(TypeormPayment)
      .save(typeormPayment)
  }

  async findById (id: string): Promise<Payment> {
    const typeormPayment = await this.dataSource
      .getDataSource()
      .getRepository(TypeormPayment)
      .findOne({
        where: { id },
        relations: {
          orders: true
        }
      })

    if (typeormPayment == null) {
      throw new Error('Payment not found')
    }

    const orderIds = typeormPayment.orders?.map(order => order.id) ?? []
    const orderPayments = orderIds.map(orderId => {
      return new OrderPayment(orderId, typeormPayment.id)
    })

    return new Payment(
      typeormPayment.id,
      typeormPayment.status,
      typeormPayment.message,
      typeormPayment.paymentMethod,
      typeormPayment.amount,
      orderPayments
    )
  }

  async find (options?: IFindOption): Promise<IListAndCount<Payment>> {
    const { ids, limit, offset } = options ?? {}

    const [result, count] = await this.dataSource
      .getDataSource()
      .getRepository(TypeormPayment)
      .findAndCount({
        where: {
          id: ids != null
            ? In(ids)
            : undefined
        },
        relations: {
          orders: true
        },
        skip: offset,
        take: limit
      })

    const list = result.map(payment => {
      return new Payment(
        payment.id,
        payment.status,
        payment.message,
        payment.paymentMethod,
        payment.amount,
        payment.orders?.map(order => new OrderPayment(order.id, payment.id)) ?? []
      )
    })

    return {
      list,
      count
    }
  }
}
