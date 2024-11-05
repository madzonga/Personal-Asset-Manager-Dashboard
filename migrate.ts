// migrate.ts
import db from './src/kysely-config';
import CreateTablesMigration from './src/migrations/2024xx_create_tables';

async function runMigrations() {
  const migration = new CreateTablesMigration();
  await migration.down(db);
  await migration.up(db);
  console.log('Migrations executed successfully.');
  await db.destroy();
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});