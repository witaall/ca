const TYPES = {
  OrderController: Symbol.for('OrderController'),
  AuthController: Symbol.for('AuthController'),

  OrderRepository: Symbol.for('OrderRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
  PaymentRepository: Symbol.for('PaymentRepository'),
  HistoryRepository: Symbol.for('HistoryRepository'),

  CreateOrderUseCase: Symbol.for('CreateOrderUseCase'),
  GetOrderListUseCase: Symbol.for('GetOrderListUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),

  TypeormTransactionManager: Symbol.for('TypeormTransactionManager'),
  TypeormDatasource: Symbol.for('TypeormDatasource'),

  GcpSecretManager: Symbol.for('GcpSecretManager'),
  DotEnv: Symbol.for('DotEnv'),

  FetchHttpClient: Symbol.for('FetchHttpClient'),
  AxiosHttpClient: Symbol.for('AxiosHttpClient'),

  LocalStorage: Symbol.for('LocalStorage'),
  GoogleCloudStorage: Symbol.for('GoogleCloudStorage')
}

export { TYPES }
