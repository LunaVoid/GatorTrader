import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const tokenFromURL = queryParams.get("token");
        if (!tokenFromURL) {
            setMessage("Invalid or missing reset token.");
        } else {
            setToken(tokenFromURL);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: token,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            setMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/Login"), 2500);
        } catch (error) {
            setMessage(error.message || "Something went wrong.");
        }
    };

    return (
        <div className="reset-password-form">
            <h2>Reset Your Password</h2>
            {message && <p style={{ color: "red" }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}

export default ResetPasswordForm;
