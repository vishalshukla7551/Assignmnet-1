const db = require('./db');

async function init() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    );
  `);
  console.log('Schools table created!');
  process.exit();
}

init();
