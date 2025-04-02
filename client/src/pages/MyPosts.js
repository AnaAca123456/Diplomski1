import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import "./../style/post.css";

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
        <div className="my-posts-container">
            {posts.length === 0 ? (
                <p className="no-posts-msg">Još uvek nemaš nijedan post.</p>
            ) : (
                <div className="post-list">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} showEditButton={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPosts;
