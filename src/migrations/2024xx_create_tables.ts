// migrations/2024xx_create_tables.ts
import { Kysely, Migration, sql } from 'kysely';

export default class CreateTablesMigration implements Migration {
  async up(db: Kysely<any>): Promise<void> {
    await db.schema
      .createTable('users')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('email', 'varchar(150)', (col) => col.notNull().unique())
      .addColumn('sub', 'varchar(150)', (col) => col.notNull().unique())
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)) // Correct usage of CURRENT_TIMESTAMP
      .execute();

      await db.schema
      .createTable('assets')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('user_id', 'integer', (col) => col.references('users.id').onDelete('cascade'))
      .addColumn('name', 'varchar(100)', (col) => col.notNull())
      .addColumn('type', 'varchar(10)', (col) =>
        col.check(sql`type IN ('ERC-20', 'ERC-721')`) // Updated to use sql expression
      )
      .addColumn('smart_contract_address', 'varchar(100)', (col) => col.notNull())
      .addColumn('chain', 'varchar(50)', (col) => col.notNull())
      .addColumn('quantity', 'numeric', (col) => col.defaultTo(null)) // Sets column as nullable
      .addColumn('token_id', 'varchar(100)', (col) => col.defaultTo(null)) // Sets column as nullable
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)) // Correct usage of CURRENT_TIMESTAMP
      .addColumn('cost_basis', 'numeric', (col) => col.defaultTo(null)) // Adds cost_basis as a nullable numeric field
      .execute();

    await db.schema
      .createTable('asset_daily_prices')
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('asset_id', 'integer', (col) => col.references('assets.id').onDelete('cascade'))
      .addColumn('date', 'date', (col) => col.notNull())
      .addColumn('price', 'numeric', (col) => col.notNull())
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)) // Correct usage of CURRENT_TIMESTAMP
      .execute();
  }

  async down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('asset_daily_prices').execute();
    await db.schema.dropTable('assets').execute();
    await db.schema.dropTable('users').execute();
  }
}