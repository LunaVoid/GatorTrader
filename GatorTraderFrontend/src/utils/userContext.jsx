import { createContext, useContext, useState } from 'react';
import { logIn } from './auth';
const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const loginUser = async (userData) => {
        const loginData = await logIn(userData);
        console.log("Login data received:", loginData);
        console.log(loginData)
        setUser(loginData.username);
        setToken(loginData.token);
        console.log("State updated - User:", userData.username, "Token:", loginData.token);
    };
    
    const logoutUser = () => {
        setUser(null);
        setToken(null);
    };
    
    return (
        <UserContext.Provider value={{ user, token, loginUser, logoutUser }}>
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
