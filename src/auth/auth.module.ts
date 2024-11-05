import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // Provide a secret key
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME || '1h' }, // Optional: Set token expiration
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AuthMiddleware],
  exports: [AuthService], // Export AuthService if needed in other modules
})
export class AuthModule {}