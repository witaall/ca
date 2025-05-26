import { type Order } from '../domain/entities/order'
import { type IRepository } from '../domain/repositories/genericRepository'
import { type IGetOrderListInputDto, type IGetOrderListOutputDto } from './getOrderListDto'
import { type IUseCase } from './useCase'

export class GetOrderListUseCase implements IUseCase<IGetOrderListInputDto, IGetOrderListOutputDto> {
  constructor (
    private readonly orderRepository: IRepository<Order>
  ) {

  }

  execute = async (input: IGetOrderListInputDto): Promise<IGetOrderListOutputDto> => {
    const { page, pageSize } = input

    const { list, count } = await this.orderRepository.find({
      limit: pageSize,
      offset: (page - 1) * pageSize
    })

    return {
      orders: list.map(order => ({
        id: order.id,
        status: order.getStatus(),
        amount: order.getTotalAmount()
      })),
      pagination: {
        page,
        pageSize,
        total: count
      }
    }
  }
}
