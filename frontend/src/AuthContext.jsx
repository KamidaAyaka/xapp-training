/* eslint-disable react-refresh/only-export-components */ // // 追加: ESLint 警告無効化（開発用）
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isLogged: false,
  setIsLogged: () => {},
});

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("xapp_userId"));

  useEffect(() => {
    console.log("[AuthProvider] initial isLogged:", isLogged); // // 追加: デバッグ
    function onStorage(e) {
      if (e.key === "xapp_userId") {
        const newVal = !!e.newValue;
        console.log("[AuthProvider] storage event:", e.key, e.newValue, "->", newVal); // // 追加: デバッグ
        setIsLogged(newVal);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // // 追加: デバッグログで状態変化を確認
  useEffect(() => {
    console.log("[AuthProvider] isLogged changed:", isLogged);
  }, [isLogged]);

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </AuthContext.Provider>
  );
}
