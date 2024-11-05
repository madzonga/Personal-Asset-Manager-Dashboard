import { Injectable } from '@nestjs/common';
import db from '../kysely-config'; // Adjust the import according to your project structure
import { Asset } from '../assets/assets.model';

@Injectable()
export class PortfolioService {
    // Function to get the current portfolio value and PnL
    async getCurrentPortfolioValueAndPnL(userId: number) {
        // Get the user's assets
        const assets: Asset[] = await db
            .selectFrom('assets')
            .selectAll()
            .where('user_id', '=', userId)
            .execute();

        // Get the current prices for the assets
        const today = new Date(); // Get today's date
        const assetPrices = await db
            .selectFrom('asset_daily_prices')
            .select(['asset_id', 'price'])
            .where('date', '=', today) // Pass the Date object directly
            .execute();

        // Calculate portfolio value and PnL
        let portfolioValue = 0;
        let totalCostBasis = 0; // Assuming you store the cost basis in the assets table, you can adjust accordingly
        for (const asset of assets) {
            const currentPriceRecord = assetPrices.find(price => price.asset_id === asset.id);
            const currentPrice = currentPriceRecord ? currentPriceRecord.price : 0; // Default to 0 if no price is found

            portfolioValue += currentPrice * (asset.type === 'ERC-20' ? (asset.quantity ?? 0) : 1);
            totalCostBasis += asset.type === 'ERC-20' ? (asset.quantity ?? 0) * (asset.cost_basis || 0) : (asset.cost_basis || 0); // Use 0 as fallback for cost_basis
        }

        const pnl = portfolioValue - totalCostBasis; // Profit and Loss calculation

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