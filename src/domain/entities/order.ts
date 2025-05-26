import { type OrderProduct } from './orderProduct'

type TOrderStatus = 'pending' | 'completed'

export class Order {
  constructor (
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly userCode: string,
    private status: TOrderStatus = 'pending',
    private readonly orderProducts: OrderProduct[]
  ) {

  }

  getStatus = (): TOrderStatus => this.status

  complete = (): void => {
    this.status = 'completed'
  }

  getTotalAmount = (): number => {
    return this.orderProducts.reduce((acc, orderProduct) => {
      return acc + orderProduct.calculateAmount()
    }, 0)
  }

  getOrderProducts = (): OrderProduct[] => this.orderProducts

  addOrderProduct = (orderProduct: OrderProduct): void => {
    this.orderProducts.push(orderProduct)
  }

  updateOrderProductQuantity = (productId: string, quantity: number): void => {
    const orderProduct = this.orderProducts.find(p => p.productId === productId)

    if (orderProduct != null) {
      orderProduct.updateQuantity(quantity)
    }
  }
}
