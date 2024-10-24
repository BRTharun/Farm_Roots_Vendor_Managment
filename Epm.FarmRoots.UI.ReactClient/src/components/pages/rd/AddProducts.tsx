import React, { useState } from "react";
import axios from "axios";
//import { configureStore } from "@reduxjs/toolkit";

const AddProducts: React.FC = () => {
    const [productData, setProductData] = useState({
        productType: "",
        published:true,
        productName: "",
        shortDescription: "",
        fullDescription: "",
        productCondition: "",
        productTags: [""],
        vendorId: 0,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(productData)
        try {
            const response = await axios.post(
                "https://localhost:7189/api/products",
                productData
            );
            console.log("Product added successfully:", response.data);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div>
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product Type:</label>
                    <input
                        type="text"
                        name="productType"
                        value={productData.productType}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="productName"
                        value={productData.productName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Short Description:</label>
                    <input
                        type="text"
                        name="shortDescription"
                        value={productData.shortDescription}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Full Description:</label>
                    <textarea
                        name="fullDescription"
                        value={productData.fullDescription}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Product Condition:</label>
                    <input
                        type="text"
                        name="productCondition"
                        value={productData.productCondition}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Tags:</label>
                    <input
                        type="text"
                        name="productTags"
                        value={productData.productTags.join(", ")}
                        onChange={(e) =>
                            setProductData({
                                ...productData,
                                productTags: e.target.value.split(","),
                            })
                        }
                    />
                </div>
                <div>
                    <label>Vendor ID:</label>
                    <input
                        type="number"
                        name="vendorId"
                        value={productData.vendorId}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProducts;
