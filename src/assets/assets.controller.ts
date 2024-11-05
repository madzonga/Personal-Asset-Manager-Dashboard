import { Controller, Post, Delete, Get, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) {}

    // 1. Add Asset
    @Post()
    async addAsset(@Body() assetData: any) {
        return this.assetsService.addAsset(assetData);
    }

    // 2. Remove Asset
    @Delete(':assetId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeAsset(@Param('assetId') assetId: number) {
        return this.assetsService.removeAsset(assetId);
    }

    // 3. List Assets
    @Get()
    async listAssets(@Query('userId') userId: number) {
        return this.assetsService.listAssets(userId);
    }
}