import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext"; 

export default function Login() {
  const { setIsLogged } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErr(body.error || "Login failed");
        return;
      }

      const body = await res.json();
      localStorage.setItem("xapp_userId", body.userId);
      localStorage.setItem("xapp_userHandle", body.userHandle);
      
      setIsLogged(true);
      
      nav("/home");
    } catch (err) {
      console.error("Login network error:", err);
      setErr("Network error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          width: 400,
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 20 }}>
          
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 30 }}>
          ログイン
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            textAlign: "left",
          }}
        >
          <label style={{ fontSize: 14, color: "#374151" }}>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "10px 12px",
              fontSize: 15,
              width: "100%",
            }}
          />
          <label style={{ fontSize: 14, color: "#374151" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 6,
              padding: "10px 12px",
              fontSize: 15,
              width: "100%",
            }}
          />
          {err && (
            <p style={{ color: "#dc2626", fontSize: 13, marginTop: 4 }}>{err}</p>
          )}
          <button
            type="submit"
            style={{
              background: "#1DA1F2",
              color: "#fff",
              border: "none",
              borderRadius: 9999,
              padding: "12px 0",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            ログイン
          </button>
        </form>

        <p
          style={{
            fontSize: 13,
            color: "#6b7280",
            marginTop: 16,
          }}
        >
          テスト用: <strong>login001 / password123</strong>
        </p>
      </div>
    </div>
  );
}
