import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./../style/admin.css";

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (user?.role !== "admin") return;

        const fetchData = async () => {
            try {
                const userRes = await axios.get("http://localhost:5000/api/admin/users", {
                    withCredentials: true,
                });
                const postRes = await axios.get("http://localhost:5000/api/admin/posts", {
                    withCredentials: true,
                });
                const commentRes = await axios.get("http://localhost:5000/api/admin/comments", {
                    withCredentials: true,
                });

                setUsers(userRes.data);
                setPosts(postRes.data);
                setComments(commentRes.data);

            } catch (err) {
                console.error("Greška pri učitavanju:", err);
            }
        };

        fetchData();
    }, [user, refresh]);

    const deleteUser = async (id) => {
        if (id === user._id) return alert("Ne možete obrisati sami sebe.");
        if (window.confirm("Da li ste sigurni da želite da obrišete korisnika?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                    withCredentials: true,
                });
                setRefresh(!refresh);
            } catch (err) {
                alert("Greška prilikom brisanja korisnika.");
            }
        }
    };

    const deletePost = async (id) => {
        if (window.confirm("Obrisati post?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/posts/${id}`, {
                    withCredentials: true,
                });
                setRefresh(!refresh);
            } catch (err) {
                alert("Greška prilikom brisanja posta.");
            }
        }
    };
    const deleteComment = async (id) => {
        if (window.confirm("Obrisati komentar?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/comments/${id}`, {
                    withCredentials: true,
                });
                setRefresh(!refresh);
            } catch (err) {
                alert("Greška prilikom brisanja komentara.");
            }
        }
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>

            <div className="admin-section">
                <h3>Svi korisnici</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Email</th>
                            <th>Uloga</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.firstName} {u.lastName}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>
                                    {u._id !== user._id && (
                                        <button onClick={() => deleteUser(u._id)}>Obriši</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-section">
                <h3>Svi postovi</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Autor</th>
                            <th>Tip</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((p) => (
                            <tr key={p._id}>
                                <td>{p.title || p.companyName}</td>
                                <td>{p.author?.firstName} {p.author?.lastName}</td>
                                <td>{p.type}</td>
                                <td>
                                    <button onClick={() => deletePost(p._id)}>Obriši</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="admin-section">
                <h3>Svi komentari</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Autor</th>
                            <th>Tekst</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((c) => (
                            <tr key={c._id}>
                                <td>{c.author?.firstName} {c.author?.lastName}</td>
                                <td>{c.text}</td>
                                <td>
                                    <button onClick={() => deleteComment(c._id)}>Obriši</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminPanel;
