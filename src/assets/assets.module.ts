import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { AuthMiddleware } from '../auth/auth.middleware'; // Adjust the import path as necessary
import { PriceService } from '../price/price.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule, // Import AuthModule to gain access to JwtService
  ],
  controllers: [AssetsController],
    providers: [AssetsService, PriceService, JwtService],
})
export class AssetsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware) // Apply the AuthMiddleware
            .forRoutes(AssetsController); // Protect all routes in the AssetsController
    }
}