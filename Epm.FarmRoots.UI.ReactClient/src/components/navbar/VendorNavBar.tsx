// src/App.tsx
import React from "react";
//import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "../pages/Sidebar";
import TopBar from "../pages/TopBar";


const App: React.FC = () => {
    return (
        <>
            <div className="flex h bg-background">
                <Sidebar />
                <div>
                    <TopBar />
                </div>
            </div>
        </>
    );
};

export default App;
