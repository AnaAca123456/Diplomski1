import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./../style/dashboard.css";
import FloatingChatBubble from "../components/FloatingChatBubble";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) return null;

    const goToCreatePost = () => navigate("/create-post");
    const goToMyPosts = () => navigate("/my-posts");
    const goToAllPosts = () => navigate("/posts");
    const goToAdminPanel = () => navigate("/admin");

    return (
        <div className="dashboard-container">
            <h2>Dobrodošao/la, {user.firstName}!</h2>
            <p>Uloga: <strong>{user.role.toUpperCase()}</strong></p>

            <div className="dashboard-actions">
                {user.role === "korisnik" && (
                    <>
                        <button onClick={goToCreatePost}>Kreiraj poslovnu ideju</button>
                        <button onClick={goToMyPosts}>Moje ideje</button>
                        <button onClick={goToAllPosts}>Pogledaj sve ideje</button>
                    </>
                )}

                {user.role === "mentor" && (
                    <>
                        <button onClick={goToAllPosts}>Pogledaj sve ideje</button>
                    </>
                )}

                {user.role === "advokat" && (
                    <>
                        <button onClick={goToAllPosts}>Pregledaj sve ideje</button>
                    </>
                )}

                {user.role === "admin" && (
                    <>
                        <button onClick={goToAdminPanel}>Upravljanje korisnicima i postovima</button>
                    </>
                )}
            </div>
            <FloatingChatBubble />
        </div>

    );
};

export default Dashboard;
