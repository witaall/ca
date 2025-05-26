import { type Request, type Response } from 'express'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '../../infrastructure/inversify/types'
import { type IRegisterInputDto } from '../../useCases/registerFileUseDto'
import { IUseCase } from '../../useCases/useCase'

@injectable()
export class AuthController {
  constructor (
    @inject(TYPES.RegisterUseCase) private readonly registerUseCase: IUseCase<IRegisterInputDto, void>
  ) { }

  register = (req: Request, res: Response): void => {
    const { name, email, password, avatar } = req.body

    this.registerUseCase
      .execute({ name, email, password, avatar })
      .then(() => {
        res.status(201).send('User registered')
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  }
}
