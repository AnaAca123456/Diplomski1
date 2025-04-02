import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    const fetchUser = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/auth/me", {
                withCredentials: true,
            });
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!loading && children} 
        </AuthContext.Provider>
    );
};

export default AuthProvider;
