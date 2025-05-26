export class OrderProduct {
  constructor (
    public readonly productId: string,
    private quantity: number,
    public unitPrice: number
  ) {}

  getQuantity = (): number => this.quantity

  updateQuantity = (quantity: number): void => {
    this.quantity = quantity
  }

  calculateAmount = (): number => this.quantity * this.unitPrice
}
