import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../style/register.css";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: "",
        firstName: "",
        lastName: "",
        phone: "",
        birthDate: "",
        photo: null,
        email: "",
        password: "",
        confirmPassword: "",
        licenseNumber: "",
        securityCode: "",
        bio: "",
        companyNames: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        if (e.target.name === "photo") {
            setFormData({ ...formData, photo: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError("Šifre se ne poklapaju.");
        }

        if (formData.role === "mentor" && formData.securityCode !== "250321") {
            return setError("Pogrešan sigurnosni kod za mentore.");
        }

        if (formData.role === "admin") {
            return setError("Registracija za admina nije dozvoljena.");
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });

        try {
            await axios.post("http://localhost:5000/api/auth/register", data);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Greška prilikom registracije.");
        }
    };

    return (
        <div className="page-wrapper">
        <div className="register-container">
            <h2>Registracija</h2>
            <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
                <div className="role-radio">
                    <label><input type="radio" name="role" value="korisnik" onChange={handleChange} required /> Korisnik</label>
                    <label><input type="radio" name="role" value="mentor" onChange={handleChange} /> Mentor</label>
                    <label><input type="radio" name="role" value="advokat" onChange={handleChange} /> Advokat</label>
                </div>

                <input type="text" name="firstName" placeholder="Ime" onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Prezime" onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Broj telefona" onChange={handleChange} required />
                <input type="date" name="birthDate" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Šifra" onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Potvrdi šifru" onChange={handleChange} required />
                <textarea name="bio" placeholder="Nešto više o sebi" onChange={handleChange} />

                <label>Fotografija: <input type="file" name="photo" accept="image/*" onChange={handleChange} /></label>

                {formData.role === "advokat" && (
                    <input type="text" name="licenseNumber" placeholder="Broj licence (npr. 13/12)" onChange={handleChange} required />
                )}

                {formData.role === "mentor" && (
                    <>
                        <input type="text" name="companyNames" placeholder="Naziv firme u kojoj radite" onChange={handleChange} required />
                        <input type="text" name="securityCode" placeholder="Sigurnosni kod" onChange={handleChange} required />
                    </>
                )}

                {error && <p className="error-msg">{error}</p>}

                <button type="submit">Registruj se</button>
            </form>
            </div>
        </div>
    );
};

export default Register;
