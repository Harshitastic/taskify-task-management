const { Client } = require('pg');
const { execSync } = require('child_process');

async function main() {
  const directUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!directUrl) {
    console.error('No database connection string found');
    process.exit(1);
  }

  if (directUrl.startsWith('postgres://') || directUrl.startsWith('postgresql://')) {
    const client = new Client({ connectionString: directUrl });
    try {
      await client.connect();
      console.log("Checking if database 'taskify' exists...");
      const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'taskify'");
      if (res.rowCount === 0) {
        console.log("Database 'taskify' does not exist. Creating database 'taskify'...");
        await client.query("CREATE DATABASE taskify");
        console.log("Database 'taskify' created successfully.");
      } else {
        console.log("Database 'taskify' already exists.");
      }
    } catch (err) {
      console.error('Error during database check/creation:', err);
    } finally {
      await client.end();
    }
  }

  const env = { ...process.env };
  function replaceDbName(url, dbName) {
    if (!url) return url;
    if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
      return url.replace(/\/neondb(\?|$)/, `/${dbName}$1`);
    }
    return url;
  }

  if (env.POSTGRES_PRISMA_URL) env.POSTGRES_PRISMA_URL = replaceDbName(env.POSTGRES_PRISMA_URL, 'taskify');
  if (env.POSTGRES_URL_NON_POOLING) env.POSTGRES_URL_NON_POOLING = replaceDbName(env.POSTGRES_URL_NON_POOLING, 'taskify');
  if (env.DATABASE_URL) env.DATABASE_URL = replaceDbName(env.DATABASE_URL, 'taskify');

  console.log('Running prisma db push on target database (taskify)...');
  execSync('npx prisma db push', {
    env,
    stdio: 'inherit'
  });
}

main();
