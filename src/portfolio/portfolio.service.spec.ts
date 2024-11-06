import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import db from '../kysely-config'; // Adjust the import path to match your project structure

// Mocking the database interactions
jest.mock('../kysely-config', () => ({
    selectFrom: jest.fn(),
}));

describe('PortfolioService', () => {
    let portfolioService: PortfolioService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PortfolioService],
        }).compile();

        portfolioService = module.get<PortfolioService>(PortfolioService);
    });

    describe('getCurrentPortfolioValueAndPnL', () => {
        it('should calculate portfolio value and PnL correctly', async () => {
            const userId = 1;

            // Mocking the assets data
            const assets = [
                { id: 1, type: 'ERC-20', quantity: 10, cost_basis: 5 },
                { id: 2, type: 'ERC-721', quantity: 1, cost_basis: 100 },
            ];

            // Mocking the asset prices data
            const assetPrices = [
                { asset_id: 1, price: 10 },
                { asset_id: 2, price: 200 },
            ];

            // Mock the database calls
            (db.selectFrom as jest.Mock).mockImplementationOnce(() => ({
                selectAll: () => ({
                    where: () => ({
                        execute: () => Promise.resolve(assets),
                    }),
                }),
            }));

            (db.selectFrom as jest.Mock).mockImplementationOnce(() => ({
                select: () => ({
                    where: () => ({
                        execute: () => Promise.resolve(assetPrices),
                    }),
                }),
            }));

            const result = await portfolioService.getCurrentPortfolioValueAndPnL(userId);

            // Portfolio Value:
            // (10 * 10 for ERC-20) + (1 * 200 for ERC-721) = 100 + 200 = 300
            // PnL: (300 portfolio value - (10 * 5 for ERC-20 + 100 for ERC-721)) = 300 - 150 = 150
            expect(result).toEqual({ portfolioValue: 300, pnl: 150 });
        });

        it('should handle case when no asset prices are found', async () => {
            const userId = 1;

            // Mocking the assets data
            const assets = [
                { id: 1, type: 'ERC-20', quantity: 10, cost_basis: 5 },
                { id: 2, type: 'ERC-721', quantity: 1, cost_basis: 100 },
            ];

            // Mocking the asset prices data (empty in this case)
            const assetPrices: any[] = [];

            // Mock the database calls
            (db.selectFrom as jest.Mock).mockImplementationOnce(() => ({
                selectAll: () => ({
                    where: () => ({
                        execute: () => Promise.resolve(assets),
                    }),
                }),
            }));

            (db.selectFrom as jest.Mock).mockImplementationOnce(() => ({
                select: () => ({
                    where: () => ({
                        execute: () => Promise.resolve(assetPrices),
                    }),
                }),
            }));

            const result = await portfolioService.getCurrentPortfolioValueAndPnL(userId);

            // Portfolio Value = 0 (no asset prices found)
            // PnL: (0 portfolio value - (10 * 5 for ERC-20 + 100 for ERC-721)) = 0 - 150 = -150
            expect(result).toEqual({ portfolioValue: 0, pnl: -150 });
        });

        it('should handle empty assets list', async () => {
            const userId = 1;

            // Mocking the assets data (empty)
            const assets: any[] = [];

            // Mocking the asset prices data
            const assetPrices = [
                { asset_id: 1, price: 10 },
                { asset_id: 2, price: 200 },
            ];

            // Mock the database calls
            (db.selectFrom as jest.Mock).mockImplementationOnce(() => ({
                selectAll: () => ({
                    where: () => ({
                        execute: () => Promise.resolve(assets),
                    }),
                }),
            }));

            (db.selectFrom as jest.Mock).mockImplementationOnce(() => ({
                select: () => ({
                    where: () => ({
                        execute: () => Promise.resolve(assetPrices),
                    }),
                }),
            }));

            const result = await portfolioService.getCurrentPortfolioValueAndPnL(userId);

            expect(result).toEqual({ portfolioValue: 0, pnl: 0 });
        });
    });

    describe('getAssetValueHistory', () => {
        it('should return asset value history and PnL correctly', async () => {
            const assetId = 1;

            // Mocking historical price data
            const priceHistory = [
                { date: '2024-11-01', price: 10 },
                { date: '2024-11-02', price: 15 },
                { date: '2024-11-03', price: 20 },
            ];

            // Mock the database call for asset price history
            (db.selectFrom as jest.Mock).mockImplementationOnce(() => ({
                select: () => ({
                    where: () => ({
                        execute: () => Promise.resolve(priceHistory),
                    }),
                }),
            }));

            const result = await portfolioService.getAssetValueHistory(assetId);

            expect(result).toEqual([
                { date: '2024-11-01', value: 10, pnl: 0 },
                { date: '2024-11-02', value: 15, pnl: 5 },
                { date: '2024-11-03', value: 20, pnl: 5 },
            ]);
        });

        it('should return empty history if no price records found', async () => {
            const assetId = 1;

            // Mocking no price history data
            const priceHistory: any[] = [];

            // Mock the database call for asset price history
            (db.selectFrom as jest.Mock).mockImplementationOnce(() => ({
                select: () => ({
                    where: () => ({
                        execute: () => Promise.resolve(priceHistory),
                    }),
                }),
            }));

            const result = await portfolioService.getAssetValueHistory(assetId);

            expect(result).toEqual([]);
        });
    });
});