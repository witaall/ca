import { inject, injectable } from 'inversify'
import { In } from 'typeorm'
import { Order } from '../../../domain/entities/order'
import { OrderProduct } from '../../../domain/entities/orderProduct'
import { type IRepository, type IFindOption, type IListAndCount } from '../../../domain/repositories/genericRepository'
import { type ITransactionContext } from '../../../domain/repositories/transactionContext'
import { Order as TypeormOrder } from '../entities/order'
import { OrderProduct as TypeormOrderProduct } from '../entities/orderProduct'
import { TYPES } from '../../inversify/types'
import { TypeormDatasource } from '../datasource'

@injectable()
export class OrderRepository implements IRepository<Order> {
  transactionManager?: ITransactionContext

  constructor (
    @inject(TYPES.TypeormDatasource) private readonly dataSource: TypeormDatasource
  ) {
  }

  async save (data: Order): Promise<void> {
    const order = new TypeormOrder()

    order.id = data.id
    order.createdAt = data.createdAt
    order.userCode = data.userCode
    order.status = data.getStatus()
    order.amount = data.getTotalAmount()
    order.orderProducts = data.getOrderProducts().map(orderProduct => {
      const orderProductEntity = new TypeormOrderProduct()

      orderProductEntity.id = orderProduct.productId
      orderProductEntity.quantity = orderProduct.getQuantity()
      orderProductEntity.unitPrice = orderProduct.unitPrice

      return orderProductEntity
    })

    if (this.transactionManager != null) {
      await this.transactionManager.save(order)
      return
    }

    await this.dataSource
      .getDataSource()
      .getRepository(TypeormOrder)
      .save(order)
  }

  async findById (id: string): Promise<Order> {
    const order = await this.dataSource
      .getDataSource()
      .getRepository(TypeormOrder)
      .findOne({
        where: { id },
        relations: {
          orderProducts: {
            product: true
          }
        }
      })

    if (order == null) {
      throw new Error('Order not found')
    }

    const orderProducts: OrderProduct[] = order.orderProducts?.map(orderProduct => {
      return new OrderProduct(
        orderProduct.product.id,
        orderProduct.quantity,
        orderProduct.unitPrice
      )
    }) ?? []

    return new Order(
      order.id,
      order.createdAt,
      order.userCode,
      order.status,
      orderProducts
    )
  }

  async find (options?: IFindOption): Promise<IListAndCount<Order>> {
    const { ids, limit, offset } = options ?? {}

    const [result, count] = await this.dataSource
      .getDataSource()
      .getRepository(TypeormOrder)
      .findAndCount({
        where: {
          id: ids != null
            ? In(ids)
            : undefined
        },
        relations: {
          orderProducts: {
            product: true
          }
        },
        skip: offset,
        take: limit
      })

    const list = result.map(order => {
      const orderProducts: OrderProduct[] = order.orderProducts?.map(orderProduct => {
        return new OrderProduct(
          orderProduct.product.id,
          orderProduct.quantity,
          orderProduct.unitPrice
        )
      }) ?? []

      return new Order(
        order.id,
        order.createdAt,
        order.userCode,
        order.status,
        orderProducts
      )
    })

    return {
      list,
      count
    }
  }
}
