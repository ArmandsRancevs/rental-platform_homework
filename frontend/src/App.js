// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BrowsePage from './pages/BrowsePage';
import AdminPage from './pages/AdminPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <header className="app-header">
        <nav>
          <ul className="nav-list">
            <li><Link to="/browse">Browse Products</Link></li>
            <li><Link to="/admin">Admin Panel</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </Router>
  );
}
