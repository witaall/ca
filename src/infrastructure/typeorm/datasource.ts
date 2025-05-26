import { inject, injectable } from 'inversify'
import path from 'path'
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { TYPES } from '../inversify/types'
import { IConfig } from '../../domain/utils/config'

@injectable()
export class TypeormDatasource {
  private datasource?: DataSource

  constructor (
    @inject(TYPES.DotEnv) private readonly config: IConfig
  ) {

  }

  async initialize (): Promise<void> {
    const dataSource: DataSource = new DataSource({
      type: 'mysql',
      host: await this.config.get('DB_HOST'),
      port: Number(await this.config.get('DB_PORT')),
      username: await this.config.get('DB_USERNAME'),
      password: await this.config.get('DB_PASSWORD'),
      database: await this.config.get('DB_DATABASE'),
      namingStrategy: new SnakeNamingStrategy(),
      migrationsTableName: 'typeorm_migrations',
      entities: [path.join(__dirname, './entities/**', '*.{ts,js}')],
      migrations: [path.join(__dirname, './migrations/**', '*.{ts,js}')]
    })

    await dataSource.initialize()

    this.datasource = dataSource
  }

  getDataSource (): DataSource {
    if (this.datasource == null) {
      throw new Error('DataSource is not initialized')
    }

    return this.datasource
  }
}
