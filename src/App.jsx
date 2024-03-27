import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContextProvider from "./context/ContextProvider";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import Home from "./page/Home";

function App() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;
