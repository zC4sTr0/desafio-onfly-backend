import { Controller, Post, Body, Get} from '@nestjs/common';
import { CreateExpenseDto } from './dtos/create-expense.dto';

@Controller('expenses')
export class ExpensesController {

  @Post('/create')
  createExpense(@Body() body: CreateExpenseDto) {

  }

  

}
