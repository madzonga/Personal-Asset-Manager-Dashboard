import {
    ColumnType,
    Generated,
    Insertable,
    Selectable,
    Updateable,
  } from 'kysely';
  

  // Define the assets table schema
  export interface AssetTable {
    id: Generated<number>;
    user_id: number; // Foreign key reference to users
    name: string;
    type: 'ERC-20' | 'ERC-721';
    smart_contract_address: string;
    chain: string;
    quantity: number | null; // Nullable for ERC-721
    token_id: string | null; // Nullable for ERC-20
    created_at: ColumnType<Date, string | undefined, never>;
    cost_basis: number; // Cost basis for the asset
  }
  
  // Use the wrappers for selectable, insertable, and updateable types
  export type Asset = Selectable<AssetTable>;
  export type NewAsset = Insertable<AssetTable>;
  export type AssetUpdate = Updateable<AssetTable>;