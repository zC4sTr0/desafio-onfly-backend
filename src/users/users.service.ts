import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {
  }
  create(name: string, email: string, password: string) {
    const user = this.repository.create({name, email, password });
    return  this.repository.save(user);
  }

  async findOne(userId: number): Promise<User> {
    const user = await this.repository.findOne({ where: { id: userId } });
    return user;
  }  

  async find(userEmail: string){
    const user = await this.repository.find({where: {email: userEmail}});
    return user;
  }

  async update(userId: number, attrs: Partial<User>) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repository.remove(user);
  }
  
}
