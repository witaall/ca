import { type OrderPayment } from './orderPayment'

export class Payment {
  readonly providerReference: string
  readonly fee = 0

  constructor (
    readonly id: string,
    private status: 'pending' | 'completed' | 'failed',
    readonly message: string | null | undefined,
    readonly paymentMethod: 'ECPay' | 'LinePay',
    readonly amount: number,
    private readonly orderPayments: OrderPayment[]
  ) {
    this.providerReference = crypto.randomUUID().slice(0, 10)
  }

  getOrderPayments = (): OrderPayment[] => this.orderPayments

  addOrderPayment = (orderPayment: OrderPayment): void => {
    this.orderPayments.push(orderPayment)
  }

  getStatus = (): 'pending' | 'completed' | 'failed' => this.status

  setStatus = (status: 'pending' | 'completed' | 'failed'): void => {
    this.status = status
  }
}
