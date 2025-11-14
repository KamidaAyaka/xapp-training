import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TweetComposer from "../components/TweetComposer";
import Header from "../components/Header";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  async function loadPosts(search='') {
    setLoading(true);
    try {
      const url = search ? `http://localhost:3001/api/posts?search=${encodeURIComponent(search)}` : 'http://localhost:3001/api/posts';
        console.log('[debug] loadPosts url =', url);
      const res = await fetch(url);
      const data = await res.json();
        console.log('[debug] loadPosts response:', data);
      const arr = Array.isArray(data.value) ? data.value : Array.isArray(data) ? data : [];
      setPosts(arr);
    } catch (err) {
      console.error('load posts error', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadPosts();
    })();
    return () => { mounted = false; };
  }, []);


  // 追加：Sidebar のボタンから投稿
  async function handleSidebarPost(maybeContent) {
    const content = (typeof maybeContent === "string" && maybeContent.trim().length > 0)
      ? maybeContent.trim()
      : window.prompt("投稿内容を入力してください");

    if (!content || !content.trim()) return;

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(localStorage.getItem("xapp_userId") || 1),
          content: content,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "投稿に失敗しました");
      }

      const created = await res.json();

      // 画面に即時反映（先頭に追加）
      setPosts(prev => [created, ...prev]);

      // 成功通知（簡易）
      alert("投稿しました");
    } catch (err) {
      console.error("sidebar post error:", err);
      alert("投稿に失敗しました: " + err.message);
    }
  }


  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Sidebar onPost={handleSidebarPost} />
      <main style={{ flex: 1, padding: 24 }}>
 + <Header q={q} setQ={setQ} onSearch={(searchTerm) => loadPosts(searchTerm)} />

        <TweetComposer onPosted={() => loadPosts(q)} />

        {loading ? <p>読み込み中...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.length === 0 && <div>投稿がありません。</div>}
            {posts.map((p) => (
              <article key={p.id} style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8, background: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{p.user_handle} ・ {new Date(p.created_at).toLocaleString()}</div>
                  <div style={{ marginTop: 8, color: '#111827' }}>{p.content}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                    いいね {p.likes_count} ・ リポスト {p.repost_count} ・ 返信 {p.reply_count}
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}
      </main>

      <aside style={{ width: 360, padding: 24, display: "none" /* kept hidden */ }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>トレンド</div>
        <p style={{ color: "#9ca3af" }}>（右カラムは未使用）</p>
      </aside>
    </div>
  );
}
