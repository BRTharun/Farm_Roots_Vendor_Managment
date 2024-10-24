// src/components/TopBar.tsx
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const TopBar: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full bg-gray-800 p-4 text-white z-40">
            <div className="flex justify-end items-center">
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                        <FontAwesomeIcon icon={faUserCircle} size="2x" />
                    </Menu.Button>
                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to="/profile"
                                        className={`${
                                            active ? "bg-gray-100" : ""
                                        } block px-4 py-2 text-sm`}
                                    >
                                        Profile
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to="/logout"
                                        className={`${
                                            active ? "bg-gray-100" : ""
                                        } block px-4 py-2 text-sm`}
                                    >
                                        Logout
                                    </Link>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
};

export default TopBar;
