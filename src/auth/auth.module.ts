import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'; // For environment variable support
import { UsersService } from '../user/user.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule, // Optional: If you want to use ConfigModule for environment variables
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // Provide a secret key
      signOptions: { expiresIn: '3060s' }, // Optional: Set token expiration
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AuthMiddleware],
  exports: [AuthService], // Export AuthService if needed in other modules
})
export class AuthModule {}