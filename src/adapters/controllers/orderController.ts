import { type Request, type Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { z } from 'zod'
import { TYPES } from '../../infrastructure/inversify/types'
import { type ICreateOrderInputDto } from '../../useCases/createOrderDto'
import { type IGetOrderListInputDto, type IGetOrderListOutputDto } from '../../useCases/getOrderListDto'
import { IUseCase } from '../../useCases/useCase'

@injectable()
export class OrderController {
  constructor (
    @inject(TYPES.CreateOrderUseCase) private readonly createOrderUseCase: IUseCase<ICreateOrderInputDto, void>,
    @inject(TYPES.GetOrderListUseCase) private readonly getOrderListUseCase: IUseCase<IGetOrderListInputDto, IGetOrderListOutputDto>
  ) {
  }

  createOrder = (req: Request, res: Response): void => {
    const body = z.object({
      userCode: z.string(),
      products: z.array(z.object({
        productId: z.string(),
        quantity: z.number()
      })),
      paymentMethod: z.enum(['ECPay', 'LinePay'])
    }).parse(req.body)

    this.createOrderUseCase
      .execute(body)
      .then(() => res.status(201).send())
      .catch((err) => {
        console.error(err)
        res.status(500).send()
      })
  }

  getOrderList = (req: Request, res: Response): void => {
    const query = z.object({
      page: z.number().default(1),
      pageSize: z.number().default(10)
    }).parse(req.query)

    this.getOrderListUseCase
      .execute(query)
      .then(output => res.status(200).send(output))
      .catch((err) => {
        console.error(err)
        res.status(500).send()
      })
  }
}
