import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./../style/editprofile.css";

const EditProfile = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        bio: user?.bio || "",
        password: "",
        confirmPassword: ""
    });

    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Šifre se ne poklapaju.");
            setMessage("");
            return;
        }

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) data.append(key, value);
            });
            if (photo) data.append("photo", photo);

            const res = await axios.put("http://localhost:5000/api/users/update", data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage(" Profil uspešno ažuriran!");
            setError("");
            login(res.data.updatedUser || res.data.user); 

            setTimeout(() => {
                if (user?._id) {
                    navigate(`/profile/${user._id}`);
                }
            }, 1500);
        } catch (err) {
            console.error("Greška pri ažuriranju profila:", err);
            setError("Greška pri ažuriranju profila.");
            setMessage("");
        }
    };

    return (
        <div className="page-wrapper">
        <div className="edit-profile-container">
            <h2>Ažuriraj profil</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form" encType="multipart/form-data">
                <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ime" />
                <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Prezime" />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" />
                <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Nešto više o tebi" />

                <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nova šifra (opciono)"
                />

                <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Potvrdi novu šifru"
                />

                <button type="submit">Sačuvaj izmene</button>
            </form>

            {message && <p className="message-info">{message}</p>}
            {error && <p className="message-error">{error}</p>}
            </div>
        </div>
    );
};

export default EditProfile;
