import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}