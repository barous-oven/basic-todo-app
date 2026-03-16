export class GetUserResponseDto {
  id: string;
  email: string;
  name?: string;

  constructor(partial: Partial<GetUserResponseDto>) {
    Object.assign(this, partial);
  }
}
