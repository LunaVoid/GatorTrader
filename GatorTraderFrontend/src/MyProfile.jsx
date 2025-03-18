import React, { useState } from 'react'
import Navbar from './components/Navbar';
import { useUser } from "./utils/userContext";
import './App.css';
import './Login.css'
import './MyProfile.css'

function MyProfile() {
  const { user, logoutUser } = useUser();
  console.log(user);
  const [username, setUsername] = useState(user); // Example username
  //Removed Password, frontend should never store it!
  
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-box">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <p>Profile Pic goes Here</p>
            <img></img>
            <p><strong>Username:</strong> {user}</p>
            
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
          <button className="edit-profile-btn" onClick={logoutUser}>Log Out</button>
        </div>
      </div>
      <div className="disclaimer-box">
        <h3>Disclaimer:</h3>
        <p>
          The information provided on GatorTrader is for educational purposes only and should not be construed as financial advice. While we strive to ensure the accuracy and reliability of the information presented, GatorTrader makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the platform for any purpose. Any reliance you place on such information is strictly at your own risk.
        </p>
        <p>
          In no event will GatorTrader be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from the loss of data or profits arising out of, or in connection with, the use of this platform.
        </p>
        <p>
          GatorTrader is not a licensed financial advisor, and we do not purport to offer personalized financial advice or investment recommendations. The information provided is intended for general educational purposes and should not be relied upon without consulting a qualified financial professional.
        </p>
        <p>
          Investing in financial markets involves risk, including the possible loss of principal. Past performance is not indicative of future results. You should not invest money that you cannot afford to lose. Before making any investment decisions, it is important to do your own research and consult with a licensed financial advisor.
        </p>
        <p>
          The views and opinions expressed on GatorTrader are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer, or company. Any content provided by our authors is their opinion and is not intended to malign any religion, ethnic group, club, organization, company, individual, or anyone or anything.
        </p>
        <p>
          By using GatorTrader, you agree to the terms of this disclaimer.
        </p>
      </div>
    </div>
  );
}

export default MyProfile