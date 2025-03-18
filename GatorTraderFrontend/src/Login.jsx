
//import { useState } from 'react';

import './components/Navbar.jsx';
import './App.css';
import './Login.css';
import SignInForm from "./components/SignInForm.jsx";  
import Navbar from './components/Navbar.jsx';
import logo from '../public/gatortradertransparent.png';





function Login() {
  //const [count, setCount] = useState(0)
  const w = false;

  return (
    <div>
    
      {(w) &&<Navbar/>}
      <div className = "logo-container">
        <img className="logopic" src={logo} alt="Logo"></img>
        <p className = "logostuff"> GatorTrader</p>
      </div>
      <SignInForm />
      <div className="footer-bar"></div>     
      
      </div>
  );
}

export default Login 

