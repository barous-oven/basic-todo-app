export class CreateUserRequestDto {
  email: string;
  password: string;
  name?: string;
}

export class CreateUserResponseDto {
  id: string;
}
