import { Storage } from '@google-cloud/storage'
import { injectable } from 'inversify'
import { type IStorage } from '../../domain/utils/storage'

@injectable()
export class GoogleCloudStorage implements IStorage {
  private readonly storage: Storage

  constructor () {
    this.storage = new Storage()
  }

  async uploadFile (
    bucketName: string,
    fileName: string,
    buffer: Buffer,
    contentType?: string
  ): Promise<void> {
    const bucket = this.storage.bucket(bucketName)
    await bucket.file(fileName).save(buffer, { resumable: false, metadata: { contentType } })
  }

  async downloadFile (bucketName: string, fileName: string): Promise<Buffer> {
    const bucket = this.storage.bucket(bucketName)

    const [isFileExist] = await bucket.file(fileName).exists()

    if (!isFileExist) {
      throw new Error('File not found')
    }

    const contents = await bucket.file(fileName).download()
    return contents[0]
  }

  async deleteFile (bucketName: string, fileName: string): Promise<void> {
    const bucket = this.storage.bucket(bucketName)
    await bucket.file(fileName).delete()
  }
}
