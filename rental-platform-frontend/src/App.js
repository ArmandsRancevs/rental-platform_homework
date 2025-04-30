// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import BrowsePage from './pages/BrowsePage';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/admin">Admin lapa</Link>
        <Link to="/browse">Sludinājumu pārlūkošana</Link>
      </nav>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/" element={<h1>Sākumlapa</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
