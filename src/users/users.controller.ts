import { Body, Controller, Post, Get, Patch, Param, Query, ClassSerializerInterceptor, UseInterceptors, Session, BadRequestException, UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dtos/user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from './users.entity'
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('auth')
@UseInterceptors(SerializeInterceptor)
export class UsersController {
    
  constructor(private readonly usersService: UsersService, 
              private readonly authService: AuthService) {}   

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.name, body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
   whoami(@CurrentUser() user: User) {
    console.log(user);
    return user;
  }
  
  @Post('/signin')
  async signin(@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

}
