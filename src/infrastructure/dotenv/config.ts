import { injectable } from 'inversify'
import dotenv from 'dotenv'
import { type IConfig } from '../../domain/utils/config'

@injectable()
export class DotEnv implements IConfig {
  constructor () {
    dotenv.config()
  }

  async get (key: string): Promise<string | undefined> {
    return process.env[key]
  }
}
