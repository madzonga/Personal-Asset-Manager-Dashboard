// kysely-config.ts
import { ColumnType, Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Define the database schema type
export interface DatabaseSchema {
  users: {
    id: Generated<number>;    // Auto-incremented primary key
    email: string;
    sub: string;
    created_at: ColumnType<Date, string | undefined, never>; // Auto-managed creation date
  };
  assets: {
    id: Generated<number>;    // Auto-incremented
    user_id: number;
    name: string;
    type: 'ERC-20' | 'ERC-721';
    smart_contract_address: string;
    chain: string;
    quantity: number | null;  // Nullable for ERC-721
    token_id: string | null;  // Nullable for ERC-20
    created_at: ColumnType<Date, string | undefined, never>; // Auto-managed in DB
    cost_basis: number;
  };
  asset_daily_prices: {
    id: Generated<number>;    // Auto-incremented
    asset_id: number;
    date: ColumnType<Date, string | undefined, never>;
    price: number;
    created_at: ColumnType<Date, string | undefined, never>; // Auto-managed in DB
  };
}

const db = new Kysely<DatabaseSchema>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, 
    }),
  }),
});

export default db;