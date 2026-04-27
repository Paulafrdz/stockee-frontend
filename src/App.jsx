import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import "./components/styles/Variables.css";
import './App.css';
import AppRouter from './router/AppRouter';
import "./driver-theme.css"
import useOnboarding from './hooks/useOnboarding';

function App() {

  useOnboarding();
  
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;