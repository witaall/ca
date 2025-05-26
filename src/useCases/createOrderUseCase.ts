import { History } from '../domain/entities/history'
import { Order } from '../domain/entities/order'
import { OrderProduct } from '../domain/entities/orderProduct'
import { Payment } from '../domain/entities/payment'
import { type Product } from '../domain/entities/product'
import { type IRepository } from '../domain/repositories/genericRepository'
import { type ITransactionManager } from '../domain/repositories/transactionManager'
import { type IHttpClient } from '../domain/utils/httpClient'
import { type ICreateOrderInputDto } from './createOrderDto'
import { type IUseCase } from './useCase'

export class CreateOrderUseCase implements IUseCase<ICreateOrderInputDto, void> {
  private readonly notifyUrl = 'https://notifier-api-jpgz7bsnyq-de.a.run.app'

  constructor (
    private readonly orderRepository: IRepository<Order>,
    private readonly productRepository: IRepository<Product>,
    private readonly paymentRepository: IRepository<Payment>,
    private readonly historyRepository: IRepository<History>,
    private readonly transactionManager: ITransactionManager,

    private readonly httpClient: IHttpClient
  ) { }

  async execute (data: ICreateOrderInputDto): Promise<void> {
    // 建立歷史紀錄
    const history = new History(
      crypto.randomUUID(),
      'use case',
      'create order',
      new Date()
    )
    await this.historyRepository.save(history)

    // 取得商品
    const { list: products } = await this.productRepository.find({
      ids: data.products.map(p => p.productId)
    })

    await this.transactionManager.executeInTransaction(async (context) => {
      // 初始設定 transactionManager
      this.orderRepository.transactionManager = context
      this.paymentRepository.transactionManager = context

      // 建立訂單
      const order = new Order(
        crypto.randomUUID(),
        new Date(),
        data.userCode,
        'pending',
        []
      )

      data.products.forEach(p => {
        const product = products.find(product => product.id === p.productId)

        if (product == null) {
          throw new Error('Product not found')
        }

        const orderProduct = new OrderProduct(product.id, p.quantity, product.price)

        order.addOrderProduct(orderProduct)
      })

      await this.orderRepository.save(order)

      // 建立付款
      const paymentId = crypto.randomUUID()
      const payment = new Payment(
        paymentId,
        'pending',
        null,
        data.paymentMethod,
        order.getTotalAmount(),
        [{
          orderId: order.id,
          paymentId
        }]
      )

      await this.paymentRepository.save(payment)

      // 通知使用者
      await this.httpClient.post(this.notifyUrl, {
        orderId: order.id,
        userCode: data.userCode
      })
    })
  }
}
