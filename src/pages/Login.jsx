import React, { useState } from "react";
import "../Auth.css";
import { API_URL } from "../constants"; // Adjust path if needed

function Login({ onSwitchToSignup, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            if (onLoginSuccess) {
                onLoginSuccess(data.username);
            } else {
                window.location.reload();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>
                    Welcome back to <span className="auth-brand">AskMate</span>
                </h2>

                <p className="auth-subtitle">
                    Log in to continue your AI chats
                </p>

                {error && <div className="auth-error">{error}</div>}

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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-btn">
                    Log In
                </button>

                <p className="auth-switch-text">
                    Don't have an account?{" "}
                    <span
                        onClick={onSwitchToSignup}
                        className="auth-link"
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;