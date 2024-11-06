import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    // Use jest.Mocked to define fully mocked services with all methods
    usersService = {
      findUserBySub: jest.fn(),
      addUser: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    jwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('authenticateUser', () => {
    it('should throw UnauthorizedException if Privy token is invalid', async () => {
      const invalidToken = 'invalidToken';
      (jwt.decode as jest.Mock).mockReturnValue(null); // Mock decoding failure

      await expect(authService.authenticateUser(invalidToken, 'test@example.com')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create a new user if not found and return a JWT', async () => {
      const privyToken = 'validPrivyToken';
      const email = 'newuser@example.com';
      const decodedToken = { sub: '12345' };

      (jwt.decode as jest.Mock).mockReturnValue(decodedToken);
      usersService.findUserBySub.mockResolvedValue(null); // Simulate user not found
      usersService.addUser.mockResolvedValue({
        id: 1, // Add a mock ID value
        created_at: new Date().toISOString(), // Add a mock creation date
        sub: '12345',
        email,
      });
      jwtService.sign.mockReturnValue('mockJwtToken');

      const result = await authService.authenticateUser(privyToken, email);

      expect(usersService.addUser).toHaveBeenCalledWith({ email, sub: '12345' });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: '12345', email }, { secret: process.env.JWT_SECRET });
      expect(result).toBe('mockJwtToken');
    });

    it('should return a JWT if user exists', async () => {
      const privyToken = 'validPrivyToken';
      const email = 'existinguser@example.com';
      const decodedToken = { sub: '12345' };

      (jwt.decode as jest.Mock).mockReturnValue(decodedToken);
      usersService.findUserBySub.mockResolvedValue({
        id: 1, // Add a mock ID value
        created_at: new Date().toISOString(), // Add a mock creation date
        sub: '12345',
        email,
      });
      jwtService.sign.mockReturnValue('mockJwtToken');

      const result = await authService.authenticateUser(privyToken, email);

      expect(usersService.findUserBySub).toHaveBeenCalledWith('12345');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: '12345', email }, { secret: process.env.JWT_SECRET });
      expect(result).toBe('mockJwtToken');
    });
  });

  describe('generateToken', () => {
    it('should return a JWT with the correct payload', () => {
      const payload = { sub: '12345', email: 'test@example.com' };
      jwtService.sign.mockReturnValue('mockJwtToken');

      const result = authService.generateToken(payload);

      expect(jwtService.sign).toHaveBeenCalledWith(payload, { secret: process.env.JWT_SECRET });
      expect(result).toBe('mockJwtToken');
    });
  });
});