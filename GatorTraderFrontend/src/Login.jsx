
//import { useState } from 'react';

import './components/Navbar.jsx';
import './App.css';
import './Login.css';
import SignInForm from "./components/SignInForm.jsx";  
import Navbar from './components/Navbar.jsx';
import logo from '../public/gatortradertransparent.png';





function Login() {
  //const [count, setCount] = useState(0)
  

  return (
    <div>
    
      <nav className="navbar">
                  <div className="navbar__container">
                      <h1 className="navbar__logo">GatorTrader</h1>
                      <ul className="navbar__menu">
                          
                      </ul>
                  </div>
      </nav>
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

