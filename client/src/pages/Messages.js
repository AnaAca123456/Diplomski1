import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./../style/messages.css";

const Messages = () => {
    const { id } = useParams(); 
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [partner, setPartner] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/messages/${id}`, {
                    withCredentials: true,
                });
                setMessages(res.data);
                markNotificationsAsRead();
            } catch (err) {
                console.error("Greška pri dohvatanju poruka:", err);
            }
        };
        const fetchPartner = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    withCredentials: true,
                });
                setPartner(res.data.user);
            } catch (err) {
                console.error("Greška pri dohvatanju korisnika:", err);
            }
        };

        const markNotificationsAsRead = async () => {
            try {
                await axios.put("http://localhost:5000/api/notifications/read", {}, {
                    withCredentials: true,
                });
            } catch (err) {
                console.error("Greška pri označavanju notifikacija kao pročitanih:", err);
            }
        };


        fetchMessages();
        fetchPartner(); 
    }, [id]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post(
                `http://localhost:5000/api/messages`,
                {
                    receiver: id,
                    content: newMessage,
                },
                { withCredentials: true }
            );
            setMessages([...messages, { sender: user._id, text: newMessage, createdAt: new Date() }]);
            setNewMessage("");
        } catch (err) {
            console.error("Greška pri slanju poruke:", err);
        }
    };

    return (
        <div className="messages-container">
            {partner && (
                <div className="message-partner-info">
                    <img
                        src={
                            partner.photo
                                ? `http://localhost:5000/uploads/${partner.photo}`
                                : "/default-user.png"
                        }
                        alt={partner.firstName}
                        className="message-partner-img"
                    />
                    <span className="message-partner-name">
                        {partner.firstName} {partner.lastName}
                    </span>
                </div>
            )}
            <div className="messages-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sender === user._id ? "message own" : "message"}
                    >
                        <div className="message-text">{msg.text}</div>
                        <div className="message-time">
                            {new Date(msg.createdAt).toLocaleString("sr-RS", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Unesi poruku..."
                />
                <button
                    onClick={handleSend}
                    style={{ backgroundColor: "white", color: "black", border: "1px solid black", padding: "8px 16px", borderRadius: "6px" }}
                >
                    Pošalji
                </button>

            </div>
        </div>
    );
};

export default Messages;
