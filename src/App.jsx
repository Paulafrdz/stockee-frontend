import React, { useState } from 'react'; 
import './components/styles/Variables.css';
import './App.css'
import { BrowserRouter } from "react-router-dom";
// import AuthPage from './pages/AuthPage.jsx';
import Sidebar from './components/sidebar/Sidebar';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
     <BrowserRouter>
      <Sidebar></Sidebar>
    </BrowserRouter>
    </div>
  );
}
export default App
