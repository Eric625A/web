import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WarehousePage from './pages/WarehousePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/warehouse" element={<WarehousePage />} />
      </Routes>
    </Router>
  );
}

export default App;
