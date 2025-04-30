// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import BrowsePage from './pages/BrowsePage';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/admin">Admin lapa</Link>
        <Link to="/browse">Sludinājumu pārlūkošana</Link>
      </nav>
      <Switch>
        <Route path="/admin">
          <AdminPage />
        </Route>
        <Route path="/browse">
          <BrowsePage />
        </Route>
        <Route path="/">
          <h1>Sākumlapa</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
