// src/components/VendorPage.tsx
import React from "react";
import { Link } from "react-router-dom";

const VendorPage: React.FC = () => {
    return (
        <div>
            <h1>Vendor Page</h1>
            <Link to="/login">Vendor Login</Link>
            <Link to="/register">Vendor Register</Link>
        </div>
    );
};

export default VendorPage;
