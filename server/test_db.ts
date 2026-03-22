import "dotenv/config";
import { pool } from "./db";

if (!pool) {
    console.error("Pool is null. DATABASE_URL might be missing.");
    process.exit(1);
}

(async () => {
    try {
        console.log("Testing DB connection...");
        const client = await pool.connect();
        console.log("Connected successfully");
        const res = await client.query('SELECT NOW()');
        console.log("Query result:", res.rows[0]);
        client.release();
        process.exit(0);
    } catch (e) {
        console.error("DB Connection failed:", e);
        process.exit(1);
    }
})();
