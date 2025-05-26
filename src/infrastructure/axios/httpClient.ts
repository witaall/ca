import axios from 'axios'
import { injectable } from 'inversify'

@injectable()
export class AxiosHttpClient {
  async get<T>(url: string): Promise<T> {
    const response = await axios.get<T>(url)
    return response.data
  }

  async post<T>(url: string, body: object): Promise<T> {
    const response = await axios.post<T>(url, body)
    return response.data
  }
}
