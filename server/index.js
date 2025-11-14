// server/index.js
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // DB接続設定（mysql2/promise）
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => { console.log(new Date().toISOString(), 'REQ', req.ip, req.method, req.url); next(); });

/* ========================================
   認証API：POST /api/login
   ======================================== */
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  try {
    // username でユーザ取得
    const [rows] = await pool.query(
      "SELECT id, user_id, username, password_hash FROM users WHERE username = ?",
      [username]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: "invalid credentials" });

    const user = rows[0];

    // 研修中：平文比較（今のダミーデータはハッシュ化していない）
    if (password !== user.password_hash)
      return res.status(401).json({ error: "invalid credentials" });

    // 認証成功
    return res.json({
      ok: true,
      userId: user.id,
      userHandle: user.user_id,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "internal error" });
  }
});

/* ========================================
   ヘルスチェック
   ======================================== */
app.get("/health", (req, res) => res.json({ ok: true }));

/* ========================================
   投稿API（DB連携版）
   ======================================== */


// 投稿作成
app.post("/api/posts", async (req, res) => {
  const {
    userId,
    content,
    post_type = "post",
    parent_post_id = null,
    reply_to_user_id = null,
    media_url = null,
  } = req.body;
  if (!userId || !content)
    return res.status(400).json({ error: "userId and content required" });

  try {
    const [result] = await pool.query(
      `INSERT INTO posts (user_id, content, post_type, parent_post_id, reply_to_user_id, media_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, content, post_type, parent_post_id, reply_to_user_id, media_url]
    );
    const [rows] = await pool.query(`SELECT * FROM posts WHERE id = ?`, [
      result.insertId,
    ]);
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return res.status(500).json({ error: "internal error" });
  }
});

/* ========================================
   サーバ起動
   ======================================== */
   if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
    });
  }
module.exports = app; // テストから supertest で require するための export

/* ============================
   一覧取得・検索API：GET /api/posts?search=<keyword>
   - content と user_handle を部分一致で検索
   - 検索ワードがない場合は全件（is_deleted=0）を返す
   ============================ */
app.get('/api/posts', async (req, res) => {
  try {
    const q = (req.query.search || '').trim();
    let sql = `SELECT p.id, p.user_id, u.user_id AS user_handle, p.content, p.post_type, p.parent_post_id,
                      p.reply_to_user_id, p.likes_count, p.repost_count, p.reply_count, p.created_at
               FROM posts p
               LEFT JOIN users u ON p.user_id = u.id
               WHERE p.is_deleted = 0`;
    const params = [];
    if (q) {
      sql += ` AND (p.content LIKE ? OR u.user_id LIKE ?)`;
      const like = '%' + q + '%';
      params.push(like, like);
    }
    sql += ` ORDER BY p.created_at DESC LIMIT 100`;
    const [rows] = await pool.query(sql, params);
    return res.json({ value: rows, Count: rows.length });
  } catch (err) {
    console.error('search posts error:', err);
    return res.status(500).json({ error: 'internal error' });
  }
});


