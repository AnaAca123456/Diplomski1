import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./../style/navbar.css";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        let interval;
        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/notifications", {
                    withCredentials: true,
                });
                const unread = res.data.filter(n => !n.isRead);
                setNotificationCount(unread.length);
            } catch (err) {
                console.error("Greška u pristupu notifikacija:", err);
            }
        };

        if (user) {
            fetchNotifications(); 
            interval = setInterval(fetchNotifications, 30000); 
        }

        return () => clearInterval(interval); 
    }, [user]);

    return (
        <nav className="navbar">
            <div className="navbar-logo">
         

                <Link to="/">
                    <img
                        src="/sgg.png"  
                        alt="StartUp Guide Logo"
                        className="navbar-logo-img"
                    />
                </Link>
            </div>
            <ul className="navbar-links">
                {user ? (
                    <>
                        <li>
                            <Link to="/dashboard">Početna</Link>
                        </li>
                        <li>
                            <Link to={`/profile/${user._id}`}>Profil</Link>
                        </li>
                        <li>
                            <Link to="/notifications" className="nav-icon">
                                🔔 {notificationCount > 0 && <span className="notif-count">{notificationCount}</span>}
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="logout-btn">
                                Odjavi se
                            </button>
                        </li>
                        <button className="theme-toggle" onClick={() => {
                            document.body.classList.toggle("dark-mode");
                        }}>
                            🌙 / ☀️
                        </button>
                    </>

                   
                ) : (
                    <>
                        <li>
                            <Link to="/login">Prijava</Link>
                        </li>
                        <li>
                            <Link to="/register">Registracija</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
