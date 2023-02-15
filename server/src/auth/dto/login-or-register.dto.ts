import {
  IsNotEmpty,
  IsString,
  // IsStrongPassword,
  Length,
} from 'class-validator';

export class LoginOrRegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 18)
  username: string;

  @IsString()
  @IsNotEmpty()
  // @IsStrongPassword({
  //   minLength: 6,
  //   minLowercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   minUppercase: 1,
  // })
  password: string;
}
