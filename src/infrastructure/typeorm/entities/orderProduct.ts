import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Order } from './order'
import { Product } from './product'

@Entity()
export class OrderProduct {
  @PrimaryColumn({
    type: 'varchar',
    length: 36
  })
    id!: string

  @CreateDateColumn()
    createdAt?: Date

  @UpdateDateColumn()
    updatedAt?: Date

  @Column({
    type: 'int',
    comment: '數量'
  })
    quantity!: number

  @Column({
    type: 'int',
    comment: '單價'
  })
    unitPrice!: number

  @ManyToOne(
    () => Product,
    product => product.orderProducts,
    { onDelete: 'CASCADE' }
  )
    product!: Product

  @ManyToOne(
    () => Order,
    order => order.orderProducts,
    { onDelete: 'CASCADE' }
  )
    order!: Order
}
