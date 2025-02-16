
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './Login.css'
import SignInForm from "./SignInForm";  






function Login() {
  const [count, setCount] = useState(0)

  return (
    <html>
      <head>
        <title>Login Portal</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
          <link href="https://fonts.googleapis.com/css2?family=K2D:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet"></link>
            
      </head>
      <nav className="navbar">
            <div className="navbar__container">
                <h1 className="navbar__logo">GatorTrader</h1>
                <ul className="navbar__menu">
                    <li className="navbar_item">
                        <a href="/Track Stocks" className="navbar__links">Track Stocks</a>
                    </li>
                    <li className="navbar_item">
                        <a href="/About" className="navbar__links">About</a>
                    </li>
                    <li className="navbar_item">
                        <a href="/Login" className="navbar__links">Login</a>
                    </li>
                </ul>
            </div>
        </nav>
      <div className = "logo-container">
                <img className="logopic" src= "../img/gatortradertransparent.png"></img>
                <p className = "logostuff"> GatorTrader</p>
            </div>
            <div className="footer-bar"></div>     
      <SignInForm />
    </html>
  );
}

export default Login 

