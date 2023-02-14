import { Body, Controller, Post, Get, Patch, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';


@Controller('auth')
export class UsersController {
    
  constructor(private readonly usersService: UsersService) {
  }


  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

}
