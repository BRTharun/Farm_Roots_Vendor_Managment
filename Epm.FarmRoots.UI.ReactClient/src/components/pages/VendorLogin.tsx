import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../utils/store"; // Adjust the path
import { loginVendor } from "../utils/vendorSlice";
import { useNavigate } from "react-router-dom";

const VendorLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginVendor({ email, password }));
        navigate('/')
    };

    return (
        <div>
            <h1>Vendor Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default VendorLogin;
