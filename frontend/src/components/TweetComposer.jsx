import React, { useState } from "react";

export default function TweetComposer({ onPosted }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const maxLen = 280;

  async function handlePost(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(localStorage.getItem("xapp_userId") || 1),
          content: text.trim(),
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || "投稿に失敗しました");
      }
      const created = await res.json();
      setText("");
      if (typeof onPosted === "function") onPosted(created);
    } catch (err) {
      alert("投稿エラー: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handlePost}
      className="rounded p-4 mb-6 bg-white shadow-sm"
    >
      <textarea
      value={text}  
      onChange={(e) => setText(e.target.value)}
      maxLength={maxLen}
      placeholder="いまどうしてる？"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '140px',         // 高さ
        padding: '12px',
        border: '1px solid #e5e7eb',// 薄いグレー
        borderRadius: '8px',
        background: '#fff',
        resize: 'vertical',
        outline: 'none',     // ← 追加
        boxShadow: 'none'    // ← 追加（Safari対策）
  }}
/>

      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-gray-500">
          {text.length}/{maxLen}
        </div>
        <button
          type="submit"
          disabled={sending || text.trim().length === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {sending ? "送信中..." : "投稿"}
        </button>
      </div>
    </form>
  );
}