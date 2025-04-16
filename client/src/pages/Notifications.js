import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./../style/notifications.css";

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState("comment");


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/notifications", {
                    withCredentials: true,
                });
                setNotifications(res.data);

                setTimeout(() => {
                    markAllAsRead();
                }, 2000);
            } catch (err) {
                console.error("Greška pri pristupu notifikacijama:", err);
            }
        };
        

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

        fetchNotifications();
    }, []);

    const filteredNotifications = notifications.filter(n => n.type === activeTab);

    const unreadCounts = {
        comment: notifications.filter(n => n.type === "comment" && !n.isRead).length,
        like: notifications.filter(n => n.type === "like" && !n.isRead).length,
        message: notifications.filter(n => n.type === "message" && !n.isRead).length,
    };
    return (
        <div className="page-wrapper">
        <div className="notifications-container">
            <h2>Obaveštenja</h2>

            <div className="notification-tabs">
                <button
                    onClick={() => setActiveTab("comment")}
                    className={activeTab === "comment" ? "active" : ""}
                >
                    💬 Komentari {unreadCounts.comment > 0 && <span className="notif-badge">{unreadCounts.comment}</span>}
                </button>

                <button
                    onClick={() => setActiveTab("like")}
                    className={activeTab === "like" ? "active" : ""}
                >
                    👍 Lajkovi {unreadCounts.like > 0 && <span className="notif-badge">{unreadCounts.like}</span>}
                </button>

                <button
                    onClick={() => setActiveTab("message")}
                    className={activeTab === "message" ? "active" : ""}
                >
                    📨 Poruke {unreadCounts.message > 0 && <span className="notif-badge">{unreadCounts.message}</span>}
                </button>
            </div>
           


            <ul>
                {filteredNotifications.length === 0 ? (
                    <p>Nema obaveštenja za ovu kategoriju.</p>
                ) : (
                    filteredNotifications.map((n) => (
                        <li key={n._id} className={n.isRead ? "" : "unread"}>
                            {n.type === "like" && n.sender && n.post && (
                                <p>👍 <strong>{n.sender.firstName}</strong>  <Link to={`/posts/${n.post._id}`}>{n.post.title}</Link></p>
                            )}

                            {n.type === "comment" && n.sender && n.post && (
                                <p>💬 <strong>{n.sender.firstName}</strong>  <Link to={`/posts/${n.post._id}`}>{n.post.title}</Link></p>
                            )}

                            {n.type === "message" && n.sender && (
                                <p>📨 <Link to={`/messages/${n.sender._id}`}>{n.sender.firstName}</Link></p>
                            )}
                        </li>
                    ))
                )}
            </ul>
            </div>
        </div>
    );
};

export default Notifications;
