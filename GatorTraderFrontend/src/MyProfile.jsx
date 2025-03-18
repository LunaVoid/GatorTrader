import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar';
import { useUser } from "./utils/userContext";
import './App.css';
import './Login.css'
import './MyProfile.css'
import defaultPhoto from '/defaultPhoto.jpg'

function MyProfile() {
  const { user, logoutUser, profilePic, imageSender,token} = useUser();
  const [username, setUsername] = useState(user); // Example username
  const [profileImage, setprofileImage] = useState(profilePic)
  //Removed Password, frontend should never store it!

  async function chooseSendImage(e){
    const file = e.target.files[0];
    if (file) {
      const returner = await imageSender(file,token);
      console.log(returner.message);
      setprofileImage(returner.profile);
    }
  }


  useEffect(() => {
    if(profilePic == ""){
      setprofileImage(defaultPhoto)
    }
  })
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-box">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <p>Profile Pic goes Here</p>
            <img width="150px" src = {profileImage}></img>
            <p><strong>Username:</strong> {user}</p>
            
          </div>
          <p>Choose a new Profile Photo!</p>
          <input onChange={chooseSendImage} id = "inputter" type = "file" accept="image/*"></input>
          <button className="edit-profile-btn" onClick={logoutUser}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile