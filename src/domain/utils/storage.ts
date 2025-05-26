export interface IStorage {
  uploadFile: (bucketName: string, fileName: string, buffer: Buffer, contentType?: string) => Promise<void>
  downloadFile: (bucketName: string, fileName: string) => Promise<Buffer>
  deleteFile: (bucketName: string, fileName: string) => Promise<void>
}
