import React from "react";
import Shimmer from "./Shimmer"; // Import the Shimmer component
import { deleteProduct, Product } from "../utils/products";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../utils/store";

interface ProductTableProps {
    products: Product[];
    loading: boolean; // Add a loading prop to handle shimmer display
}

const ProductTable: React.FC<ProductTableProps> = ({ products, loading }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { categories } = useSelector((state: RootState) => state.categories);
    console.log(
        "mm",
        categories.map((x) => x._id)
    );
    if (loading) {
        return <Shimmer />; // Display shimmer when loading
    }

    const handleEdit = (id: any) => {
        // Logic for editing a product
        navigate(`/vendor-edit/${id}`);
    };

    const handleDelete = (id: any) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id));
        }
    };

    const getCategory = ([category]: any): any => {
        const foundCategory = categories?.find((c) => {
            console.log("id",c._id)
            console.log("nn",category)
            return (c._id === category)});
        // Return an empty array if the category is not found or the label is undefined
        return foundCategory?.name?foundCategory?.name:'No Category';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Stock</th>
                        <th className="p-2 text-left">MR Price</th>
                        <th className="p-2 text-left">Product Cost</th>
                        <th className="p-2 text-left">Sale Price</th>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr
                                key={product._id}
                                className="border-b border-gray-200"
                            >
                                <td className="p-2">{product.product_name}</td>
                                <td className="p-2">
                                    {product.inventory.stock_quantity}
                                </td>
                                <td className="p-2">
                                    {product.price.mr_price}
                                </td>
                                <td className="p-2">
                                    ${product.price.product_cost}
                                </td>
                                <td className="p-2">
                                    ${product.price.sale_price}
                                </td>
                                <td className="p-2">
                                    {getCategory(product.category)}
                                </td>
                                <td className="p-2">
                                    {product._id ? ( // Check if _id is defined
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleEdit(product._id)
                                                }
                                                className="text-blue-500 hover:text-blue-700 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product._id)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <span>No ID</span> // Handle cases where _id is undefined
                                    )}
                                </td>{" "}
                                {/* New cell for actions */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="p-2 text-center">
                                No products found
                            </td>{" "}
                            {/* Adjusted colspan */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
