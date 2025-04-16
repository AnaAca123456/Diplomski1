import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../style/post.css";

const CommentSection = ({ comments, onAddComment, currentUser }) => {
    const [newComment, setNewComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;
        onAddComment(newComment);
        setNewComment("");
    };

    return (
        <div className="page-wrapper">
        <div className="comment-section">
            <h4>Komentari</h4>

            <div className="comment-list">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                            <Link to={`/profile/${comment.author._id}`} className="comment-author">
                                {comment.author.firstName} {comment.author.lastName}
                            </Link>
                            <p>{comment.text}</p>
                            <span className="comment-date">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <p>Još uvek nema komentara.</p>
                )}
            </div>

            {currentUser && (
                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Napi�i komentar..."
                    />
                    <button type="submit">Dodaj komentar</button>
                </form>
            )}
            </div>
        </div>
    );
};

export default CommentSection;
