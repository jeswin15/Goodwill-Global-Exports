import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL not set');
    process.exit(1);
}

const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function runMigration() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Connected successfully!');

        console.log('\nApplying migration: Adding gallery column to products...');
        await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery text[]');
        console.log('✓ Gallery column added to products');

        console.log('\nApplying migration: Adding category column to blogs...');
        await client.query("ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General'");
        console.log('✓ Category column added to blogs');

        console.log('\nVerifying products table...');
        const productsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `);
        console.log('Products columns:', productsResult.rows);

        console.log('\nVerifying blogs table...');
        const blogsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'blogs'
      ORDER BY ordinal_position
    `);
        console.log('Blogs columns:', blogsResult.rows);

        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigration();
