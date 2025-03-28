import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

const MyPosts = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${user._id}`, {
                    withCredentials: true,
                });

                setPosts(res.data.posts);
            } catch (err) {
                console.error("Greška pri pristupu postova:", err);
            }
        };

        fetchPosts();
    }, [user]);

    return (
        <div className="dashboard">
            <h2>Moji postovi</h2>
            {posts.length === 0 ? (
                <p>Još uvek nemaš nijedan post.</p>
            ) : (
                    posts.map((post) => <PostCard key={post._id} post={post} showEditButton={true} />)
            )}
        </div>
    );
};

export default MyPosts;
