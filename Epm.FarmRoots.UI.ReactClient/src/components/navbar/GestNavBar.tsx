import React from "react";
import { Link } from "react-router-dom";

const GuestNavBar: React.FC = () => {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/sell">Sell</Link>
        </nav>
    );
};

export default GuestNavBar;
