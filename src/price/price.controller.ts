import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { PriceService } from './price.service'; // Adjust the import path based on your structure
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Prices') // Adds a tag for the price endpoints in the Swagger UI
@Controller('prices') // Define the route prefix
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  // Endpoint to update daily prices
  @Post('update-daily') // Define the specific route for updating daily prices
  @ApiOperation({ summary: 'Update daily prices for assets' }) // Description of what the endpoint does
  @ApiResponse({
    status: 200,
    description: 'Daily prices updated successfully',
    schema: {
      example: {
        message: 'Daily prices updated successfully', // Example response body
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' }) // Example of other possible response statuses
  @ApiResponse({ status: 500, description: 'Internal Server Error' }) // Handle potential server error
  @HttpCode(HttpStatus.OK) // Optional: Specify HTTP status code for success
  async updateDailyPrices() {
    return this.priceService.updateDailyPrices(); // Call the service method
  }
}