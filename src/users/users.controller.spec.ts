
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from '../auth/auth.service'
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a user and return it', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };
      const createdUser = new User();
      createdUser.id = 1;
      createdUser.name = createUserDto.name;
      createdUser.email = createUserDto.email;
      jest.spyOn(authService, 'signup').mockResolvedValue(createdUser);
      const session = { userId: undefined };
      const result = await usersController.createUser(createUserDto, session);
      expect(result).toEqual(createdUser);
      expect(session.userId).toEqual(createdUser.id);
    });
  });

 
  describe('signin', () => {
    it('should sign in a user and return it', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password',
      };
      const signedInUser = new User();
      signedInUser.id = 1;
      signedInUser.name = 'John Doe';
      signedInUser.email = loginUserDto.email;
      jest.spyOn(authService, 'signin').mockResolvedValue(signedInUser);
      const session = { userId: undefined };
      const result = await usersController.signin(loginUserDto, session);
      expect(result).toEqual(signedInUser);
      expect(session.userId).toEqual(signedInUser.id);
    });   
  });


});