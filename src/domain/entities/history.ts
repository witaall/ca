export class History {
  constructor (
    public readonly id: string,
    public readonly type: string,
    public readonly message: string,
    public readonly createdAt: Date
  ) {}
}
