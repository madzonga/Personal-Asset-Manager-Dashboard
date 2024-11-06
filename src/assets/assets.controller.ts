import { Controller, Post, Delete, Get, Param, Body, HttpCode, HttpStatus, Query, UsePipes } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { AddAssetSchema } from './schemas/add-asset.schema';
import { RemoveAssetSchema } from './schemas/remove-asset.schema';
import { ListAssetsSchema } from './schemas/list-assets.schema';
import { AssetTable } from './assets.model';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  // 1. Add Asset
  @Post()
  @UsePipes(new JoiValidationPipe(AddAssetSchema))
  async addAsset(@Body() assetData: AssetTable) {
    return this.assetsService.addAsset(assetData);
  }

  // 2. Remove Asset
  @Delete(':assetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new JoiValidationPipe(RemoveAssetSchema))
  async removeAsset(@Param() params: { assetId: number }) {
    const { assetId } = params;
    return this.assetsService.removeAsset(assetId);
  }

  // 3. List Assets
  @Get()
  @UsePipes(new JoiValidationPipe(ListAssetsSchema))
  async listAssets(@Query() query: { userId: number }) {
    const { userId } = query;
    return this.assetsService.listAssets(userId);
  }
}