import React from "react";
import "./../style/post.css";

const LikeButton = ({ liked, onLikeToggle, totalLikes }) => {
    return (
        <button
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={onLikeToggle}
            title={liked ? "Ukloni lajk" : "Lajkuj"}
        >
            {liked ? "💙" : "🤍"} {totalLikes}
        </button>
    );
};

export default LikeButton;
