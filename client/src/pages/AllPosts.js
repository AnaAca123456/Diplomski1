import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import "./../style/post.css";

const AllPosts = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/posts", {
                    withCredentials: true,
                });
                setPosts(res.data);
            } catch (err) {
                console.error("Greška pri učitavanju postova:", err);
            }
        };
        fetchAllPosts();
    }, []);

    const filteredPosts = posts.filter((post) => {
        const naziv = post.title || post.companyName || "";
        const matchesSearch = naziv.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || post.legalStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="page-wrapper">
        <div className="posts-page">
            <div className="search-and-filter">
                <input
                    type="text"
                    placeholder="Pretraži po nazivu..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="filter-options">
                    <label>
                        <input
                            type="radio"
                            name="legalStatus"
                            value="all"
                            checked={filterStatus === "all"}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        />
                        Sve
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="legalStatus"
                            value="legal"
                            checked={filterStatus === "legal"}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        />
                        ✅ Prihvatljivo
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="legalStatus"
                            value="illegal"
                            checked={filterStatus === "illegal"}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        />
                        ❌ Neprihvatljivo
                    </label>
                </div>
            </div>



            {filteredPosts.length === 0 ? (
                <p>Nema postova koji odgovaraju pretrazi.</p>
            ) : (
                <div className="post-list">
                    {filteredPosts.map((post) => (
                        <PostCard key={post._id} post={post} user={user} />
                    ))}
                </div>
            )}
            </div>
        </div>
    );
};

export default AllPosts;
