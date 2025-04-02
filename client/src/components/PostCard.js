import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 
import "./../style/post.css";

const PostCard = ({ post, showEditButton = false }) => {
    const { user } = useContext(AuthContext);

    const isAuthor = user && (post.author === user._id || post.author._id === user._id);
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/posts/${post._id}`);
    };
    return (
        <div className="post-card clickable" onClick={handleCardClick}>
            <div className="post-header">
                <Link
                    to={`/profile/${post.author._id}`}
                    className="post-author"
                    onClick={(e) => e.stopPropagation()}
                >
                    {post.author.firstName} {post.author.lastName}
                </Link>
                <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                </span>
            </div>

            <h3 className="post-title">{post.title || post.companyName}</h3>
            <p className="post-description">
                {(post.ideaDescription || post.companyDescription || "").slice(0, 100)}...
            </p>

            <div className="post-footer">
                <div className="post-info">
                    <span>👍 {post.likes.length}</span>
                    <span>💬 {post.comments.length}</span>
                </div>
                {showEditButton && isAuthor && (
                    <Link
                        to={`/edit-post/${post._id}`}
                        className="edit-post-btn"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        ✏️ Izmeni
                    </Link>
                )}
            </div>
        </div>
    );
};
export default PostCard;
