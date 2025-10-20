import React, { useState } from 'react'; 
import './components/styles/Variables.css';
import './App.css'
// import AuthPage from './pages/AuthPage.jsx';
// import DashboardLayout from './components/dashboardLayout/DashboardLayout';
// import { BrowserRouter } from 'react-router-dom';
import AddIngredientButton from './components/addIngredientButton/AddIngredientButton';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
     <AddIngredientButton></AddIngredientButton>
    </div>
  );
}
export default App
