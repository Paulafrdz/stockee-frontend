import React, { useState } from 'react'; 
import './components/styles/Variables.css';
import './App.css'
// import { BrowserRouter } from "react-router-dom";
// import AuthPage from './pages/AuthPage.jsx';
import MainContent from './components/mainContent/MainContent';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <MainContent></MainContent>
    </div>
  );
}
export default App
