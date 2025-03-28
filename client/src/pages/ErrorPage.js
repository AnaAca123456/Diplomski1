import React from "react";
import { Link } from "react-router-dom";
import "./../style/error.css";

const ErrorPage = () => {
    return (
        <div className="error-page">
            <h1>404</h1>
            <h2>Stranica nije pronađena</h2>
            <p>Ups! Izgleda da stranica koju tražiš ne postoji ili je premestena.</p>
            <Link to="/" className="back-home">Vrati se na početnu</Link>
        </div>
    );
};

export default ErrorPage;
