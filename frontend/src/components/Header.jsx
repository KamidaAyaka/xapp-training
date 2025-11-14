// frontend/src/components/Header.jsx
import React from "react";

export default function Header({ q, setQ, onSearch, onLogout }) {
  const handleSearchClick = () => {
    if (typeof onSearch === "function") onSearch(q || "");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (typeof onSearch === "function") onSearch(q || "");
    }
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>ホーム</h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="text"
            aria-label="検索"
            value={q || ""}
            onChange={(e) => setQ && setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="検索"
            style={{
              width: 220,
              padding: "6px 10px",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={handleSearchClick}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#111827",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            検索
          </button>
        </div>

        <button
          onClick={() =>
            onLogout
              ? onLogout()
              : (localStorage.removeItem("xapp_userId"), window.location.reload())
          }
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}
