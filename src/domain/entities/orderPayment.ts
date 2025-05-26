export class OrderPayment {
  constructor (
    public readonly orderId: string,
    public readonly paymentId: string
  ) {}
}
