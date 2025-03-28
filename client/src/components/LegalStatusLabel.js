import React from "react";
import "./../style/post.css";

const LegalStatusLabel = ({ status }) => {
    if (status === "legal") {
        return <span className="legal-status legal">✔ Zakonito</span>;
    } else if (status === "illegal") {
        return <span className="legal-status illegal">❌ Nije zakonito</span>;
    } else {
        return <span className="legal-status neutral">Nije procenjeno</span>;
    }
};

export default LegalStatusLabel;
