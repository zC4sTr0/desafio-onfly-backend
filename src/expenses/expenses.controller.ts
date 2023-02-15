import { Controller, Post, Body, Delete, Get, Patch, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpensesService } from './expenses.service';
import { UpdateExpenseDto } from './dtos/update-expense.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/users.entity';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}
  
  
  @Post('/create')
  @UseGuards(AuthGuard)
  async createExpense(@Body() body: CreateExpenseDto) {
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    if (date.getTime() > Date.now()) {
      throw new BadRequestException('Invalid date');
    }

    if (body.description.length > 191) {
      throw new BadRequestException('Description is too long');
    }
    
    const result = this.expensesService.create(body.amount, body.description, date, body.userId);
    return result;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findExpense(@Param('id') id: number, @CurrentUser() user: User) {
    const expense = this.expensesService.findOne(id, user.id);
    if (!expense) {
      throw new BadRequestException('Expense not found');
    }
    return expense;
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllExpenses(@CurrentUser() user: User, @Query('amount') amount: number) {
    const expenses = await this.expensesService.find(user.id, amount);
    if (!expenses) {
      throw new BadRequestException('Expenses not found');
    }
    return expenses;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateExpense(@Param('id') id: number, @CurrentUser() user: User, @Body() body: UpdateExpenseDto) {
    const date = new Date(body.date);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    if (date.getTime() > Date.now()) {
      throw new BadRequestException('Invalid date');
    }

    body.date = date;
    return this.expensesService.update(id, user.id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  removeExpense(@Param('id') id: number, @CurrentUser() user: User) {
    return this.expensesService.remove(id, user.id);
  }

}
