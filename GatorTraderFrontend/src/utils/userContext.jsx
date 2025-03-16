import { createContext, useContext, useState } from 'react';
import { logIn, signUp } from './auth';

const UserContext = createContext(null);


export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [exp,setEXP] = useState(null);
    
    const loadUser = () =>{
        userName = sessionStorage.getItem("gtUsername");
        theToken = sessionStorage.getItem("gtToken");
        theExpiration = sessionStorage.getItem("gtEXP"); 
        if(userName && theToken && theExpiration != null){
            
            
        }
        else{
            console.log("n")
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
            sessionStorage.setItem("gtUsername", user);
            sessionStorage.setItem("gtToken", token); 
            sessionStorage.setItem("gtEXP", exp); 
            console.log("State updated - User:", userData.username, "Token:", loginData.token);

        } catch (error) {
            console.error('Error during Login:', error);
            throw error;
        }
    };
    
    const logoutUser = () => {
        setUser(null);
        setToken(null);
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
        <UserContext.Provider value={{ user, token, loginUser, logoutUser, signupUser }}>
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
