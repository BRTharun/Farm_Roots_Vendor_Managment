import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
    fetchSubcategoryProducts,
    updateSubcategoryProducts,

} from "../utils/subcategoryProducts";
import { fetchVendorProducts } from "../utils/products";
import { AppDispatch, RootState } from "../utils/store";

// Define types for select options and selected values
interface SelectOptionType {
    value: string;
    label: string;
}

const SubcategoryProductsPage: React.FC = () => {
    const { subcategoryId } = useParams<{ subcategoryId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { subcategoryProduct, status, error } = useSelector(
        (state: RootState) => state.subcategoryProducts
    );
    const { vendorProducts, status: vendorProductsStatus } = useSelector((state: RootState) => state.product);

    useEffect(() => {
        if (subcategoryId) {
            dispatch(fetchSubcategoryProducts(subcategoryId));
        }
    }, [subcategoryId, dispatch]);

    useEffect(() => {
        if (vendorProductsStatus === "idle") {
            dispatch(fetchVendorProducts());
        }
    }, [dispatch, vendorProductsStatus]);

    const [selectedProducts, setSelectedProducts] = useState<SelectOptionType[]>([]);

    const handleMapProducts = (selectedOptions: SelectOptionType[]) => {
        setSelectedProducts(selectedOptions);
    };

    const handleUpdate = () => {
        const product_ids = selectedProducts.map(option => option.value);
        dispatch(
            updateSubcategoryProducts({
                subcategoryId: subcategoryId!,
                product_ids,
            })
        ).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                dispatch(fetchSubcategoryProducts(subcategoryId!)); // Fetch updated products
            }
        });
    };

    const handleDelete = () => {
        dispatch(
            updateSubcategoryProducts({
                subcategoryId: subcategoryId!,
                product_ids: [],
            })
        ).then(() => {
            setSelectedProducts([]);
        });
    };

    const getSelectedProducts = (): SelectOptionType[] => {
        if (subcategoryProduct) {
            console.log(subcategoryProduct);
            console.log("sub",subcategoryProduct);
            
            return subcategoryProduct.product_ids.map(product => {
                const vproduct = vendorProducts.find(vp => (vp._id===product._id));
                return {
                    value: product._id ,
                label: vproduct?vproduct.product_name:product._id,
                }
            });
        }
        return [];
    };

    useEffect(() => {
        setSelectedProducts(getSelectedProducts());
    }, [subcategoryProduct]);

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:ml-64 mt-12 w-full">
                <div className="mt-12 p-2">
                    <div className="overflow-x-auto">
                        <h1 className="text-2xl font-bold mb-6">
                            Subcategory Products
                        </h1>
                        {status === "loading" && <p>Loading...</p>}
                        {status === "failed" && (
                            <p className="text-red-500">{error}</p>
                        )}
                        {subcategoryProduct && (
                            <>
                                <div className="flex mb-4">
                                    <Select<SelectOptionType, true>
                                        isMulti
                                        options={vendorProducts.map((product) => ({
                                            value: product._id || '',
                                            label: product.product_name,
                                        }))}
                                        value={selectedProducts}
                                        onChange={(options) => handleMapProducts(options as SelectOptionType[])}
                                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                                        placeholder="Select products"
                                    />
                                    <button
                                        onClick={handleUpdate}
                                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Delete All
                                    </button>
                                </div>
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 border-b border-gray-200">
                                            <th className="p-2 text-left">
                                                Product ID
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getSelectedProducts().map(
                                            (product) => (
                                                <tr
                                                    key={product.value}
                                                    className="border-b border-gray-200"
                                                >
                                                    <td className="p-2">
                                                        {product.label}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubcategoryProductsPage;