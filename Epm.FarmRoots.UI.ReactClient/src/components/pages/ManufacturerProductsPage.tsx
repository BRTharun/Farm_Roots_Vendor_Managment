import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
    fetchManufacturerProducts,
    updateManufacturerProducts,
} from "../utils/manufactue";
import { fetchVendorProducts } from "../utils/products";
import { AppDispatch, RootState } from "../utils/store";

// Define types for select options and selected values
interface SelectOptionType {
    value: string;
    label: string;
}

const ManufacturerProductsPage: React.FC = () => {
    const { manufacturerId } = useParams<{ manufacturerId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { manufacturers, status, error } = useSelector(
        (state: RootState) => state.manufacturers
    );
    console.log("jkfdj",manufacturers)
    const { vendorProducts } = useSelector((state: RootState) => state.product);

    useEffect(() => {
        if (manufacturerId) {
            dispatch(fetchManufacturerProducts(manufacturerId));
        }
    }, [manufacturerId, dispatch]);

    useEffect(() => {
        dispatch(fetchVendorProducts());
    }, [dispatch]);

    const [selectedProducts, setSelectedProducts] = useState<SelectOptionType[]>([]);

    const handleMapProducts = (selectedOptions: SelectOptionType[]) => {
        setSelectedProducts(selectedOptions);
    };

    const handleUpdate = () => {
        const product_ids = selectedProducts.map(option => option.value);
        dispatch(
            updateManufacturerProducts({
                manufacturerId: manufacturerId!,
                product_ids,
            })
        ).then((action) => {
            if (action.meta.requestStatus === "fulfilled") {
                dispatch(fetchManufacturerProducts(manufacturerId!)); // Fetch updated products
            }
        });
    };

    const getSelectedProducts = (): SelectOptionType[] => {
        const manufacturer = manufacturers.find((manufacturer: any) => {
            console.log("Comparing manufacturer._id:", manufacturer._id, "with manufacturerId:", manufacturerId);
            return manufacturer._id === manufacturerId;
        });
        if (manufacturer) {
            // Retrieve full product details for selected product IDs
            return manufacturer?.product_ids?.map(productId => {
                console.log("vendorProducts",vendorProducts);
                console.log("manufacturer",manufacturer);
                console.log("productId",typeof productId)
                const product = vendorProducts.find(vp => (vp._id===productId._id));
                return {
                    value: productId as unknown as string,
                    label: product ? product.product_name : productId as unknown as string, // Adjust if you have product_name
                };
            });
        }
        return [];
    };

    useEffect(() => {
        setSelectedProducts(getSelectedProducts());
    }, [manufacturers, manufacturerId, vendorProducts]);

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:ml-64 mt-12 w-full">
                <div className="mt-12 p-2">
                    <div className="overflow-x-auto">
                        <h1 className="text-2xl font-bold mb-6">
                            Manufacturer Products
                        </h1>
                        {status === "loading" && <p>Loading...</p>}
                        {status === "failed" && (
                            <p className="text-red-500">{error}</p>
                        )}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManufacturerProductsPage;