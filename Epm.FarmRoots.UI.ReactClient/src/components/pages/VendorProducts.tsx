import React, { useEffect, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../utils/store";
import { fetchVendorProducts } from "../utils/products";


const ProductTable = React.lazy(() => import("./ProductTable"));

const Shimmer = () => (
    <div className="animate-pulse">
        <div className="flex justify-between items-center mb-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-left">Stock</th>
                        <th className="p-2 text-left">Regular Price</th>
                        <th className="p-2 text-left">Sale Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-2 bg-slate-200 h-10"></td>
                        <td className="p-2 bg-slate-200 h-10"></td>
                        <td className="p-2 bg-slate-200 h-10"></td>
                        <td className="p-2 bg-slate-200 h-10"></td>
                        <td className="p-2 bg-slate-200 h-10"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

const ProductListPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector((state: RootState) => state.product.vendorProducts);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        dispatch(fetchVendorProducts()).then(() => setLoading(false)); // Set loading to false after products are fetched
    }, [dispatch]);
    console.log("ooo",products)

    return (
        <div className="flex flex-col md:flex-row">
            <div className=" bg-gray-800  p-4 text-white fixed">
            </div>
            <div className="md:ml-64 mt-12 w-full">
                
                <div className="mt-12 p-2">
                    <div className="container mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">Product List</h1>
                        </div>
                        <Suspense fallback={<Shimmer />}>
                            <ProductTable products={products} loading={loading} />
                        </Suspense>
                    </div>
            </div>
        </div>
        </div>
    );
};

export default ProductListPage;
