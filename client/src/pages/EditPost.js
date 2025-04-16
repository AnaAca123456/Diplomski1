import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./../style/post.css";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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
        companyName: "",
        companyDescription: "",
        location: "",
        website: "",
        contactPhone: "",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`, {
                    withCredentials: true,
                });
                const post = res.data.post;
                if (
                    !post.author ||
                    (typeof post.author === "string" && post.author !== user._id) ||
                    (typeof post.author === "object" && post.author._id !== user._id)
                ) {
                    navigate("/dashboard");
                }

                // Za uklanjanje neželjenih polja
                const {
                    _id, author, likes, comments, createdAt, updatedAt, __v, ...cleanPost
                } = post;

                setPostType(post.type);
                setFormData((prev) => ({ ...prev, ...cleanPost }));
            } catch (err) {
                console.error("Greška:", err);
                setError(err.response?.data?.message || "Ne možemo da učitamo post.");
            }
        };
        fetchPost();
    }, [id, user._id, navigate]);

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
            if (
                value !== undefined &&
                value !== null &&
                key !== "author" &&
                key !== "_id" &&
                key !== "likes" &&
                key !== "comments" &&
                key !== "createdAt" &&
                key !== "updatedAt" &&
                key !== "__v"
            ) {
                data.append(key, value);
            }
        });

        try {
            await axios.put(`http://localhost:5000/api/posts/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            navigate("/my-posts");
        } catch (err) {
            setError("Greška prilikom ažuriranja posta.");
        }
    };

    return (
        <div className="page-wrapper">
        <div className="post-form-container">
            <h2>Izmeni post</h2>

            <form onSubmit={handleSubmit} className="post-form" encType="multipart/form-data">
                {postType === "poslovnaIdeja" ? (
                    <>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Naziv poslovnog plana" required />
                        <textarea name="ideaDescription" value={formData.ideaDescription} onChange={handleChange} placeholder="Opis ideje" required />
                        <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Ciljna grupa" required />
                        <input type="text" name="competition" value={formData.competition} onChange={handleChange} placeholder="Konkurencija" required />
                        <input type="text" name="resources" value={formData.resources} onChange={handleChange} placeholder="Resursi" required />
                        <input type="text" name="incomeSource" value={formData.incomeSource} onChange={handleChange} placeholder="Izvor zarade" required />
                        <input type="text" name="promotion" value={formData.promotion} onChange={handleChange} placeholder="Način promovisanja" required />
                        <input type="text" name="salesStrategy" value={formData.salesStrategy} onChange={handleChange} placeholder="Strategija prodaje" required />
                        <input type="text" name="plannedCosts" value={formData.plannedCosts} onChange={handleChange} placeholder="Planirani troškovi" required />
                        <input type="text" name="incomeForecast" value={formData.incomeForecast} onChange={handleChange} placeholder="Prognoza prihoda" required />
                        <input type="text" name="timeline" value={formData.timeline} onChange={handleChange} placeholder="Vremenski rokovi" required />
                        <input type="text" name="employees" value={formData.employees} onChange={handleChange} placeholder="Broj zaposlenih" required />
                        <label>
                            Zameni fajl (opciono):
                            <input type="file" name="businessPlanFile" accept=".pdf" onChange={handleChange} />
                        </label>
                    </>
                ) : (
                    <>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Naziv firme" required />
                        <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Opis firme" required />
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Lokacija firme" required />
                        <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Kontakt telefon" required />
                        <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Web sajt (opciono)" />
                        <input type="text" name="employees" value={formData.employees} onChange={handleChange} placeholder="Broj zaposlenih" required />
                    </>
                )}

                {error && <p className="error-msg">{error}</p>}
                <button type="submit">Sačuvaj izmene</button>
            </form>
            </div>
        </div>
    );
};

export default EditPost;
