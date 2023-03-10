import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}