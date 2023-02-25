import { IsNotEmpty, IsString } from 'class-validator';

export class LoginOrRegisterDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
