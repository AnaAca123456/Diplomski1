import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./../style/navbar.css";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [notificationCount, setNotificationCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const showBackButton =
        location.pathname !== "/" &&
        location.pathname !== "/dashboard" &&
        location.pathname !== "/login" &&
        location.pathname !== "/register";

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

    useEffect(() => {
        if (location.pathname === "/notifications") {
            setNotificationCount(0);
        }
    }, [location.pathname]);

    const showLink = (path) => location.pathname !== path && location.pathname !== "/dashboard";

    return (
        <div className="page-wrapper">
            <nav className="navbar">
                <div className="navbar-logo-wrapper">
                    <Link to="/dashboard" className="navbar-logo">
                        <img
                            src="/s.png"
                            alt="StartUp Guide Logo"
                            className="navbar-logo-img"
                        />
                    </Link>

                    <div className="navbar-hamburger">
                        <button onClick={() => setDropdownOpen(prev => !prev)}>☰</button>
                        {dropdownOpen && (
                            <div className="navbar-dropdown">
                                <button onClick={() => window.open("https://preduzetnistvo.gov.rs/programi-podrske/", "_blank")}>→ Podrška</button>
                                <button onClick={() => window.open("https://privreda.gov.rs/aktuelno/vesti-i-saopstenja", "_blank")}>→ Vesti</button>
                                <button onClick={() => window.open("https://privreda.gov.rs/dokumenta/javne-nabavke", "_blank")}>→ Javne nabavke</button>
                                <button onClick={() => window.open("https://privreda.gov.rs/usluge/javni-pozivi", "_blank")}>→ Javni pozivi</button>
                            </div>

                        )}
                    </div>
                </div>

                {showBackButton && (
                    <button className="back-btn" onClick={() => navigate(-1)} title="Nazad">
                        ←
                    </button>
                )}

                <ul className="navbar-links">
                    {user ? (
                        <>
                            {showLink("/dashboard") && (
                                <li><Link to="/dashboard">🏠 Početna</Link></li>
                            )}
                            {showLink(`/profile/${user._id}`) && (
                                <li><Link to={`/profile/${user._id}`}>👤 Profil</Link></li>
                            )}

                            {user.role === "korisnik" && (
                                <>
                                    {showLink("/create-post") && <li><Link to="/create-post">💡 Nova ideja</Link></li>}
                                    {showLink("/my-posts") && <li><Link to="/my-posts">📁 Moje ideje</Link></li>}
                                    {showLink("/posts") && <li><Link to="/posts">🌐 Sve ideje</Link></li>}
                                </>
                            )}

                            {user.role === "mentor" && showLink("/posts") && (
                                <li><Link to="/posts">📚 Sve ideje</Link></li>
                            )}

                            {user.role === "advokat" && showLink("/posts") && (
                                <li><Link to="/posts">⚖️ Sve ideje</Link></li>
                            )}

                            {user.role === "admin" && showLink("/admin") && (
                                <li><Link to="/admin">🛠️ Admin panel</Link></li>
                            )}

                            <li>
                                <Link to="/notifications" className="nav-icon">
                                    🔔 {notificationCount > 0 && <span className="notif-count">{notificationCount}</span>}
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="logout-btn">
                                    🚪 Odjavi se
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
                            <li><Link to="/login">🔐 Prijava</Link></li>
                            <li><Link to="/register">📝 Registracija</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
