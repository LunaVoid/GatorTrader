import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar';
import { useUser } from "./utils/userContext";
import './App.css';
import './Login.css'
import './MyProfile.css'
import loading from '../public/loading.gif'
import loading2 from '../public/loading2.gif'
import loading3 from '../public/loading3.gif'
import defaultPhoto from '../public/defaultPhoto.jpg'

function MyProfile() {
  const { user, logoutUser, profilePic, imageSender,token, imageGetter} = useUser();
  const [username, setUsername] = useState(user); // Example username
  const [profileImage, setprofileImage] = useState(profilePic)
  //Removed Password, frontend should never store it!

  async function chooseSendImage(e){
    const file = e.target.files[0];
    setprofileImage(loading3)
    if (file) {
      const returner = await imageSender(file,token);
      console.log(returner)
      console.log(returner.message);
      console.log("now here")
    }
    console.log("update Profile")
    const profileLocation = await imageGetter(token)
    setprofileImage(profileLocation)
  }

  async function fetchImage(){
    const profileLocation = await imageGetter(token)
    return profileLocation
  }


  useEffect(() => {
    
    if(profilePic == "" || profilePic == null){
      setprofileImage(defaultPhoto)
      console.log("default image")
    }
    else{
      setprofileImage(loading3)
      const imageStuffer = async () => {
        const imageData = await fetchImage(); // assuming fetchImage is a function that returns a promise
        console.log(imageData);
        setprofileImage(imageData);
      };
      imageStuffer();
    }
  },[])
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-box">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <p>Supported formats: WEBP, JPG, GIF, PNG. <br></br> Maximum file size: 1MB</p>
            <img width="150px" src = {profileImage}></img>
            <p><strong>Username:</strong> {user}</p>
            
          </div>
          <p>Choose a new Profile Photo!</p>
          <input onChange={chooseSendImage} id="inputter" type="file" accept=".png, .jpg, .jpeg, .gif,.webp,image/webp, image/png, image/jpeg, image/gif"></input>
          <button className="edit-profile-btn" onClick={logoutUser}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile