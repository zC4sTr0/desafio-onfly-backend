import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expenses.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from 'src/users/users.module';



@Module({
  imports: [TypeOrmModule.forFeature([Expense]),
  UsersModule,
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
    defaults: { 
      from: '"',
    },
  }),],
  providers: [ExpensesService ],
  controllers: [ExpensesController]
})
export class ExpensesModule {}
