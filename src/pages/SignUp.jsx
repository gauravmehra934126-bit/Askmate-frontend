import React, { useState } from "react";
import "../Auth.css";
import { API_URL } from "../constants"; // Adjust path if needed

function SignUp({ onSwitchToLogin }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Ensures cookies can be sent/received if registration logs you in automatically
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Registration failed");
            }

            setSuccess("Account created successfully! Redirecting to login...");

            setTimeout(() => {
                onSwitchToLogin();
            }, 1500);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSignup}>
                <h2>
                    Join <span className="auth-brand">AskMate AI</span>
                </h2>

                <p className="auth-subtitle">
                    Create an account to save your chat threads
                </p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-btn">
                    Sign Up
                </button>

                <p className="auth-switch-text">
                    Already have an account?{" "}
                    <span onClick={onSwitchToLogin} className="auth-link">
                        Log in
                    </span>
                </p>
            </form>
        </div>
    );
}

export default SignUp;