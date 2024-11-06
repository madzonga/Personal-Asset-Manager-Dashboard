import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
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
export class AssetsModule {
}