import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { type IConfig } from '../../domain/utils/config'
import { injectable } from 'inversify'

@injectable()
export class SecretManager implements IConfig {
  private readonly projectId: string = 'aipluxer-sandbox'

  async get (key: string): Promise<string | undefined> {
    const client = new SecretManagerServiceClient()
    const [version] = await client.accessSecretVersion({
      name: `projects/${this.projectId}/secrets/${key}/versions/latest`
    })

    return version?.payload?.data?.toString()
  }
}
