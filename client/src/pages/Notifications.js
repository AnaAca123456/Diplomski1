import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/notifications", {
                    withCredentials: true,
                });
                setNotifications(res.data);
            } catch (err) {
                console.error("Greška pri pristupu notifikacijama:", err);
            }
        };

        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            await axios.put("http://localhost:5000/api/notifications/mark-read", {}, {
                withCredentials: true,
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Greška pri označavanju kao pročitano:", err);
        }
    };

    return (
        <div className="notifications-container">
            <h2>Obaveštenja</h2>
            <button onClick={markAllAsRead}>Označi sve kao pročitano</button>
            <ul>
                {notifications.length === 0 ? (
                    <p>Nema novih obaveštenja.</p>
                ) : (
                    notifications.map((n) => (
                        <li key={n._id} style={{ backgroundColor: n.isRead ? "#eee" : "#cde" }}>
                            {n.type === "like" && (
                                <p>👍 <strong>{n.sender.firstName}</strong> je lajkovao tvoju ideju: <Link to={`/posts/${n.post._id}`}>{n.post.title}</Link></p>
                            )}
                            {n.type === "comment" && (
                                <p>💬 <strong>{n.sender.firstName}</strong> je komentarisao tvoju ideju: <Link to={`/posts/${n.post._id}`}>{n.post.title}</Link></p>
                            )}
                            {n.type === "message" && (
                                <p>📨 Nova poruka od <Link to={`/messages/${n.sender._id}`}>{n.sender.firstName}</Link></p>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Notifications;
