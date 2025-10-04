const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Database connection with SSL
const pool = new Pool({
  host: process.env.DB_HOST || 'bootcamp-postgres.cheg22iwcrnd.us-west-1.rds.amazonaws.com',
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'dbadmin',
  password: process.env.DB_PASS || 'BootcampPass123!',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`
      <h1>Hello from EC2 with RDS!</h1>
      <p>Database connected successfully!</p>
      <p>Current database time: ${result.rows[0].now}</p>
      <p>Auto-deployed with GitHub Actions!</p>
    `);
  } catch (err) {
    res.send(`<h1>Hello from EC2!</h1><p>Database connection error: ${err.message}</p>`);
  }
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected', timestamp: new Date() });
  } catch (err) {
    res.json({ status: 'unhealthy', database: 'error', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`App with database running on port ${port}`);
});
