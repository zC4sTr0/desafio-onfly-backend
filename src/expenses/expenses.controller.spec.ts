import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { BadRequestException } from '@nestjs/common';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createExpense', () => {
    it('should create an expense', async () => {
      const expenseDto: CreateExpenseDto = {
        amount: 10,
        description: 'Test expense',
        date: new Date().toString(),
        userId: 1,
      };
      const result = { id: 1, ...expenseDto };
      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect(await controller.createExpense(expenseDto)).toBe(result);
    });

    it('should throw an error for an invalid date', async () => {
      const expenseDto: CreateExpenseDto = {
        amount: 10,
        description: 'Test expense',
        date: 'invalid date', // Invalid date string
        userId: 1,
      };
      await expect(controller.createExpense(expenseDto)).rejects.toThrow();
    });

    it('should throw an error for a date in the future', async () => {
      const expenseDto: CreateExpenseDto = {
        amount: 10,
        description: 'Test expense',
        date: new Date(Date.now() + 86400000).toString(), // Date is 1 day in the future
        userId: 1,
      };
      await expect(controller.createExpense(expenseDto)).rejects.toThrow();
    });
  });

  describe('createExpense 2', () => {
    it('should create a new expense for a valid request', async () => {
      const dto: CreateExpenseDto = {
        userId: 1,
        amount: 10,
        description: 'Test expense',
        date: '2023-02-14T18:45:00.000Z',
      };
      const expectedResult = { id: 1 };
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.createExpense(dto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(
        dto.amount,
        dto.description,
        new Date(dto.date),
        dto.userId,
      );
    });

    it('should throw a BadRequestException for an invalid date', async () => {
      const dto: CreateExpenseDto = {
        userId: 1,
        amount: 10,
        description: 'Test expense',
        date: 'invalid date',
      };

      await expect(controller.createExpense(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should throw a BadRequestException for a future date', async () => {
      const dto: CreateExpenseDto = {
        userId: 1,
        amount: 10,
        description: 'Test expense',
        date: '2024-02-14T18:45:00.000Z',
      };

      await expect(controller.createExpense(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should throw a BadRequestException for a too long description', async () => {
      const dto: CreateExpenseDto = {
        userId: 1,
        amount: 10,
        description:
          'Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense Test expense',
        date: '2023-02-14T18:45:00.000Z',
      };

      await expect(controller.createExpense(dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).not.toHaveBeenCalled();
      });
    });
});