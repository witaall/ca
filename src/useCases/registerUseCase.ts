import { type IHttpClient } from '../domain/utils/httpClient'
import { type IStorage } from '../domain/utils/storage'
import { type IRegisterInputDto } from './registerFileUseDto'
import { type IUseCase } from './useCase'

export class RegisterUseCase implements IUseCase<IRegisterInputDto, void> {
  constructor (
    private readonly storage: IStorage,
    private readonly httpClient: IHttpClient
  ) {
  }

  async execute (registerInfo: IRegisterInputDto): Promise<void> {
    const {
      name,
      email,
      password,
      avatar
    } = registerInfo

    await this.storage.uploadFile('avatars', `${name}.png`, avatar, 'image/png')

    await this.httpClient.post('https://api.example.com/register', {
      name,
      email,
      password
    })
  }
}
