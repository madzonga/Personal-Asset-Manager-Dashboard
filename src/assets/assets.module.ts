import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PriceService } from './price/price.service';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, PriceService]
})
export class AssetsModule {}
