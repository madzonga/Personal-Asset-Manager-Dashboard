import { Injectable } from '@nestjs/common';
import db from '../kysely-config'; // Adjust the import according to your project structure
import { Asset } from '../assets/assets.model';

@Injectable()
export class PortfolioService {
    // Function to get the current portfolio value and PnL
    async getCurrentPortfolioValueAndPnL(userId: number) {
        const assets: Asset[] = await db
            .selectFrom('assets')
            .selectAll()
            .where('user_id', '=', userId)
            .execute();
    
        const today = new Date();
        const assetPrices = await db
            .selectFrom('asset_daily_prices')
            .select(['asset_id', 'price'])
            .where('date', '=', today)
            .execute();
    
        let portfolioValue = 0;
        let totalCostBasis = 0;
    
        for (const asset of assets) {
            const currentPriceRecord = assetPrices.find(price => price.asset_id === asset.id);
            const currentPrice = currentPriceRecord ? currentPriceRecord.price : 0;
    
            // Ensure ERC-20 assets calculate value based on quantity and cost basis
            if (asset.type === 'ERC-20') {
                portfolioValue += currentPrice * (asset.quantity ?? 0);
                totalCostBasis += (asset.quantity ?? 0) * (asset.cost_basis || 0);
            } else {
                // For ERC-721 assets, quantity is 1
                portfolioValue += currentPrice;
                totalCostBasis += asset.cost_basis || 0;
            }
        }
    
        const pnl = portfolioValue - totalCostBasis;
    
        return { portfolioValue, pnl };
    }

    // Function to get asset historical value and PnL
    async getAssetValueHistory(assetId: number) {
        // Get historical values for the specified asset
        const history = await db
            .selectFrom('asset_daily_prices')
            .select(['date', 'price'])
            .where('asset_id', '=', assetId)
            .execute();

        // Calculate PnL based on the first and last price
        const pnlHistory = history.map((record, index) => {
            const pnl = index > 0 ? record.price - history[index - 1].price : 0; // PnL compared to the previous day's price
            return { date: record.date, value: record.price, pnl };
        });

        return pnlHistory;
    }
}