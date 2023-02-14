import { Entity , PrimaryGeneratedColumn, Column, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  amount: number;
  

  @Column()
  userId: number;

  @AfterInsert()
  logInsert() {
    console.log('Inserted Expense with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated Expense with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed Expense with id', this.id);
  }

}