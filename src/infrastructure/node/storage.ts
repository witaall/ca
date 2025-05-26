import { injectable } from 'inversify'
import { type IStorage } from '../../domain/utils/storage'
import { readFile, writeFile } from 'fs/promises'

@injectable()
export class LocalStorage implements IStorage {
  async uploadFile (
    bucketName: string,
    fileName: string,
    buffer: Buffer
  ): Promise<void> {
    await writeFile(`./${bucketName}/${fileName}`, buffer)
  }

  async downloadFile (bucketName: string, fileName: string): Promise<Buffer> {
    const buffer = await readFile(`./${bucketName}/${fileName}`)

    return buffer
  }

  async deleteFile (bucketName: string, fileName: string): Promise<void> {
    await writeFile(`./${bucketName}/${fileName}`, '')
  }
}
