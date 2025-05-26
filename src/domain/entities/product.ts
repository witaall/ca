export const PRODUCT_NAMES = [
  'application_regulation_fee',
  'application_basic_service_fee',
  'application_advanced_service_fee',
  'excess_item_fee',
  'special_excess_item_fee'
] as const

export type TProductName = typeof PRODUCT_NAMES[number]

export class Product {
  constructor (
    public readonly id: string,
    public readonly name: TProductName,
    public readonly price: number
  ) {
    if (price <= 0) {
      throw new Error('Price must be greater than 0')
    }
  }
}
