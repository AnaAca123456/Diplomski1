import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./../style/admin.css";

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState("users");
    const [refresh, setRefresh] = useState(false);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState("");

    const [editingPostId, setEditingPostId] = useState(null);
    const [editedPost, setEditedPost] = useState({});

    const [editingUserId, setEditingUserId] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    const handlePostInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPost((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (user?.role !== "admin") return;
      
        const fetchData = async () => {
            try {
                const [userRes, postRes, commentRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/admin/users", { withCredentials: true }),
                    axios.get("http://localhost:5000/api/admin/posts", { withCredentials: true }),
                    axios.get("http://localhost:5000/api/admin/comments", { withCredentials: true }),
                ]);
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
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { withCredentials: true });
                setRefresh(!refresh);
            } catch {
                alert("Greška prilikom brisanja korisnika.");
            }
        }
    };
    const updateUserPassword = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}`, {
                password: newPassword
            }, { withCredentials: true });

            alert("Lozinka uspešno ažurirana.");
            setEditingUserId(null);
            setNewPassword("");
            setRefresh(!refresh);
        } catch {
            alert("Greška prilikom ažuriranja lozinke.");
        }
    };

    const deletePost = async (id) => {
        if (window.confirm("Obrisati post?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/posts/${id}`, { withCredentials: true });
                setRefresh(!refresh);
            } catch {
                alert("Greška prilikom brisanja posta.");
            }
        }
    };

    const deleteComment = async (id) => {
        if (window.confirm("Obrisati komentar?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/comments/${id}`, { withCredentials: true });
                setRefresh(!refresh);
            } catch {
                alert("Greška prilikom brisanja komentara.");
            }
        }
    };

    const updateComment = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/comments/${id}`, { text: editedComment }, { withCredentials: true });
            setEditingCommentId(null);
            setEditedComment("");
            setRefresh(!refresh);
        } catch {
            alert("Greška prilikom izmene komentara.");
        }
    };

    const updatePost = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/posts/${id}`, editedPost, {
                withCredentials: true,
            });
            setEditingPostId(null);
            setRefresh(!refresh);
        } catch (err) {
            alert("Greška pri ažuriranju posta.");
        }
    };

    const renderUsers = () => (
        <div className="admin-section">
            <h3>Svi korisnici</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Email</th>
                        <th>Uloga</th>
                        <th>Nova lozinka</th>
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
                                {editingUserId === u._id ? (
                                    <input
                                        type="text"
                                        placeholder="Nova lozinka"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                ) : (
                                    <em>---</em>
                                )}
                            </td>
                            <td>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                    <Link to={`/profile/${u._id}`} className="view-link">👁️ Profil</Link>

                                    {u._id !== user._id && (
                                        <>
                                            {editingUserId === u._id ? (
                                                <>
                                                    <button className="save-btn" onClick={() => updateUserPassword(u._id)}>💾</button>
                                                    <button className="cancel-btn" onClick={() => {
                                                        setEditingUserId(null);
                                                        setNewPassword("");
                                                    }}>❌</button>
                                                </>
                                            ) : (
                                                <button onClick={() => setEditingUserId(u._id)}>✏️ Izmeni lozinku</button>
                                            )}

                                            <button className="delete-btn" onClick={() => deleteUser(u._id)}>🗑️ Obriši</button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );


    const renderPosts = () => (
        <div className="admin-section">
            <h3>Svi postovi</h3>
            <table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Opis</th>
                        <th>Troškovi</th>
                        <th>Rok</th>
                        <th>Autor</th>
                        <th>Tip</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((p) => (
                        <tr key={p._id}>
                            {editingPostId === p._id ? (
                                <>
                                    <td>
                                        <input
                                            value={editedPost.title}
                                            name="title"
                                            onChange={handlePostInputChange}
                                            className="admin-input"
                                        />
                                    </td>
                                    <td>
                                        <textarea
                                            value={editedPost.ideaDescription}
                                            name="ideaDescription"
                                            onChange={handlePostInputChange}
                                            className="admin-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={editedPost.plannedCosts}
                                            name="plannedCosts"
                                            onChange={handlePostInputChange}
                                            className="admin-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={editedPost.timeline}
                                            name="timeline"
                                            onChange={handlePostInputChange}
                                            className="admin-input"
                                        />
                                    </td>
                                    <td>
                                        <Link to={`/profile/${p.author?._id}`}>
                                            {p.author?.firstName} {p.author?.lastName}
                                        </Link>
                                    </td>

                                    <td>{p.type}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                            <button className="save-btn" onClick={() => updatePost(p._id)}>💾 Sačuvaj</button>
                                            <button className="cancel-btn" onClick={() => setEditingPostId(null)}>❌Otkaži</button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{p.title || p.companyName}</td>
                                    <td>{p.ideaDescription?.slice(0, 50)}...</td>
                                    <td>{p.plannedCosts}</td>
                                    <td>{p.timeline}</td>
                                    <td>{p.author?.firstName} {p.author?.lastName}</td>
                                    <td>{p.type}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                            <Link to={`/posts/${p._id}`} className="view-link">👁️ Pregled</Link>
                                            <button onClick={() => {
                                                setEditingPostId(p._id);
                                                setEditedPost({
                                                    title: p.title || "",
                                                    ideaDescription: p.ideaDescription || "",
                                                    plannedCosts: p.plannedCosts || "",
                                                    timeline: p.timeline || ""
                                                });
                                            }}>✏️ Izmeni</button>
                                            <button onClick={() => deletePost(p._id)}>🗑️ Obriši</button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

   

    const renderComments = () => (
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
                            <td>
                                {editingCommentId === c._id ? (
                                    <input value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
                                ) : (
                                    c.text
                                )}
                            </td>
                            <td>
                                {editingCommentId === c._id ? (
                                    <>
                                        <button onClick={() => updateComment(c._id)}>💾 Sačuvaj</button>
                                        <button onClick={() => setEditingCommentId(null)}>❌ Otkaži</button>
                                    </>
                                ) : (
                                        <>
                                            {c.post && (
                                                <Link to={`/posts/${c.post}`} className="view-link">🔍 Pregled</Link>
                                            )}
                                        <button onClick={() => { setEditingCommentId(c._id); setEditedComment(c.text); }}>✏️ Izmeni</button>
                                        <button onClick={() => deleteComment(c._id)}>🗑️ Obriši</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );


    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>

            <div className="admin-tabs">
                <button onClick={() => setActiveTab("users")}>👥 Korisnici</button>
                <button onClick={() => setActiveTab("posts")}>📝 Postovi</button>
                <button onClick={() => setActiveTab("comments")}>💬 Komentari</button>
            </div>

            {activeTab === "users" && renderUsers()}
            {activeTab === "posts" && renderPosts()}
            {activeTab === "comments" && renderComments()}
        </div>
    );
};

export default AdminPanel;
