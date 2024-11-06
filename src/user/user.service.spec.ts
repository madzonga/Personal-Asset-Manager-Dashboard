import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import db from '../kysely-config'; // Adjust to your project's path

jest.mock('../kysely-config'); // Mock the database configuration

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('addUser', () => {
    it('should create a new user and return it', async () => {
        const userData = {
          email: 'test@example.com',
          sub: 'test-sub',
        };
      
        const createdAt = new Date().toISOString(); // Get the ISO string format of the current date
      
        const mockUser = {
          id: 1,
          email: 'test@example.com',
          sub: 'test-sub',
          created_at: createdAt,  // Use the string format for created_at
        };
      
        // Mocking the `createUser` method to return the mockUser
        db.insertInto = jest.fn().mockReturnValue({
          values: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValue([mockUser]),
        });
      
        const result = await service.addUser(userData);
      
        expect(db.insertInto).toHaveBeenCalledWith('users');
        expect(result).toEqual(mockUser); // Ensure the returned user matches the mock
      });
  });

  describe('removeUser', () => {
    it('should remove a user by userId and return success message', async () => {
      const userId = 1;

      // Mock the `deleteFrom` method to simulate the deletion operation
      db.deleteFrom = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      });

      const result = await service.removeUser(userId);

      expect(db.deleteFrom).toHaveBeenCalledWith('users');
      expect(result).toEqual({ message: 'User removed successfully' });
    });
  });

  describe('findUserBySub', () => {
    it('should return a user if found by sub', async () => {
      const sub = 'test-sub';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        sub: 'test-sub',
        created_at: new Date(), // Mock as a Date object for conversion in the service method
      };

      // Mock the `selectFrom` method to return the mock user
      db.selectFrom = jest.fn().mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirst: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findUserBySub(sub);

      expect(db.selectFrom).toHaveBeenCalledWith('users');
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        sub: 'test-sub',
        created_at: mockUser.created_at.toDateString(),
      });
    });

    it('should return null if no user is found by sub', async () => {
      const sub = 'non-existing-sub';

      // Mock `selectFrom` to return null
      db.selectFrom = jest.fn().mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        executeTakeFirst: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findUserBySub(sub);

      expect(db.selectFrom).toHaveBeenCalledWith('users');
      expect(result).toBeNull();
    });
  });
});