import { Test, TestingModule } from '@nestjs/testing';
import { AssetsService } from './assets.service';
import db from '../kysely-config'; // Mock this in the tests
import { NewAsset } from './assets.model';

// Mock the db instance and its methods
jest.mock('../kysely-config', () => ({
  insertInto: jest.fn(),
  deleteFrom: jest.fn(),
  selectFrom: jest.fn(),
}));

describe('AssetsService', () => {
  let assetsService: AssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsService],
    }).compile();

    assetsService = module.get<AssetsService>(AssetsService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('addAsset', () => {
    it('should add a new asset and return a success message', async () => {
      const mockAssetData: Omit<NewAsset, 'id' | 'created_at'> = {
        user_id: 1,
        name: 'Sample Asset',
        type: 'ERC-20',
        smart_contract_address: '0x12345',
        chain: 'Ethereum',
        cost_basis: 100,
      };

      const mockInsertedAsset = {
        ...mockAssetData,
        id: 1,
        created_at: new Date().toISOString(),
      };

      // Mock the insert method and returning method
      (db.insertInto as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnValue({
          execute: jest.fn().mockResolvedValue([mockInsertedAsset]),
        }),
      });

      const result = await assetsService.addAsset(mockAssetData);

      expect(result).toEqual({
        message: 'Asset added successfully',
        asset: mockInsertedAsset,
      });
      expect(db.insertInto).toHaveBeenCalledWith('assets');
    });
  });

  describe('removeAsset', () => {
    it('should remove an asset and return a success message', async () => {
      const assetId = 1;

      // Mock the delete method
      (db.deleteFrom as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          execute: jest.fn().mockResolvedValueOnce({}),
        }),
      });

      const result = await assetsService.removeAsset(assetId);

      expect(result).toEqual({ message: 'Asset removed successfully' });
      expect(db.deleteFrom).toHaveBeenCalledWith('assets');
    });
  });

  describe('listAssets', () => {
    it('should return a list of assets for a user', async () => {
      const userId = 1;
      const mockAssets = [
        {
          id: 1,
          user_id: userId,
          name: 'Sample Asset 1',
          type: 'ERC-20',
          smart_contract_address: '0x12345',
          chain: 'Ethereum',
          quantity: 10,
          cost_basis: 100,
          created_at: new Date().toISOString(),
        },
      ];

      // Mock the selectFrom method and return assets
      (db.selectFrom as jest.Mock).mockReturnValue({
        selectAll: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnValue({
          execute: jest.fn().mockResolvedValue(mockAssets),
        }),
      });

      const result = await assetsService.listAssets(userId);

      expect(result).toEqual(mockAssets);
      expect(db.selectFrom).toHaveBeenCalledWith('assets');
    });
  });
});