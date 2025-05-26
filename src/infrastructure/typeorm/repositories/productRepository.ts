import { inject, injectable } from 'inversify'
import { In } from 'typeorm'
import { Product } from '../../../domain/entities/product'
import { type IFindOption, type IListAndCount, type IRepository } from '../../../domain/repositories/genericRepository'
import { Product as TypeormProduct } from '../entities/product'
import { TYPES } from '../../inversify/types'
import { TypeormDatasource } from '../datasource'

@injectable()
export class ProductRepository implements IRepository<Product> {
  constructor (
    @inject(TYPES.TypeormDatasource) private readonly dataSource: TypeormDatasource
  ) {
  }

  async save (data: Product): Promise<void> {
    const typeormProduct = new TypeormProduct()

    typeormProduct.id = data.id
    typeormProduct.name = data.name
    typeormProduct.price = data.price

    await this.dataSource
      .getDataSource()
      .getRepository(TypeormProduct)
      .save(data)
  }

  async findById (id: string): Promise<Product> {
    const product = await this.dataSource
      .getDataSource()
      .getRepository(TypeormProduct)
      .findOne({ where: { id } })

    if (product == null) {
      throw new Error('Product not found')
    }

    return new Product(product.id, product.name, product.price)
  }

  async find (option?: IFindOption): Promise<IListAndCount<Product>> {
    const { ids, limit, offset } = option ?? {}

    const [result, count] = await this.dataSource
      .getDataSource()
      .getRepository(TypeormProduct)
      .findAndCount({
        where: { id: ids != null ? In(ids) : undefined },
        take: limit,
        skip: offset
      })

    const list = result.map(product => new Product(product.id, product.name, product.price))

    return { list, count }
  }
}
