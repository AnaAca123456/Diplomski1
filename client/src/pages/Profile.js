import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./../style/profile.css";

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const isMyProfile = currentUser && currentUser._id === id;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    withCredentials: true,
                });
                setUser(res.data.user);
                setPosts(res.data.posts);
            } catch (err) {
                console.error("Greška pri učitavanju profila:", err);
            }
        };

        fetchProfile();
    }, [id]);

    if (!user) return <p>Učitavanje profila...</p>;

    return (
        <div className="page-wrapper">
        <div className="profile-container">
            <div className="profile-info">
                <img
                    src={
                        user.photo
                            ? `http://localhost:5000/uploads/${user.photo}`
                            : "/default-user.png"
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    className="profile-photo"
                />
                <h2>{user.firstName} {user.lastName}</h2>
                <p><strong>Uloga:</strong> {user.role}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Telefon:</strong> {user.phone}</p>
                <p><strong>Datum rođenja:</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
                <p><strong>O korisniku:</strong> {user.bio || "Nema opisa."}</p>

                {user.role === "advokat" && (
                    <p><strong>Broj licence:</strong> {user.licenseNumber}</p>
                )}

                {user.role === "mentor" && (
                    <p><strong>Firma/e:</strong> {user.companyNames}</p>
                )}

                {isMyProfile ? (
                    <Link to="/edit-profile" className="edit-profile-btn">✏️ Uredi profil</Link>
                ) : (
                    <Link to={`/messages/${user._id}`}>
                        <button className="message-button">Pošalji poruku</button>
                    </Link>
                )}
            </div>

            <div className="profile-posts">
                <h3>{isMyProfile ? "Moje poslovne ideje" : "Poslovne ideje korisnika:"}</h3>
                {posts.length === 0 ? (
                    <p>{isMyProfile ? "Niste još postavili nijednu ideju." : "Korisnik nije postavio nijednu ideju."}</p>
                ) : (
                        posts.map((post) => {
                            console.log("Post:", post); 

                            return (
                                <div key={post._id} className="profile-post">
                                    <h4>{post.title || post.companyName}</h4>
                                    <p>{post.type === "postojecePreduzece" ? post.companyName : post.ideaDescription.slice(0, 100)}...</p>
                                </div>
                            );
                        })
                )}
            </div>
            </div>
        </div>
    );
};

export default Profile;
