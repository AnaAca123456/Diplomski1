import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./../style/login.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
                withCredentials: true,
            });
            login(res.data.user);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Greška prilikom prijave.");
        }
    };

    return (
        <div className="page-wrapper">
        <div className="login-container">
            <h2>Prijava</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    name="email"
                    placeholder="Email adresa"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="šifra"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {error && <p className="error-msg">{error}</p>}

                <button type="submit">Prijavi se</button>
            </form>
            </div>
        </div>
    );
};

export default Login;
