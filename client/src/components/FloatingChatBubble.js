import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import "./../style/chatbubble.css";

const FloatingChatBubble = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        const fetchConversations = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/messages/conversations", {
                    withCredentials: true,
                });
                setConversations(res.data);
            } catch (err) {
                console.error("Greška u pristupu razgovora:", err);
            }
        };
        fetchConversations();
    }, [isOpen]);

    const filteredConversations = conversations.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
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
                                    <Link to={`/messages/${conv._id}`} onClick={() => setIsOpen(false)}>
                                        {conv.firstName} {conv.lastName}
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            <button className="chat-bubble-toggle" onClick={() => setIsOpen(!isOpen)}>
                💬
            </button>
        </div>
    );
};

export default FloatingChatBubble;