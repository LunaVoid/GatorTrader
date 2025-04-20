import { createContext, useContext, useState } from 'react';
import { getPhoto, logIn, sendPhoto, signUp, getLevel, setLevel , getFavs, setFavs, setEmail } from './auth';
import { useNavigate } from "react-router-dom";
const UserContext = createContext(null);



export function UserProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [profilePic, setProfilePic] = useState(null)
    const [exp,setEXP] = useState(null);

    const loadUser = () =>{
        console.log("here")
        const userName = sessionStorage.getItem("gtUsername");
        const theToken = sessionStorage.getItem("gtToken");
        const theExpiration = Number(sessionStorage.getItem("gtEXP")); 
        console.log(userName)
        if(userName && theToken && theExpiration != "null"&& !isNaN(theExpiration) && userName && theToken && theExpiration != null){
            console.log("valid token?")
            if(Date.now()<theExpiration * 1000){
                console.log("existing token is valid")
                setUser(userName);
                setToken(theToken);
                setEXP(theExpiration);
                return true;
            }
            console.log("existing token not valid")
            return false; 
        }
        else{
            console.log("existing token doesn't work, user must login")
            navigate("/login");
            return false;
        }
    }

    const loginUser = async (userData) => {
        try {
            const loginData = await logIn(userData);
            console.log("Login data received:", loginData);
            console.log(loginData)
            setUser(loginData.username);
            setToken(loginData.token);
            setEXP(loginData.exp)
            //interesting race condition, doesn't effect anything though
            console.log(user,token,exp)
            sessionStorage.setItem("gtUsername", loginData.username);
            sessionStorage.setItem("gtToken", loginData.token); 
            sessionStorage.setItem("gtEXP", loginData.exp); 
            console.log("State updated - User:", userData.username, "Token:", loginData.token);

        } catch (error) {
            console.error('Error during Login:', error);
            throw error;
        }
    };
    
    const logoutUser = () => {
        setUser(null);
        setToken(null);
        sessionStorage.clear();
        navigate("/login");
    };

    const signupUser = async (userData) => {
        try {
            console.log("Here");
            const data = await signUp(userData);
            return data;  // Success, data will be returned
        } catch (error) {
            console.error('Error during signup:', error);
            throw error;  // Propagate the error to the component
        }
    };

    const imageSender = async (image,token) => {
        try {
            console.log("Here");
            if(token){
                const data = await sendPhoto(image, token);
                console.log(data)
                return data;
            }
            else{
                console.error("Token Error")
            }
              // Success, data will be returned
        } catch (error) {
            console.error('Error during image change', error);
            throw error;  // Propagate the error to the component
        }

    }

    const imageGetter = async (token) => {
        try {
            console.log("Here");
            if(token){
                const data = await getPhoto( token);
                console.log(data)
                const imageObjectUrl = URL.createObjectURL(data);
                return imageObjectUrl;
            }
            else{
                console.error("Token Error")
            }
              // Success, data will be returned
        } catch (error) {
            console.error('Error during image change', error);
            throw error;  // Propagate the error to the component
        }

    }


    const emailSetter = async (email,token) => {
        try {
            if(token){
                const data = await setEmail(email, token);
                console.log(data)
                return data;
            }
            else{
                console.error("Token Error")
            }
              // Success, data will be returned
        } catch (error) {
          console.error('Error during email change', error);
          throw error;  // Propagate the error to the component
        }

    }
    

    const levelGetter = async (token) => {
        try {
            console.log("Here");
            if(token){
                const data = await getLevel( token);
                console.log(data)
                const level = data;
                return level.level;
            }
            else{
                console.error("Token Error")
            }
              // Success, data will be returned
        } catch (error) {
            console.error('level getter error', error);
            throw error;  // Propagate the error to the component
        }

    }

    const levelSetter = async (token, level) => {
        try {
            console.log("Here");
            if(token){
                const data = await setLevel( token, level);
                console.log(data)
                return data;
            }
            else{
                console.error("Token Error")
            }
              // Success, data will be returned
        } catch (error) {
            console.error('level setter error', error);
            throw error;  // Propagate the error to the component
        }

    }


    const favsGetter = async (token) => {
        try {
            console.log("Here");
            if(token){
                const data = await getFavs(token);
                console.log(data)
                const favs = data;
                return favs.stocks;
            }
            else{
                console.error("Token Error")
            }
              // Success, data will be returned
        } catch (error) {
            console.error('faveStocks getter error', error);
            throw error;  // Propagate the error to the component
        }

    }

    const favsSetter = async (token, faveStocks) => {
        try {
            console.log("Here");
            if(token){
                const data = await setFavs( token, faveStocks);
                console.log(data)
                return data;
            }
            else{
              console.error("Token error")
            }
               // Success, data will be returned
        } catch (error) {
            console.error('favStocks setter error', error);
            throw error;  // Propagate the error to the component
        }

    }
    
    return (
        <UserContext.Provider value={{ user, token, profilePic, setProfilePic, loginUser, logoutUser, signupUser,loadUser, imageSender, imageGetter, levelGetter, levelSetter , favsGetter,  favsSetter, emailSetter}}>
            {children}
        </UserContext.Provider>
    );

}

export function useUser() {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('Context is COOKED');
    }
    return context;
}
