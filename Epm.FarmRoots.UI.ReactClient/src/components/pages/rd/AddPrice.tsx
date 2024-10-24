import React, { useState } from "react";
import axios from "axios";

const AddPrice: React.FC = () => {
    const [priceData, setPriceData] = useState({
        priceId: 0,
        salePrice: 0,
        mrp: 0,
        specialPrice: 0,
        specialPriceFromDate: "",
        specialPriceToDate: "",
        discount: 0,
        productCost: 0,
        isBuyButtonDisabled: true,
        productId: 0,
    });

    // Handle input change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked }:any = e.target;
        setPriceData({
            ...priceData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(priceData)
        try {
            const response = await axios.post(
                "https://localhost:7189/api/Price",
                priceData
            );
            console.log("Price added successfully:", response.data);
        } catch (error) {
            console.error("Error adding price:", error);
        }
    };

    return (
        <div>
            <h1>Add Price</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Price ID:</label>
                    <input
                        type="number"
                        name="priceId"
                        value={priceData.priceId}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Sale Price:</label>
                    <input
                        type="number"
                        name="salePrice"
                        value={priceData.salePrice}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>MRP:</label>
                    <input
                        type="number"
                        name="mrp"
                        value={priceData.mrp}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Special Price:</label>
                    <input
                        type="number"
                        name="specialPrice"
                        value={priceData.specialPrice}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Special Price From Date:</label>
                    <input
                        type="datetime-local"
                        name="specialPriceFromDate"
                        value={priceData.specialPriceFromDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Special Price To Date:</label>
                    <input
                        type="datetime-local"
                        name="specialPriceToDate"
                        value={priceData.specialPriceToDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Discount:</label>
                    <input
                        type="number"
                        name="discount"
                        value={priceData.discount}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Product Cost:</label>
                    <input
                        type="number"
                        name="productCost"
                        value={priceData.productCost}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Disable Buy Button:</label>
                    <input
                        type="checkbox"
                        name="isBuyButtonDisabled"
                        checked={priceData.isBuyButtonDisabled}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Product ID:</label>
                    <input
                        type="number"
                        name="productId"
                        value={priceData.productId}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Add Price</button>
            </form>
        </div>
    );
};

export default AddPrice;
