import React from "react";
import { Link } from "react-router-dom";
import "./../style/profile.css";

const UserCard = ({ user }) => {
    return (
        <div className="page-wrapper">
        <div className="user-card">
            <img
                src={user.photo || "/default-user.png"}
                alt={`${user.firstName} ${user.lastName}`}
                className="user-photo"
            />
            <div className="user-info">
                <h4>
                    <Link to={`/profile/${user._id}`}>
                        {user.firstName} {user.lastName}
                    </Link>
                </h4>
                <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                <p>{user.email}</p>
            </div>
            </div>
        </div>
    );
};

export default UserCard;
