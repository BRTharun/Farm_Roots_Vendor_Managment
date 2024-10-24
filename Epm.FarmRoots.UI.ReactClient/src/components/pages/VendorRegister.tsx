import React, { useState } from "react";
import { useDispatch } from "react-redux";
//import { registerUser } from "../utils/userSlice";
import { AppDispatch } from "../utils/store";
import { registerVendor } from "../utils/vendorSlice";
import { useNavigate } from "react-router-dom";

const VendorRegister: React.FC = () => {
    const [companyName, setCompanyName] = useState("");
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(
            registerVendor({ companyName, contactName, email, password, phone })
        );
        navigate('/');
    };

    return (
        <div>
            <h1>Vendor Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company Name"
                    required
                />
                <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact Name"
                    required
                />
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
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone No"
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default VendorRegister;
