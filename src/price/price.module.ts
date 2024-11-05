import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule'; // Needed for cron jobs
import { PriceService } from './price.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PriceService],
  exports: [PriceService], // Export if other modules need price data
})
export class PriceModule {}