import { Controller, Post, Body, Delete, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpensesService } from './expenses.service';
import { UpdateExpenseDto } from './dtos/update-expense.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {
  }
  
  @Post('/create')
  @UseGuards(AuthGuard)
  createExpense(@Body() body: CreateExpenseDto) {
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    this.expensesService.create(body.amount, body.description, date, body.userId);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findExpense(@Param('id') id: number, @CurrentUser() userId: number) {
    const expense = this.expensesService.findOne(id, userId);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return expense;
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllExpenses(@CurrentUser() userId: number, @Query('amount') amount: number) {
    const expenses = await this.expensesService.find(userId, amount);
    if (!expenses) {
      throw new Error('Expenses not found');
    }
    return expenses;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateExpense(@Param('id') id: number, @CurrentUser() userId: number, @Body() body: UpdateExpenseDto) {
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    body.date = date;
    return this.expensesService.update(id, userId, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  removeExpense(@Param('id') id: number, @CurrentUser() userId: number,) {
    return this.expensesService.remove(id, userId);
  }

}
