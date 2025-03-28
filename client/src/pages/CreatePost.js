import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./../style/createpost.css";

const CreatePost = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [postType, setPostType] = useState("poslovnaIdeja");
    const [formData, setFormData] = useState({
        title: "",
        ideaDescription: "",
        targetAudience: "",
        competition: "",
        resources: "",
        incomeSource: "",
        promotion: "",
        salesStrategy: "",
        plannedCosts: "",
        incomeForecast: "",
        timeline: "",
        employees: "",
        businessPlanFile: null,

        // za postojeće preduzeće
        companyName: "",
        companyDescription: "",
        location: "",
        website: "",
        contactPhone: "",
    });

    const [error, setError] = useState("");

    if (!user || user.role !== "korisnik") {
        return <p>Pristup dozvoljen samo korisnicima.</p>;
    }

    const handleChange = (e) => {
        if (e.target.name === "businessPlanFile") {
            setFormData({ ...formData, businessPlanFile: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("type", postType);
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });

        try {
            await axios.post("http://localhost:5000/api/posts", data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            navigate("/my-posts");
        } catch (err) {
            setError(err.response?.data?.message || "Greška prilikom kreiranja posta.");
        }
    };

    return (
        <div className="post-form-container">
            <h2>Kreiraj post</h2>

            <div className="post-type-selector">
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="poslovnaIdeja"
                        checked={postType === "poslovnaIdeja"}
                        onChange={(e) => setPostType(e.target.value)}
                    />
                    Poslovna ideja (plan za osnivanje)
                </label>
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="postojecePreduzece"
                        checked={postType === "postojecePreduzece"}
                        onChange={(e) => setPostType(e.target.value)}
                    />
                    Već postojeće preduzeće
                </label>
            </div>

            <form onSubmit={handleSubmit} className="post-form" encType="multipart/form-data">
                {postType === "poslovnaIdeja" ? (
                    <>
                        <input type="text" name="title" placeholder="Naziv poslovnog plana" onChange={handleChange} required />
                        <textarea name="ideaDescription" placeholder="Opis ideje" onChange={handleChange} required />
                        <input type="text" name="targetAudience" placeholder="Ciljna grupa" onChange={handleChange} required />
                        <input type="text" name="competition" placeholder="Konkurencija" onChange={handleChange} required />
                        <input type="text" name="resources" placeholder="Resursi" onChange={handleChange} required />
                        <input type="text" name="incomeSource" placeholder="Izvor zarade" onChange={handleChange} required />
                        <input type="text" name="promotion" placeholder="Način promovisanja" onChange={handleChange} required />
                        <input type="text" name="salesStrategy" placeholder="Strategija prodaje" onChange={handleChange} required />
                        <input type="text" name="plannedCosts" placeholder="Planirani troškovi" onChange={handleChange} required />
                        <input type="text" name="incomeForecast" placeholder="Prognoza prihoda" onChange={handleChange} required />
                        <input type="text" name="timeline" placeholder="Vremenski rokovi" onChange={handleChange} required />
                        <input type="text" name="employees" placeholder="Broj zaposlenih" onChange={handleChange} required />
                        <label>
                            Biznis plan (PDF):
                            <input type="file" name="businessPlanFile" accept=".pdf" onChange={handleChange} />
                        </label>
                    </>
                ) : (
                    <>
                        <input type="text" name="companyName" placeholder="Naziv firme" onChange={handleChange} required />
                        <textarea name="companyDescription" placeholder="Opis firme / delatnost" onChange={handleChange} required />
                        <input type="text" name="location" placeholder="Lokacija firme" onChange={handleChange} required />
                        <input type="text" name="contactPhone" placeholder="Kontakt telefon" onChange={handleChange} required />
                        <input type="text" name="website" placeholder="Web sajt (opciono)" onChange={handleChange} />
                        <input type="text" name="employees" placeholder="Broj zaposlenih" onChange={handleChange} required />
                    </>
                )}

                {error && <p className="error-msg">{error}</p>}
                <button type="submit">Objavi</button>
            </form>
        </div>
    );
};

export default CreatePost;
