import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./../style/messages.css";

const Messages = () => {
    const { id } = useParams(); // primaoc
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

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
            setMessages([...messages, { sender: user._id, text: newMessage }]);
            setNewMessage("");
        } catch (err) {
            console.error("Greška pri slanju poruke:", err);
        }
    };

    return (
        <div className="messages-container">
            <h2>Privatna poruka</h2>
            <div className="messages-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sender === user._id ? "message own" : "message"}
                    >
                        {msg.text}
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
