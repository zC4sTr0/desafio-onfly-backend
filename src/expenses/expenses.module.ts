import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expenses.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [TypeOrmModule.forFeature([Expense]),
  MailerModule.forRoot({
    transport: {
      host: 'smtp.mailgun.org', 
      secure: false,
      port: 587, 
      auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASS,
      },
      ignoreTLS: true,
    },
    defaults: { // configurações que podem ser padrões
      from: '"',
    },
  }),],
  providers: [ExpensesService],
  controllers: [ExpensesController]
})
export class ExpensesModule {}
