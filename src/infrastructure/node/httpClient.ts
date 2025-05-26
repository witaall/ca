import { injectable } from 'inversify'
import { type IHttpClient } from '../../domain/utils/httpClient'

@injectable()
export class FetchHttpClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    return await response.json() as T
  }

  async post<T>(url: string, body: object): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return await response.json() as T
  }
}
