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
      <h1>Infrastructure Bootcamp Complete!</h1>
      <h2>Full Stack Cloud Application</h2>
      <p><strong>Database Status:</strong> Connected</p>
      <p><strong>Database Time:</strong> ${result.rows[0].now}</p>
      <hr>
      <h3>Infrastructure Components:</h3>
      <ul>
        <li>EC2 Instance (You're looking at it!)</li>
        <li>RDS PostgreSQL Database</li>
        <li>S3 Static Website</li>
        <li>CloudFront CDN</li>
        <li>GitHub Actions CI/CD</li>
        <li>Terraform Infrastructure as Code</li>
      </ul>
      <p><strong>Auto-deployed via GitHub Actions!</strong></p>
      <p>GitHub: <a href="https://github.com/sushanthrao11/infra-bootcamp-project">sushanthrao11/infra-bootcamp-project</a></p>
    `);
  } catch (err) {
    res.send(`<h1>Hello from EC2!</h1><p>Database connection error: ${err.message}</p>`);
  }
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'healthy', 
      database: 'connected', 
      timestamp: new Date(),
      deployment: 'GitHub Actions CI/CD'
    });
  } catch (err) {
    res.json({ status: 'unhealthy', database: 'error', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Bootcamp app running on port ${port}`);
});
