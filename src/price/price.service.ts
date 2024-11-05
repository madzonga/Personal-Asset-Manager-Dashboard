import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import db from '../kysely-config';
import { Insertable } from 'kysely';
import { AssetDailyPriceTable } from './price.model';

@Injectable()
export class PriceService {
  // Method to generate and store daily price data
  async updateDailyPrices() {
    const assets = await this.getAllAssets(); // Get all assets from the database
    const today = new Date().toISOString().slice(0, 10); 

    // Generate mock prices for each asset
    const mockPrices: Insertable<AssetDailyPriceTable>[] = assets.map(asset => ({
        asset_id: asset.id,
        date: today, // Date object instead of string
        price: this.generateMockPrice(), // Generate random mock price
        created_at: new Date().toISOString().slice(0, 10), // Ensure created_at is also a Date object
      }));

    // Save mock prices in the database
    await this.storeMockPrices(mockPrices);
    return { message: 'Daily prices updated successfully' };
  }

  // Helper to generate a random mock price for an asset
  private generateMockPrice(): number {
    return Math.floor(Math.random() * 1000) + 1; // Example random price between 1 and 1000
  }

  // Retrieve all assets from the database
  private async getAllAssets() {
    return await db
      .selectFrom('assets')
      .selectAll()
      .execute();
  }

  // Store generated prices in the database
  private async storeMockPrices(prices: Insertable<AssetDailyPriceTable>[]) {
    await db
      .insertInto('asset_daily_prices')
      .values(prices)
      .execute();
  }

  // Cron job to update prices daily at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyPriceUpdateCron() {
    await this.updateDailyPrices();
  }
}