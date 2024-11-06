import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtCustomGuard } from '../auth/jwt-custom.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { UserIdSchema, AssetIdSchema } from './schemas/portfolio.schema';

@Controller('portfolio')
@UseGuards(JwtCustomGuard) // Apply guard at the controller level to protect all routes
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // 1. Get Current Portfolio Value and PnL
  @Get(':userId')
  @UsePipes(new JoiValidationPipe(UserIdSchema))
  async getCurrentPortfolioValueAndPnL(@Param() params: { userId: number }) {
    const { userId } = params; // Destructure to extract userId after validation
    return this.portfolioService.getCurrentPortfolioValueAndPnL(userId);
  }

  // 2. Get Asset Value Over Time and PnL Over Time
  @Get('assets/:assetId/history')
  @UsePipes(new JoiValidationPipe(AssetIdSchema))
  async getAssetValueHistory(@Param() params: { assetId: string }) {
    const { assetId } = params; // Destructure to extract assetId after validation
    return this.portfolioService.getAssetValueHistory(parseInt(assetId, 10));
  }
}