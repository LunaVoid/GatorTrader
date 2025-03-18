import { createContext, useContext, useState } from 'react';
import { logIn, sendPhoto, signUp } from './auth';
const UserContext = createContext(null);


export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [profilePic, setProfilePic] = useState(null)
    

    const loginUser = async (userData) => {
        try {
            const loginData = await logIn(userData);
            console.log("Login data received:", loginData);
            console.log(loginData)
            setUser(loginData.username);
            setToken(loginData.token);
            console.log(atob(loginData.profile));
            setProfilePic(atob(loginData.profile))
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



    
    return (
        <UserContext.Provider value={{ user, token, profilePic, loginUser, logoutUser, signupUser, imageSender }}>
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
