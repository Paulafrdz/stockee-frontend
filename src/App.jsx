import React, { useState } from 'react'; 
import './components/styles/Variables.css';
import './App.css'
// import AuthPage from './pages/AuthPage.jsx';
// import DashboardLayout from './components/dashboardLayout/DashboardLayout';
// import { BrowserRouter } from 'react-router-dom';
import AddIngredientModal from './components/addIngredientModal/AddIngredientModal';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <AddIngredientModal isOpen={true}
  onClose={() => {}}
  onSubmit={(data) => console.log(data)}>
        
      </AddIngredientModal>
    </div>
  );
}
export default App
