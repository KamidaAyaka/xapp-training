// server/test-db.js
const db = require('./db');

(async () => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('DB接続OK, test result =', rows[0].result);
    process.exit(0);
  } catch (e) {
    console.error('DB接続エラー:', e.message);
    process.exit(1);
  }
})();
