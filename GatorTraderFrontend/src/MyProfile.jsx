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
    </div>
  );
}

export default MyProfile