import { Column, CreateDateColumn, Entity, Index, ManyToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Order } from './order'

export const PAYMENT_METHOD = ['ECPay', 'LinePay'] as const
export type TPaymentMethod = typeof PAYMENT_METHOD[number]

/**
 * 付款狀態
 * - pending: 未付款
 * - completed: 已付款
 * - toConfirm: 待確認 (已填寫末五碼，但尚未確認)
 * - failed: 付款失敗
 */
export const PAYMENT_STATUS = ['pending', 'completed', 'failed'] as const
export type TPaymentStatus = typeof PAYMENT_STATUS[number]

@Entity()
export class Payment {
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
    comment: '狀態',
    type: 'enum',
    enum: PAYMENT_STATUS
  })
    status!: TPaymentStatus

  @Column({
    comment: '交易訊息',
    type: 'varchar',
    length: 255,
    nullable: true
  })
    message?: string | null

  @Column({
    type: 'enum',
    enum: PAYMENT_METHOD,
    comment: '付款方式'
  })
    paymentMethod!: TPaymentMethod

  @Column({
    comment: '金額'
  })
    amount!: number

  @Column({
    comment: '手續費',
    type: 'int'
  })
    fee!: number

  @Index({ unique: true })
  @Column({
    comment: '第三方支付提供者參考編號',
    nullable: true
  })
    providerReference!: string

  @ManyToMany(() => Order, order => order.payments)
    orders?: Order[]
}
