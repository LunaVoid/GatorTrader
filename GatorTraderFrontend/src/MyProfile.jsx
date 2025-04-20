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
  const { user, logoutUser, profilePic, setProfilePic, imageSender,token, imageGetter, emailSetter} = useUser();
  const [username, setUsername] = useState(user); // Example username
  const [profileImage, setprofileImage] = useState(profilePic)
  //Removed Password, frontend should never store it!

  const [newEmail, setNewEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  async function chooseSendImage(e){
    const file = e.target.files[0];
  setprofileImage(loading3);

  if (file) {
    const returner = await imageSender(file, token);
    console.log("Upload return:", returner);

    // Fetch the newly uploaded image from the backend
    const profileLocation = await imageGetter(token);
    console.log("Updated profile image location:", profileLocation);

    if (profileLocation) {
      setprofileImage(profileLocation);
      setProfilePic(profileLocation); // update global context
    } else {
      setprofileImage(defaultPhoto);
      setProfilePic(null);
    }
  }
}

  async function fetchImage(){
    const profileLocation = await imageGetter(token)
    return profileLocation
  }

  async function isBlobEmpty(blobUrl) {
    try {
      const res = await fetch(blobUrl);
      const blob = await res.blob();
      return blob.size === 0 || !blob.type;
    } catch (err) {
      console.error("Blob fetch failed:", err);
      return true; // If there's any error, treat as invalid
    }
  }

  useEffect(()=>{
    const imageStuffer = async () => {
      const imageData = await fetchImage(); // This returns a blob URL
      console.log("Fetched image data:", imageData);
  
      // Check if it's a blob URL AND if it's actually empty
      if (
        !imageData ||
        imageData === "null" ||
        imageData === "undefined" ||
        imageData.trim() === "" ||
        (imageData.startsWith("blob:") && (await isBlobEmpty(imageData)))
      ) {
        console.log("No valid profile image found, using default.");
        setprofileImage(defaultPhoto);
        setProfilePic(null);
      } else {
        console.log("Valid profile image found.");
        setprofileImage(imageData);
        setProfilePic(imageData);
      }
    };
  
    setprofileImage(defaultPhoto);
    imageStuffer();
  }, []);
  
  useEffect(() => {
    if (profilePic) {
      setprofileImage(profilePic);
      console.log("here");
    }
  }, [profilePic]);

  const handleEmailChange = async () => {

    if (!newEmail || !newEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      setShowSuccess(false);
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }


    try {
      const result = await emailSetter(newEmail, token); // result is true or false
  
      if (result === true) {
        setShowSuccess(true);
        setErrorMsg(null);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setErrorMsg("Could not update email. Please try again.");
        setShowSuccess(false);
        setTimeout(() => setErrorMsg(null), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || "Unexpected error occurred.");
      setShowSuccess(false);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };
  
  return (
    <div>
      <Navbar />
       {/* Popups */}
      {showSuccess && <div className="popup success">✅ Email updated successfully!</div>}
      {errorMsg && <div className="popup error">❌ {errorMsg}</div>}
      <div className="profile-container">
        <div className="profile-box">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <p>Supported formats: WEBP, JPG, GIF, PNG. <br></br> Maximum file size: 1MB</p>
            <img width="150px" src = {profileImage}></img>
            <p style={{ marginTop: '10px' }}><strong>Username:</strong> {user}</p>
          </div>
          <p>Choose a new Profile Photo!</p>
          <input onChange={chooseSendImage} id="inputter" type="file" accept=".png, .jpg, .jpeg, .gif,.webp,image/webp, image/png, image/jpeg, image/gif"></input>
          <input
            id="inputter"
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button className="edit-email-btn" onClick={handleEmailChange}>Change Email</button>
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