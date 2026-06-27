const mysql = require('mysql2');

const db = mysql.createConnection(
  process.env.MYSQL_URL || 'mysql://root@localhost:3306/skillforge'
);

db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
    return;
  }
  console.log('MySQL Connected!');
});

module.exports = db;