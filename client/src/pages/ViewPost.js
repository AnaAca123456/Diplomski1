import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import LegalStatusLabel from "../components/LegalStatusLabel";
import "./../style/post.css";
import { Link } from "react-router-dom"; 


const ViewPost = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`, {
                    withCredentials: true,
                });
                setPost(res.data.post);
                setLiked(res.data.post.likes.includes(user?._id));
            } catch (err) {
                console.error("Greška prilikom učitavanja posta:", err);
            }
        };
        fetchPost();
    }, [id, user?._id]);

    const handleLikeToggle = async () => {
        try {
            await axios.post(`http://localhost:5000/api/likes/${id}/like`, {}, { withCredentials: true });
            setLiked(!liked);
            setPost((prev) => ({
                ...prev,
                likes: liked
                    ? prev.likes.filter((uid) => uid !== user._id)
                    : [...prev.likes, user._id],
            }));
        } catch (err) {
            console.error("Greška kod lajka:", err);
        }
    };

    const handleAddComment = async (text) => {
        try {
            const res = await axios.post(
                `http://localhost:5000/api/comments/${id}/comments`,
                { text },
                { withCredentials: true }
            );
            setPost((prev) => ({
                ...prev,
                comments: [...prev.comments, res.data.comment],
            }));
        } catch (err) {
            console.error("Greška kod komentara:", err);
        }
    };

    const handleLegalStatus = async (status) => {
        try {
            const endpoint = status === "legal" ? "legal" : "illegal";
            await axios.post(`http://localhost:5000/api/posts/${id}/${endpoint}`, {}, {
                withCredentials: true,
            });
            setPost((prev) => ({ ...prev, legalStatus: status }));
        } catch (err) {
            console.error("Greška kod pravnog statusa:", err);
        }
    };
    const alreadyRated = post?.ratings?.some(r => r.user === user?._id);


    const handleRating = async (value) => {
        try {
            await axios.post(
                `http://localhost:5000/api/posts/${id}/rate`,
                { value },
                { withCredentials: true }
            );
            alert("Uspešno ocenjen post!");
            setPost((prev) => ({
                ...prev,
                ratings: [...(prev.ratings || []), { value }]
            }));
        } catch (err) {
            console.error("Greška pri ocenjivanju:", err);
            alert("Došlo je do greške.");
        }
    };

    if (!post) return <p>Učitavanje...</p>;

    const averageRating =
        post?.ratings?.length > 0
            ? (post.ratings.reduce((acc, r) => acc + r.value, 0) / post.ratings.length).toFixed(1)
            : "Nema ocena";

    return (
        <div className="page-wrapper">
        <div className="view-post">
           <h2>{post.title || post.companyName}</h2>
            <p className="post-author">
                Autor: <Link to={`/profile/${post.author._id}`}>
                    {post.author.firstName} {post.author.lastName}
                </Link>
            </p>
            <LegalStatusLabel status={post.legalStatus} />

            {post.type === "poslovnaIdeja" ? (
                <div className="post-details">
                    <p><strong>Opis ideje:</strong> {post.ideaDescription}</p>
                    <p><strong>Ciljna grupa:</strong> {post.targetAudience}</p>
                    <p><strong>Konkurencija:</strong> {post.competition}</p>
                    <p><strong>Resursi:</strong> {post.resources}</p>
                    <p><strong>Izvor zarade:</strong> {post.incomeSource}</p>
                    <p><strong>Promovisanje:</strong> {post.promotion}</p>
                    <p><strong>Strategija prodaje:</strong> {post.salesStrategy}</p>
                    <p><strong>Planirani troškovi:</strong> {post.plannedCosts}</p>
                    <p><strong>Prognoza prihoda:</strong> {post.incomeForecast}</p>
                    <p><strong>Rokovi:</strong> {post.timeline}</p>
                    <p><strong>Broj zaposlenih:</strong> {post.employees}</p>
                    {post.businessPlanFile && (
                        <p>
                            <strong>Biznis plan (PDF):</strong>{" "}
                            <a href={`http://localhost:5000/uploads/${post.businessPlanFile}`} target="_blank" rel="noreferrer">
                                Preuzmi fajl
                            </a>
                        </p>
                    )}
                </div>
            ) : (
                <div className="post-details">
                    <p><strong>Naziv firme:</strong> {post.companyName}</p>
                    <p><strong>Opis firme:</strong> {post.companyDescription}</p>
                    <p><strong>Lokacija:</strong> {post.location}</p>
                    <p><strong>Kontakt telefon:</strong> {post.contactPhone}</p>
                    {post.website && <p><strong>Web sajt:</strong> <a href={post.website} target="_blank" rel="noreferrer">{post.website}</a></p>}
                    <p><strong>Broj zaposlenih:</strong> {post.employees}</p>
                </div>
            )}
            {user?.role === "mentor" && !alreadyRated && (
                <div className="rating-section">
                    <p><strong>Ocenite ovaj post:</strong></p>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => handleRating(star)}>
                            {star} ⭐
                        </button>
                    ))}
                </div>
            )}

            {user?.role === "mentor" && alreadyRated && (
                <p><strong>Već ste ocenili ovaj post.</strong></p>
            )}

            <p><strong>⭐ Prosečna ocena:</strong> {averageRating}</p>
            <LikeButton
                liked={liked}
                totalLikes={post.likes.length}
                onLikeToggle={handleLikeToggle}
            />

            <CommentSection
                comments={post.comments}
                onAddComment={handleAddComment}
                currentUser={user}
            />

            {user?.role === "advokat" && (
                <div className="legal-review">
                    <p><strong>Označi pravni status:</strong></p>
                    <button onClick={() => handleLegalStatus("legal")}>✅ Prihvatljivo</button>
                    <button onClick={() => handleLegalStatus("illegal")}>❌ Neprihvatljivo</button>
                </div>
            )}

           
            </div>
        </div>
    );
};

export default ViewPost;
