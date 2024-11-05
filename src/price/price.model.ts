import { Generated, ColumnType } from "kysely";

  // Define the asset_daily_prices table schema
  export interface AssetDailyPriceTable {
    id: Generated<number>; // Auto-incremented in the DB
    asset_id: number;       // Foreign key reference to assets
    date: ColumnType<Date, string | undefined, never>; // Input as Date, stored as Date, no transformation on output
    price: number;
    created_at: ColumnType<Date, string | undefined, never>; // Auto-managed
  }
  