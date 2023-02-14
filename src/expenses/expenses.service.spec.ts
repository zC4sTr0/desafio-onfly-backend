import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expenses.entity';
import { ExpensesService } from './expenses.service';
import { UsersService } from 'src/users/users.service';

const mockExpenseRepository = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  merge: jest.fn(),
});

const mockUsersService = () => ({
  findOne: jest.fn(),
});

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expenseRepository: Repository<Expense>;
  let usersService: UsersService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useFactory: mockExpenseRepository,
        },
        {
          provide: UsersService,
          useFactory: mockUsersService,
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    expenseRepository = module.get(getRepositoryToken(Expense));
    usersService = module.get<UsersService>(UsersService);
    mailerService = module.get<MailerService>(MailerService);
  });

  describe('create', () => {
    const amount = 100;
    const description = 'Test expense';
    const date = new Date();
    const userId = 1;
    const mockExpense = new Expense();
    const mockUser = { id: userId } as any;

    beforeEach(() => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(expenseRepository, 'create').mockReturnValue(mockExpense);
      jest.spyOn(expenseRepository, 'save').mockResolvedValue(mockExpense);
    });

    it('should create an expense', async () => {
      const result = await service.create(amount, description, date, userId);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(expenseRepository.create).toHaveBeenCalledWith({
        amount,
        description,
        date,
        userId,
      });
      expect(expenseRepository.save).toHaveBeenCalledWith(mockExpense);
      expect(result).toEqual(mockExpense);
    });

    it('should throw BadRequestException if user is not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(service.create(amount, description, date, userId)).rejects.toThrow(
        BadRequestException,
      );
      expect(expenseRepository.create).not.toHaveBeenCalled();
      expect(expenseRepository.save).not.toHaveBeenCalled();
    });
  });

});

 
