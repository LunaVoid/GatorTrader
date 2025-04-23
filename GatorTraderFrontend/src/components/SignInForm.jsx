import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../utils/userContext";

function SignInForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showResetPopup, setShowResetPopup] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");

    const { user, loginUser, loadUser } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userData = { username, password };
        try {
            await loginUser(userData);
            setError("");
            const isNew = localStorage.getItem("isNew");
            if(!isNew){
                navigate("/Intro")
            } else {
                navigate("/TrackedStocks")
            }
        } catch (error) {
            setError(error.message || "An unexpected error occurred.");
        }
    };

    const handleResetSubmit = async () => {
        try {
            const response = await fetch("https://gatortrader.lunael.org/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: resetEmail })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setResetMessage("Reset link sent! Check your email.");
        } catch (err) {
            setResetMessage(err.message || "Something went wrong.");
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        console.log("Current user context:", user);
    }, [user]);

    return (
        <div className="sign-in-form">
            <label style={{ color: 'red' }}>{error}</label>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
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
                    <p className="forgot-password" onClick={() => setShowResetPopup(true)}>Forgot Password?</p>
                    <Link to="/SignUp" className="signup">Sign Up Here</Link>
                </div>
                <button type="submit">Sign In</button>
            </form>

            {showResetPopup && (
                <div className="forgot-popup-overlay">
                    <div className="forgot-popup">
                        <h3>Reset Your Password</h3>
                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <button onClick={handleResetSubmit}>Send Reset Link</button>
                        <p>{resetMessage}</p>
                        <button onClick={() => {
                            setShowResetPopup(false);
                            setResetMessage("");
                            setResetEmail("");
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignInForm;