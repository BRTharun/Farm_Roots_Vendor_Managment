// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../components/utils/store";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const user = useSelector((state: RootState) => state.user?.user);
    const vendor = useSelector((state: RootState) => state.vendor?.vendor);

    const isAuthorized = allowedRoles.includes(
        user?.role || vendor?.role || ""
    );

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
