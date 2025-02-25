
//import { useState } from 'react';

import './components/Navbar.jsx';
import './App.css';
import './Login.css';
import SignInForm from "./SignInForm";  
import Navbar from './components/Navbar.jsx';






function Login() {
  //const [count, setCount] = useState(0)
  const w = false;

  return (
    <div>
      <head>
        <title>Login Portal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
          <link rel="preconnect" href="https://fonts.gstatic.com"></link>
          <link href="https://fonts.googleapis.com/css2?family=K2D:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet"></link>
            
      </head>
      {(w) &&<Navbar/>}
      <div className = "logo-container">
                <img className="logopic" src= "../img/gatortradertransparent.png"></img>
                <p className = "logostuff"> GatorTrader</p>
            </div>
            <div className="footer-bar"></div>     
      <SignInForm />
    </div>
  );
}

export default Login 

