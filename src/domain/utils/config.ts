export interface IConfig {
  get: (key: string) => Promise<string | undefined>
}
