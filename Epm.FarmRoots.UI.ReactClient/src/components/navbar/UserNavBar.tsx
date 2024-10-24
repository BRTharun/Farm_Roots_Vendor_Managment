import React from "react";
import { Link } from "react-router-dom";

const UserNavBar: React.FC = () => {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/profile">Profile</Link>
            <button>Logout</button>
        </nav>
    );
};

export default UserNavBar;
