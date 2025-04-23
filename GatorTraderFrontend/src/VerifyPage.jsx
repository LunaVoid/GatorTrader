import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VerifyPage.css"; 

function VerifyPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            fetch(`https://gatortrader.lunael.org/api/verify?token=${token}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data.message);
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000); // wait 2 seconds before redirecting
                })
                .catch(err => {
                    console.error("Verification failed:", err);
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                });
        } else {
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [navigate]);

    return (
        <div className="verify-container">
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your account.</p>
        </div>
    );
}

export default VerifyPage;