// src/components/Products.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { fetchProducts } from "./products";
//import { Product } from './types';

const Products: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        products = [],
        loading = false,
        error = null,
    } = useSelector((state: RootState) => state.product || {});
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <img
                            src={product.image}
                            alt={product.name}
                            width="100"
                        />
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: ${product.salePrice}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;
