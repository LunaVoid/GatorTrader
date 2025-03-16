//import { useState } from 'react';
import './App.css';
import './Login.css';
import Navbar from './components/Navbar';
import logo from '../public/gatortradertransparent.png';






function About() {
  //const [count, setCount] = useState(0)

  return (
    <html>
        
      <Navbar/>
      <div className = "logo-container">
                <img className="logopic" src= {logo}></img>
                <p className = "logostuff"> About Us...</p>
            </div>
            <div className="footer-bar"></div>     
      
    </html>
  );
}

export default About

