import React from "react";
import "./../style/footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h3>StartUp Guide</h3>
                <p>Platforma za razmenu poslovnih ideja i povezivanje korisnika.</p>
                <p>&copy; {new Date().getFullYear()} StartUp Guide. Sva prava zadržana.</p>
            </div>
        </footer>
    );
};

export default Footer;
