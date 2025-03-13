import { useState } from "react";
import { Link } from "react-router-dom"
import { logIn } from "../utils/auth";

function SignInForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        let userData = {"username":username, "password":password}
        const data = await logIn(userData);
        console.log(data)
        //Store Token in context and then redirect once recieved.
    };

    return (
        <div className="sign-in-form">
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