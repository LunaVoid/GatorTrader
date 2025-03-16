import { useState } from "react";
import { UserProvider } from "../utils/userContext";
import { useUser } from "../utils/userContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"

/*rfce*/
function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const { user, loginUser, logoutUser, signupUser} = useUser();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Username:", username);
        console.log("Password:", password);
        let userData = {"username":username, "password":password, "profile_pic":"", "email":email}

        try{
            const data = await signupUser(userData);
            console.log(data)
            setError("");
            navigate("/Login")
            
        }

        catch(error){
            setError(error.message || 'An unexpected error occurred.');  // Set the error message
            console.log('Error during signup:', error.message);
        }

    };

    //username, password, profile pic, email, stocks
    //under 20 characters
    //frontend input field sanitization

    return (
        <div className="sign-in-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label style={{ color: 'red' }}>{error}</label>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter email here"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="username"
                        id="username"
                        placeholder="Create Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password here"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Link to="/Login" className="signup">Log In Here</Link>


                
                <button type="submit" onClick={handleSubmit}>Create Account</button>

            </form>
        </div>
    );
}

export default SignUpForm;