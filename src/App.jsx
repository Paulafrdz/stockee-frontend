import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import "./components/styles/Variables.css";
import './App.css';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;