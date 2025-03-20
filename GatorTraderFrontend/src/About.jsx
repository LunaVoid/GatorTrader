import React from 'react';
import './App.css';
import './Login.css';
import './About.css';
import Navbar from './components/Navbar';

// Import your images:
import gatorTraderLogo from '../public/gatortradertransparent.png';
import hiralImage from '../public/AboutUS/Hiral_Shuklas_Headshot.png';
import paigeImage from '../public/AboutUS/paigevanoverheadshot.png';
import shunmukaImage from '../public/AboutUS/ShunmukaValsaHeadshot.png';
import joshImage from '../public/AboutUS/joshheadshot.png';

function About() {
  return (
    <>
      <Navbar />
      <div className="logo-container">
        {/* Use gatorTraderLogo as the src */}
        <img
          className="logopic"
          src={gatorTraderLogo}
          alt="Gator Trader Logo"
        />
        <p className="logostuff">About Us...</p>
      </div>

      <div className="about-container">
        {/* Our Story Section */}
        <h2>Our Story</h2>
        <div className="story-section">
          <p>
            Gator Trader was created to empower investors with real-time market insights and 
            cutting-edge analytics. Our mission is to bridge the gap between data and 
            decision-making, offering an intuitive platform that helps both novices and 
            professionals navigate the complexities of the stock market.
          </p>
        </div>

        {/* Our Team Section */}
        <h2>Our Team</h2>
        <div className="developer-section">
          <div className="developer-card">
          <a href="https://www.linkedin.com/in/hiral-shukla/" target="_blank" rel="noopener noreferrer">
            <img
              src={hiralImage}
              alt="Hiral Shukla"
              className="developer-image"
            />
          </a>
            <h3>Hiral Shukla</h3>
            <p>placeholder</p>
          </div>
          <div className="developer-card">
          <a href="https://www.linkedin.com/in/paige-vanover/" target="_blank" rel="noopener noreferrer">
            <img
              src={paigeImage}
              alt="Paige Vanover"
              className="developer-image"
            />
          </a>
            <h3>Paige Vanover</h3>
            <p>placeholder</p>
          </div>
          <div className="developer-card">
          <a href="https://www.linkedin.com/in/joshuabrunk/" target="_blank" rel="noopener noreferrer">
            <img
              src={joshImage}
              alt="Josh"
              className="developer-image"
            />
          </a>
            <h3>Josh</h3>
            <p>placeholder</p>
          </div>
          <div className="developer-card">
          <a href="https://www.linkedin.com/in/shunmukavalsa/" target="_blank" rel="noopener noreferrer">
            <img
              src={shunmukaImage}
              alt="Shunmuka Valsa"
              className="developer-image"
            />
          </a>
            <h3>Shunmuka Valsa</h3>
            <p>placeholder</p>
          </div>
        </div>
      </div>

      <div className="footer-bar"></div>
    </>
  );
}

export default About;
