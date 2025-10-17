import React, { useState } from 'react'; 
import './components/styles/Variables.css';
import './App.css'
// import RegisterForm from './components/registerForm/RegisterForm.jsx';
import LoginForm from './components/loginForm/LoginForm.jsx';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
     {/* <RegisterForm></RegisterForm> */}
     <LoginForm></LoginForm>
    </div>
  );
}
export default App
