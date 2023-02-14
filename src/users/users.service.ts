import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {
  }
  create(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return await this.repository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return await this.repository.findOne({ id });
  }  

  async find(email: string){
    return await this.repository.find({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
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
