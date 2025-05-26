import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { PRODUCT_NAMES, TProductName } from '../../../domain/entities/product'
import { OrderProduct } from './orderProduct'

@Entity()
export class Product {
  @PrimaryColumn({
    type: 'varchar',
    length: 36
  })
    id!: string

  @CreateDateColumn()
    createdAt?: Date

  @UpdateDateColumn()
    updatedAt?: Date

  @Index({ unique: true })
  @Column({
    type: 'enum',
    comment: '產品名稱',
    enum: PRODUCT_NAMES
  })
    name!: TProductName

  @Column({
    type: 'int',
    comment: '價格'
  })
    price!: number

  @Column({
    type: 'varchar',
    comment: '描述'
  })
    description!: string

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
    orderProducts?: OrderProduct[]
}
