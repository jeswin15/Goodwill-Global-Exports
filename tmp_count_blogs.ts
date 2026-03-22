import pg from 'pg';
import "dotenv/config";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    console.log("Checking blog count...");
    try {
        const res = await pool.query('SELECT COUNT(*) FROM blogs');
        console.log("Blog count:", res.rows[0].count);
    } catch (err) {
        console.error("Query failed:", err);
    } finally {
        await pool.end();
    }
}

test();
