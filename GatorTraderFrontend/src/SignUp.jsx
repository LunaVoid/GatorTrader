import SignUpForm from './components/SignUpForm.jsx'
import './Login.css';
import React from 'react';
import './App.css';
import logo from '../public/gatortradertransparent.png';

function SignUp() {
  return (
    <div>
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