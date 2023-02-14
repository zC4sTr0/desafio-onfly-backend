import { IsEmail, IsString, IsDate, IsNumber, IsPositive, IsDefined} from 'class-validator';
import { IsNotEmpty } from 'class-validator/types/decorator/decorators';

export class CreateExpenseDto {

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNumber()
  @IsDefined()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsDefined()
  @IsPositive()
  userId: number;

}