import { Injectable } from '@nestjs/common';
import db from '../kysely-config'; // Ensure correct path to kysely-config
import { NewAsset } from './assets.model';

@Injectable()
export class AssetsService {
  // Add an asset to the user's asset list
  async addAsset(assetData: Omit<NewAsset, 'id' | 'created_at'>) {
    const newAsset = await createAsset({
      ...assetData,
      created_at: new Date().toDateString(), // Current date
    });

    return { message: 'Asset added successfully', asset: newAsset };
  }

  // Remove an asset by assetId from the user's asset list
  async removeAsset(assetId: number) {
    await db.deleteFrom('assets').where('id', '=', assetId).execute();
    return { message: 'Asset removed successfully' };
  }

  // Retrieve all assets linked to the user's profile
  async listAssets(userId: number) {
    const assets = await db
      .selectFrom('assets')
      .selectAll()
      .where('user_id', '=', userId)
      .execute();

    return assets;
  }
}

async function createAsset(assetData: Omit<NewAsset, 'id'>) {
    // Ensure optional fields have values (use null if they're undefined)
    const insertData = {
      ...assetData,
      cost_basis: assetData.cost_basis ?? null, // Set to null if undefined
      quantity: assetData.quantity ?? null, // Also handle quantity if it's optional
      token_id: assetData.token_id ?? null, // Also handle token_id if it's optional
      created_at: assetData.created_at ?? new Date().toISOString(), // Use current date if not provided
    };
  
    const [newAsset] = await db
      .insertInto('assets')
      .values(insertData)
      .returning(['id', 'user_id', 'name', 'type', 'smart_contract_address', 'chain', 'quantity', 'token_id', 'created_at', 'cost_basis']) // Return all necessary columns
      .execute();
  
    return newAsset;
  }
