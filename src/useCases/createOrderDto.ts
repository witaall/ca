export interface ICreateOrderInputDto {
  userCode: string
  products: Array<{
    productId: string
    quantity: number
  }>
  paymentMethod: 'ECPay' | 'LinePay'
}
