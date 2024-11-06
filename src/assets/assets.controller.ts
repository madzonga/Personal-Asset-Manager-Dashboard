import { Controller, Post, Delete, Get, Param, Body, HttpCode, HttpStatus, Query, UsePipes } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { AddAssetSchema } from './schemas/add-asset.schema';
import { RemoveAssetSchema } from './schemas/remove-asset.schema';
import { ListAssetsSchema } from './schemas/list-assets.schema';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AssetDto } from './dto/asset.dto';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(AddAssetSchema))
  @ApiOperation({ summary: 'Add a new asset for a user' })
  @ApiResponse({ status: 201, description: 'Asset added successfully', type: AssetDto })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async addAsset(@Body() assetData: AssetDto) {
    return this.assetsService.addAsset(assetData);
  }

  @Delete(':assetId')
  @HttpCode(HttpStatus.OK)  // Change to HttpStatus.OK to send a response body
  @UsePipes(new JoiValidationPipe(RemoveAssetSchema))
  @ApiOperation({ summary: 'Remove an asset by ID' })
  @ApiParam({ name: 'assetId', type: 'number', description: 'ID of the asset to be removed' })
  @ApiResponse({ status: 200, description: 'Asset removed successfully', schema: { example: { message: 'Delete successful' } } })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async removeAsset(@Param() params: { assetId: number }) {
    const { assetId } = params;
    await this.assetsService.removeAsset(assetId);
    return { message: 'Delete successful' };
  }

  @Get()
  @UsePipes(new JoiValidationPipe(ListAssetsSchema))
  @ApiOperation({ summary: 'List all assets for a user' })
  @ApiQuery({ name: 'userId', type: 'number', description: 'User ID to filter assets by' })
  @ApiResponse({ status: 200, description: 'Assets retrieved successfully', isArray: true, type: AssetDto })
  async listAssets(@Query() query: { userId: number }) {
    const { userId } = query;
    return this.assetsService.listAssets(userId);
  }
}