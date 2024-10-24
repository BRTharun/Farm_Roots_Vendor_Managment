import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faBars,
    faTimes,
    faStore,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false); // Start with sidebar closed on mobile

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative z-50">
            {/* Toggle Button for Mobile */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 focus:outline-none text-white"
            >
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>

            <div
                className={`fixed top-0 left-0 h-screen p-4 bg-gray-800 text-white transition-all duration-300 ease-in-out transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } ${isOpen ? "w-64" : "w-64"} md:translate-x-0 md:w-60`}
            >
                <div className="flex items-center justify-between">
                    <h1
                        className={`text-2xl font-bold ${
                            !isOpen && "hidden"
                        } md:block`}
                    >
                        Dashboard
                    </h1>
                    <button
                        onClick={toggleSidebar}
                        className="focus:outline-none md:hidden"
                    >
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>
                <nav className="mt-10">
                    <div className="flex flex-col">
                        {/* <Link
                            to="/"
                            className="flex items-center p-2 mb-4 hover:bg-gray-700 rounded-md"
                        >
                            <FontAwesomeIcon
                                icon={faStore}
                                className="mr-3"
                                size="lg"
                            />
                            <span className={`${!isOpen && "hidden"} md:block`}>
                                Home
                            </span>
                        </Link> */}
                        <Link
                            to="/add-product"
                            className="flex items-center p-2 mb-4 hover:bg-gray-700 rounded-md"
                        >
                            <FontAwesomeIcon
                                icon={faStore}
                                className="mr-3"
                                size="lg"
                            />
                            <span className={`${!isOpen && "hidden"} md:block`}>
                                Add Product
                            </span>
                        </Link>
                        <Link
                            to="/category"
                            className="flex items-center p-2 mb-4 hover:bg-gray-700 rounded-md"
                        >
                            <FontAwesomeIcon
                                icon={faStore}
                                className="mr-3"
                                size="lg"
                            />
                            <span className={`${!isOpen && "hidden"} md:block`}>
                                Category's
                            </span>
                        </Link>
                        <Link
                            to="/my-products"
                            className="flex items-center p-2 mb-4 hover:bg-gray-700 rounded-md"
                        >
                            <FontAwesomeIcon
                                icon={faStore}
                                className="mr-3"
                                size="lg"
                            />
                            <span className={`${!isOpen && "hidden"} md:block`}>
                                My Products
                            </span>
                        </Link>
                        <Link
                            to="/manufacturers"
                            className="flex items-center p-2 mb-4 hover:bg-gray-700 rounded-md"
                        >
                            <FontAwesomeIcon
                                icon={faStore}
                                className="mr-3"
                                size="lg"
                            />
                            <span className={`${!isOpen && "hidden"} md:block`}>
                                Manufacturer's
                            </span>
                        </Link>
                        <Link
                            to="/vendor-profile"
                            className="flex items-center p-2 mb-4 hover:bg-gray-700 rounded-md"
                        >
                            <FontAwesomeIcon
                                icon={faUser}
                                className="mr-3"
                                size="lg"
                            />
                            <span className={`${!isOpen && "hidden"} md:block`}>
                                Profile
                            </span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
