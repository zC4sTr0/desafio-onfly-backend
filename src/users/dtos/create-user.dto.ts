import { IsEmail, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator/types/decorator/decorators';

export class CreateUserDto {

  @IsEmail()
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