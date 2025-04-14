import { useState } from "react";
import { Link } from "react-router-dom"
import { UserProvider } from "../utils/userContext";
import { useUser } from "../utils/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignInForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { user, loginUser, logoutUser, loadUser } = useUser();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        let userData = {"username":username, "password":password}
        let data;
        //Store Token in context and then redirect once recieved.
        try{
            data = await loginUser(userData);
            console.log("here in signin");
            setError("");
            const isNew = localStorage.getItem("isNew");
            if (!isNew){
                navigate("/Intro");
            }
            else{
                navigate("/TrackedStocks");
            }
            
        }

        catch(error){
            setError(error.message || 'An unexpected error occurred.');  // Set the error message
            console.log('Error during signup:', error.message);
        }
    };

    useEffect(() => {
        console.log("Current user context:", user);
    }, [user]);

    useEffect(() => {
        console.log("running on reload")
        loadUser()
    }, []);

    return (
        <div className="sign-in-form">
            <label style={{ color: 'red' }}>{error}</label>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type=""
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password here"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-links">
                <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                <Link to="/SignUp" className="signup">Sign Up Here</Link>
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

export default SignInForm;