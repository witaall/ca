import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { OrderProduct } from './orderProduct'
import { Payment } from './payment'

export const ORDER_STATUS = ['pending', 'completed'] as const
export type TOrderStatus = typeof ORDER_STATUS[number]

@Entity()
export class Order {
  @PrimaryColumn({
    type: 'varchar',
    length: 36
  })
    id!: string

  @CreateDateColumn()
    createdAt!: Date

  @UpdateDateColumn()
    updatedAt!: Date

  @Column({
    type: 'varchar',
    length: 21,
    comment: '使用者代碼'
  })
    userCode!: string

  @Column({
    comment: '狀態',
    type: 'enum',
    enum: ORDER_STATUS
  })
    status!: TOrderStatus

  @Column({
    comment: '金額'
  })
    amount!: number

  @Column({
    comment: '稅費',
    default: 0
  })
    tax!: number

  @Column({
    comment: '手續費',
    default: 0
  })
    fee!: number

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
    orderProducts?: OrderProduct[]

  @ManyToMany(() => Payment, payment => payment.orders)
    payments?: Payment[]
}
