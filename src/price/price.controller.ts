import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { PriceService } from './price.service'; // Adjust the import path based on your structure

@Controller('prices') // Define the route prefix
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  // Endpoint to update daily prices
  @Post('update-daily') // Define the specific route for updating daily prices
  @HttpCode(HttpStatus.OK) // Optional: Specify HTTP status code for success
  async updateDailyPrices() {
    return this.priceService.updateDailyPrices(); // Call the service method
  }
}