// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VendorNavBar from "./components/navbar/VendorNavBar";
import UserNavBar from "./components/navbar/UserNavBar";
import GuestNavBar from "./components/navbar/GestNavBar";
import Login from "./components/pages/Login";
import VendorLogin from "./components/pages/VendorLogin";
import Register from "./components/pages/Register";
import VendorRegister from "./components/pages/VendorRegister";
import Products from "./components/utils/list";
import { Sell } from "./components/pages/Sell";
import VendorProducts from "./components/pages/VendorProducts";
import AddProduct from "./components/pages/AddProduct";
import VendorProfile from "./components/pages/VendorProfile";
import ProtectedRoute from "./components/ProtectedRoutes";
import { useSelector } from "react-redux";
import { RootState } from "./components/utils/store";
import EditProduct from "./components/pages/EditPage";
import CategoryPage from "./components/pages/CategoryPage";
import SubcategoryPage from "./components/pages/SubcategoryPage";
import SubcategoryProductsPage from "./components/pages/SubcategoryProductsPage";
import ManufacturersPage from "./components/pages/ManufacturersPage";
import ManufacturerProductsPage from "./components/pages/ManufacturerProductsPage";

const App: React.FC = () => {
    const user = useSelector((state: RootState) => state.user?.user);
    const vendor = useSelector((state: RootState) => state.vendor?.vendor);

    const renderNavBar = () => {
        if (user && user.role === "User") {
            return <UserNavBar />;
        } else if (vendor && vendor.role === "Vendor") {
            return <VendorNavBar />;
        } else {
            return <GuestNavBar />;
        }
    };

    return (
        <Router>
            <div>
                {renderNavBar()}
                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/sell" element={<Sell />} />
                    <Route path="/vendor-login" element={<VendorLogin />} />
                    <Route
                        path="/vendor-register"
                        element={<VendorRegister />}
                    />

                    {/* Protected Routes */}
                    <Route
                        element={<ProtectedRoute allowedRoles={["Vendor"]} />}
                    >
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route
                            path="/my-products"
                            element={<VendorProducts />}
                        />
                        <Route
                            path="/vendor-profile"
                            element={<VendorProfile />}
                        />
                        <Route path="/vendor-edit/:id" element={<EditProduct />} />
                        <Route path="/category" element={<CategoryPage/>}/>
                        <Route path="/subcategories/:categoryId" element={<SubcategoryPage />} />
                        <Route path="/subcategory-products/:subcategoryId" element={<SubcategoryProductsPage />} />
                        <Route path="/manufacturers" element={<ManufacturersPage />} />
                        <Route path="/manufacturer-products/:manufacturerId" element={<ManufacturerProductsPage />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
