import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Expense } from './expenses/expenses.entity';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Expense],
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
