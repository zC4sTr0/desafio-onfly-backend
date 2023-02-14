import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expenses.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';



@Injectable()
export class ExpensesService {
  constructor( @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>,
                private readonly usersService: UsersService,
                private mailerService: MailerService) {}

  async sendEmail(email: string, mensagem: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'onfly_challenge@challenge.com',
      subject: 'despesa cadastrada',
      html: `<h3 style="color: red">${mensagem}</h3>`,
    });
  }

  async create(amount: number, description: string, date: Date, userId: number) {
    const userExists = await this.usersService.findOne(userId); 
    if (!userExists) {
      return new BadRequestException(`User #${userId} not found`).getResponse();
    }

    const expense = this.expenseRepository.create({ amount, description, date, userId });
    return this.expenseRepository.save(expense);
  }

  async findOne(expenseId: number, userId: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne( { where: { id: expenseId, userId: userId } });
    return expense;
  }

  async find(userId: number, expenseAmount?: number): Promise<Expense[]> {
    if (expenseAmount) {
      return this.expenseRepository.find({ where: { amount: expenseAmount, userId: userId } });
    }
    return this.expenseRepository.find({ where: { userId: userId }});
  }

  async update(id: number, userId: number, updates: Partial<Expense>): Promise<Expense> {
    const expense = await this.findOne(id, userId);
    if (!expense) {
      throw new NotFoundException(`Expense #${id} not found for this user`);
    }
    this.expenseRepository.merge(expense, updates);
    return await this.expenseRepository.save(expense);
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.findOne(id, userId);
    if (!expense) {
      throw new NotFoundException(`Expense #${id} not found for this user`);
    }
    await this.expenseRepository.remove(expense);
  }

}
