// src/AppRouter.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import QuestionScreen from "./pages/QuestionPage/QuestionPage";
import FlowerPage from "./pages/FlowerPage/FlowerPage";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage/InfoPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuestionScreen />} />
      <Route path="/flower/:hash" element={<FlowerPage />} />
      <Route path="/info" element={<InfoPage />}/>
    </Routes>
  );
}