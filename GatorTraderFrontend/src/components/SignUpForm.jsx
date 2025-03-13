import { useState } from "react";
import { signUp } from "../utils/auth";
/*rfce*/
function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Username:", username);
        console.log("Password:", password);
        let userData = {"username":username, "password":password, "profile_pic":"", "email":email}
        const data = await signUp(userData);
        console.log(data)
        // Add authentication logic here
    };

    //username, password, profile pic, email, stocks
    //under 20 characters
    //frontend input field sanitization

    return (
        <div className="sign-in-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
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


                
                <button type="submit" onClick={handleSubmit}>Create Account</button>

            </form>
        </div>
    );
}

export default SignUpForm;