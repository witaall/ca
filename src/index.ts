import express from 'express'
import mongoose from 'mongoose'
import 'reflect-metadata'
import router from './adapters/routers'
import { type IConfig } from './domain/utils/config'
import container from './infrastructure/inversify/inversify.config'
import { TYPES } from './infrastructure/inversify/types'
import { type TypeormDatasource } from './infrastructure/typeorm/datasource'

const app = express()

app.use(express.json())

app.use(router)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  res.status(500).send()
})

const start = async (): Promise<void> => {
  // 3968 - 不同的環境變數取得方式
  const config = container.get<IConfig>(TYPES.GcpSecretManager)
  // const config = container.get<IConfig>(TYPES.DotEnv)
  const port = await config.get('PORT') ?? 99999999

  // 初始化資料庫
  const dataSource = container.get<TypeormDatasource>(TYPES.TypeormDatasource)
  await dataSource.initialize()
  const mongoUri = await config.get('MONGO_URI')

  if (mongoUri == null) {
    throw new Error('MONGO_URI is not defined')
  }

  await mongoose.connect(mongoUri)

  app.listen(port, () => {
    console.log('warn', 'Server Started...')
  })
}

start().catch((error) => {
  console.log('error', 'Server Start Failed', error as object)
})
