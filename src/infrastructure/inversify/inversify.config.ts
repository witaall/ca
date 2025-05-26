import { Container } from 'inversify'
import { AuthController } from '../../adapters/controllers/authController'
import { OrderController } from '../../adapters/controllers/orderController'
import { type History } from '../../domain/entities/history'
import { type Order } from '../../domain/entities/order'
import { type Payment } from '../../domain/entities/payment'
import { type Product } from '../../domain/entities/product'
import { type IRepository } from '../../domain/repositories/genericRepository'
import { type ITransactionManager } from '../../domain/repositories/transactionManager'
import { type IConfig } from '../../domain/utils/config'
import { type IHttpClient } from '../../domain/utils/httpClient'
import { type IStorage } from '../../domain/utils/storage'
import { CreateOrderUseCase } from '../../useCases/createOrderUseCase'
import { GetOrderListUseCase } from '../../useCases/getOrderListUseCase'
import { RegisterUseCase } from '../../useCases/registerUseCase'
import { AxiosHttpClient } from '../axios/httpClient'
import { DotEnv } from '../dotenv/config'
import { GoogleCloudStorage } from '../gcp/storage'
import { HistoryRepository } from '../mongoose/repositories/historyRepository'
import { FetchHttpClient } from '../node/httpClient'
import { LocalStorage } from '../node/storage'
import { TypeormDatasource } from '../typeorm/datasource'
import { OrderRepository } from '../typeorm/repositories/orderRepository'
import { PaymentRepository } from '../typeorm/repositories/paymentRepository'
import { ProductRepository } from '../typeorm/repositories/productRepository'
import { TransactionManager } from '../typeorm/transactionManager'
import { TYPES } from './types'

const container = new Container()

container.bind<IRepository<Order>>(TYPES.OrderRepository).to(OrderRepository)
container.bind<IRepository<Product>>(TYPES.ProductRepository).to(ProductRepository)
container.bind<IRepository<Payment>>(TYPES.PaymentRepository).to(PaymentRepository)
container.bind<IRepository<History>>(TYPES.HistoryRepository).to(HistoryRepository)

container.bind(TYPES.CreateOrderUseCase).toDynamicValue((context) => {
  const orderRepo = context.container.get<IRepository<Order>>(TYPES.OrderRepository)
  const productRepo = context.container.get<IRepository<Product>>(TYPES.ProductRepository)
  const paymentRepo = context.container.get<IRepository<Payment>>(TYPES.PaymentRepository)
  const historyRepo = context.container.get<IRepository<History>>(TYPES.HistoryRepository)
  const transactionManager = context.container.get<ITransactionManager>(TYPES.TypeormTransactionManager)
  // 3969 - 多個 httpClient 實作
  // const httpClient = context.container.get<IHttpClient>(TYPES.FetchHttpClient)
  const httpClient = context.container.get<IHttpClient>(TYPES.FetchHttpClient)

  return new CreateOrderUseCase(
    orderRepo,
    productRepo,
    paymentRepo,
    historyRepo,
    transactionManager,
    httpClient
  )
})
container.bind(TYPES.GetOrderListUseCase).toDynamicValue((context) => {
  const orderRepo = context.container.get<IRepository<Order>>(TYPES.OrderRepository)

  return new GetOrderListUseCase(orderRepo)
}).inSingletonScope()
container.bind(TYPES.RegisterUseCase).toDynamicValue((context) => {
  // 3970, 3967 - 多個 storage 實作
  const storage = context.container.get<IStorage>(TYPES.GoogleCloudStorage)
  // const storage = context.container.get<IStorage>(TYPES.LocalStorage)
  const httpClient = context.container.get<IHttpClient>(TYPES.FetchHttpClient)

  return new RegisterUseCase(storage, httpClient)
})

container.bind<OrderController>(TYPES.OrderController).to(OrderController)
container.bind<AuthController>(TYPES.AuthController).to(AuthController)

container.bind(TYPES.TypeormTransactionManager).to(TransactionManager)
container.bind<TypeormDatasource>(TYPES.TypeormDatasource).to(TypeormDatasource).inSingletonScope()

container.bind<IConfig>(TYPES.DotEnv).to(DotEnv).inSingletonScope()
container.bind<IConfig>(TYPES.GcpSecretManager).to(DotEnv).inSingletonScope()

container.bind<IHttpClient>(TYPES.FetchHttpClient).to(FetchHttpClient)
container.bind<IHttpClient>(TYPES.AxiosHttpClient).to(AxiosHttpClient)

container.bind<IStorage>(TYPES.LocalStorage).to(LocalStorage)
container.bind<IStorage>(TYPES.GoogleCloudStorage).to(GoogleCloudStorage)

export default container
