import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import "./components/styles/Variables.css";
import './App.css';
import AppRouter from './router/AppRouter';
import useOnboarding from './hooks/useOnboarding';
import "./driver-theme.css"

function AppContent() {
  useOnboarding();
  return <AppRouter/>;
}

function App() {
  
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;