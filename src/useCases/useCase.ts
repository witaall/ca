export interface IUseCase<InputDto, OutputDto> {
  execute: (data: InputDto) => Promise<OutputDto>
}
