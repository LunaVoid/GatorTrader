import { createContext, useContext, useState } from 'react';
import { logIn, signUp } from './auth';
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);



export function UserProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
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
                setEXP(theExpiration)
                navigate("/")
            }
            
        }
        else{
            console.log("existing token doesn't work, user must login")
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




    
    return (
        <UserContext.Provider value={{ user, token, loginUser, logoutUser, signupUser, loadUser }}>
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
