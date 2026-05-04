import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('connect', () => {
    console.log('Connect success');
});

pool.on('error', (err) => {
    console.error(' Database connection error:', err);
    process.exit(-1);

})

export default pool;