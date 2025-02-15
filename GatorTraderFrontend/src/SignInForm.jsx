import React, { useState } from "react";

function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
        // Add authentication logic here
    };

    return (
        <div className="sign-in-form">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="johndoe@ufl.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <a href="/signup" className="signup">Sign Up Here</a>
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

export default SignInForm;