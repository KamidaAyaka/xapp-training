import React from "react";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  EnvelopeIcon,
  UserIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const Item = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", cursor: "pointer" }}>
    <div style={{ width: 30, height: 30, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {React.cloneElement(icon, { width: 20, height: 20 })}
    </div>
    <div style={{ fontSize: 16 }}>{label}</div>
  </div>
);

export default function Sidebar({ onPost }) {
  return (
    <aside
      style={{
        width: 280,
        minHeight: "100vh",
        borderRight: "1px solid #ddd",
        padding: 20,
        boxSizing: "border-box",
        background: "#fff",
        position: "relative",
      }}
    >
      <div>
        <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 18 }}>X風アプリ</div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Item icon={<HomeIcon />} label="ホーム" />
          <Item icon={<MagnifyingGlassIcon />} label="話題を検索" />
          <Item icon={<BellIcon />} label="通知" />
          <Item icon={<EnvelopeIcon />} label="メッセージ" />
          <Item icon={<UserIcon />} label="プロフィール" />
        </nav>
      </div>

      <button
        onClick={() => onPost && onPost()}
        style={{
          background: "#000",
          color: "#fff",
          border: "none",
          padding: "12px 0",
          fontWeight: 700,
          borderRadius: 999,
          cursor: "pointer",
          width: "100%",
          marginTop: 8,       
          transition: "background 0.2s ease",
        }}
          onMouseEnter={(e) => (e.target.style.background = "#111")}
          onMouseLeave={(e) => (e.target.style.background = "#000")}
      >
        ポストする
      </button>
    </aside>
  );
}
