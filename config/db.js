const mysql = require('mysql2');

// Render-la irukra DATABASE_URL illa na MYSQL_URL edhuvanaalum eduthukum maadhiri:
const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL || 'mysql://root@localhost:3306/skillforge';

const db = mysql.createConnection(connectionString);

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
    return;
  }
  console.log('MySQL Connected!');
});

module.exports = db;