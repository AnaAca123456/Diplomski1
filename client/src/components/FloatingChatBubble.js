import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./../style/chatbubble.css";
import { useNavigate } from "react-router-dom";

const FloatingChatBubble = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [search, setSearch] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isOpen) {
                    const res = await axios.get("http://localhost:5000/api/messages/conversations", {
                        withCredentials: true,
                    });
                    setConversations(res.data);
                }

                const notifRes = await axios.get("http://localhost:5000/api/notifications", {
                    withCredentials: true,
                });

                const unreadMessages = notifRes.data.filter(n => n.type === "message" && !n.isRead).length;
                setUnreadCount(unreadMessages);
            } catch (err) {
                console.error("Greška u pristupu razgovora ili notifikacijama:", err);
            }
        };

        fetchData();
    }, [isOpen]);

    const filteredConversations = conversations.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <div className="page-wrapper">
        <div className="chat-bubble-container">
            <div className={`chat-bubble-panel ${isOpen ? "open" : ""}`}>
                <h3>Poruke</h3>

                <div className="chat-section">
                    <input
                        type="text"
                        placeholder="Pretraga po imenu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <ul>
                        {filteredConversations.length === 0 ? (
                            <li>Nema rezultata</li>
                        ) : (
                            filteredConversations.map((conv) => (
                                <li key={conv._id}>
                                    <button
                                        onClick={() => {
                                            navigate(`/messages/${conv._id}`);
                                            setIsOpen(false);
                                        }}
                                        className="btn-conv"
                                    >
                                        {conv.firstName} {conv.lastName}
                                    </button>

                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            <button className="chat-bubble-toggle" onClick={() => setIsOpen(!isOpen)}>
                💬
                {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                )}
            </button>

            </div>
        </div>
    );
};

export default FloatingChatBubble;