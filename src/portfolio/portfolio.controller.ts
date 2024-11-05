import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtCustomGuard } from '../auth/jwt-custom.guard';

@Controller('portfolio')
@UseGuards(JwtCustomGuard) // Apply guard at the controller level to protect all routes
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // 1. Get Current Portfolio Value and PnL
  @Get(':userId')  // Adjust route to expect userId as a parameter
  async getCurrentPortfolioValueAndPnL(@Param('userId') userId: number) {
    return this.portfolioService.getCurrentPortfolioValueAndPnL(userId);
  }

  // 2. Get Asset Value Over Time and PnL Over Time
  @Get('assets/:assetId/history')
  async getAssetValueHistory(@Param('assetId') assetId: string) {
    // Calls PortfolioService to retrieve historical values and PnL data for the specified asset
    return this.portfolioService.getAssetValueHistory(parseInt(assetId));
  }
}