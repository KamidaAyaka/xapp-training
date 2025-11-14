import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthContext } from "./AuthContext";

function App(){
  const { isLogged } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={ isLogged ? <Navigate to="/home" /> : <Login /> } />
      <Route path="/home" element={ isLogged ? <Home /> : <Navigate to="/" /> } />
    </Routes>
  );
}

export default App;
