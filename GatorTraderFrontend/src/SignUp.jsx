import SignUpForm from './components/SignUpForm.jsx'
import './Login.css';
import React from 'react';
import './App.css';
import logo from '../public/gatortradertransparent.png';

function SignUp() {
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
                <img className="logopic" src= {logo}></img>
                <p className = "logostuff"> GatorTrader</p>
            </div>
            <div className="footer-bar"></div>  
        <SignUpForm/>
    </div>
    
  )
}

export default SignUp