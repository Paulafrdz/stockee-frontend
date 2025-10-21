import React, { useState } from 'react'; 
import './components/styles/Variables.css';
import './App.css'
import AuthPage from './pages/AuthPage.jsx';
// import DashboardLayout from './components/dashboardLayout/DashboardLayout';
import { BrowserRouter } from 'react-router-dom';
import StockPage from './pages/StockPage';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <BrowserRouter>
      <AuthPage></AuthPage>
      
      </BrowserRouter>
    </>
  );
}
export default App
