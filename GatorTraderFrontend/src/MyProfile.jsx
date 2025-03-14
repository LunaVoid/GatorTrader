import React, { useState } from 'react'
import Navbar from './components/Navbar';
import { useUser } from "./utils/userContext";
import './App.css';
import './Login.css'
import './MyProfile.css'

function MyProfile() {
  const { user, loginUser, logoutUser } = useUser();
  console.log(user);
  const [username, setUsername] = useState("User123"); // Example username
  const [password, setPassword] = useState("password123"); // Example password

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-box">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <p><strong>Username:</strong> {user}</p>
            <p><strong>Password:</strong> {"•".repeat(password.length)}</p>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile