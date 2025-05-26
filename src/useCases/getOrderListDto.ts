export interface IGetOrderListInputDto {
  page: number
  pageSize: number
}

export interface IGetOrderListOutputDto {
  orders: Array<{
    id: string
    status: 'pending' | 'completed' | 'failed'
    // paymentMethod: 'ECPay' | 'LinePay'
    amount: number
  }>
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}
