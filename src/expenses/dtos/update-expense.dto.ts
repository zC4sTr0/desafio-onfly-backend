import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateExpenseDto {

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  date: Date;

  @IsOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  userId: number;
}