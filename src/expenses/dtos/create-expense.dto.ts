import { IsEmail, IsString, IsDate, IsNumber, IsPositive, IsDefined, IsNotEmpty} from 'class-validator';

export class CreateExpenseDto {

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNumber()
  @IsDefined()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsDefined()
  @IsPositive()
  userId: number;

}