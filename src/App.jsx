import React, { useState } from 'react'; 
import './components/styles/Variables.css';
import './App.css'

import AuthPage from './pages/AuthPage.jsx';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
     <AuthPage></AuthPage>
    </div>
  );
}
export default App
