import { Controller, Get, Param, UseGuards, UsePipes } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtCustomGuard } from '../auth/jwt-custom.guard';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { UserIdSchema, AssetIdSchema } from './schemas/portfolio.schema';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Portfolio') // Adds a tag for the portfolio endpoints in the Swagger UI
@Controller('portfolio')
@UseGuards(JwtCustomGuard) // Apply guard at the controller level to protect all routes
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // 1. Get Current Portfolio Value and PnL
  @Get(':userId')
  @ApiOperation({ summary: 'Get current portfolio value and profit & loss (PnL) for a user' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID to fetch the portfolio value' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the current portfolio value and PnL',
    schema: {
      example: {
        portfolioValue: 10000, // Example portfolio value
        pnl: 500, // Example profit and loss
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UsePipes(new JoiValidationPipe(UserIdSchema)) // Use Joi schema validation for the userId parameter
  async getCurrentPortfolioValueAndPnL(@Param() params: { userId: number }) {
    const { userId } = params; // Destructure to extract userId after validation
    return this.portfolioService.getCurrentPortfolioValueAndPnL(userId);
  }

  // 2. Get Asset Value Over Time and PnL Over Time
  @Get('assets/:assetId/history')
  @ApiOperation({ summary: 'Get the value history of an asset and its profit & loss over time' })
  @ApiParam({ name: 'assetId', type: 'string', description: 'Asset ID to fetch the historical value and PnL' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved asset value history and PnL over time',
    schema: {
      example: {
        assetId: 'ERC-20_123', // Example asset ID
        history: [
          { date: '2024-01-01', value: 2000, pnl: 50 },
          { date: '2024-02-01', value: 2500, pnl: 100 },
        ], // Example asset value history and PnL over time
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  @UsePipes(new JoiValidationPipe(AssetIdSchema)) // Use Joi schema validation for the assetId parameter
  async getAssetValueHistory(@Param() params: { assetId: string }) {
    const { assetId } = params; // Destructure to extract assetId after validation
    return this.portfolioService.getAssetValueHistory(parseInt(assetId, 10));
  }
}