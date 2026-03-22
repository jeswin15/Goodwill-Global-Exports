import pg from 'pg';
import "dotenv/config";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    console.log("Testing connection...");
    try {
        const res = await pool.query('SELECT NOW()');
        console.log("Connection successful:", res.rows[0]);
    } catch (err) {
        console.error("Connection failed:", err);
    } finally {
        await pool.end();
    }
}

test();
