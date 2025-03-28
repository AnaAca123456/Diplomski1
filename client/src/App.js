import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ViewPost from "./pages/ViewPost";
import Messages from "./pages/Messages";
import AdminPanel from "./pages/AdminPanel";
import AllPosts from "./pages/AllPosts";
import ErrorPage from "./pages/ErrorPage";
import MyPosts from "./pages/MyPosts";
import Notifications from "./pages/Notifications";
import EditProfile from "./pages/EditProfile";
const App = () => {
    const { user } = useContext(AuthContext);

    const RequireAuth = ({ children }) => {
        return user ? children : <Navigate to="/login" />;
    };

    const RoleRoute = ({ allowedRoles, children }) => {
        return user && allowedRoles.includes(user.role) ? children : <Navigate to="/dashboard" />;
    };

    return (
        <Router>
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                    <Route path="/profile/:id" element={<RequireAuth><Profile /></RequireAuth>} />
                    <Route path="/posts" element={<RequireAuth><AllPosts /></RequireAuth>} />
                    <Route path="/posts/:id" element={<RequireAuth><ViewPost /></RequireAuth>} />
                    <Route path="/edit-post/:id" element={<RoleRoute allowedRoles={["korisnik"]}><EditPost /></RoleRoute>} />
                    <Route path="/create-post" element={<RoleRoute allowedRoles={["korisnik"]}><CreatePost /></RoleRoute>} />
                    <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
                    <Route path="/my-posts" element={<RequireAuth><MyPosts /></RequireAuth>} />
                    <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminPanel /></RoleRoute>} />
                    <Route path="*" element={<ErrorPage />} />
                    <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
                    <Route path="/messages/:id" element={<RequireAuth><Messages /></RequireAuth>} />
                    <Route path="/edit-profile" element={<EditProfile />} />

                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
