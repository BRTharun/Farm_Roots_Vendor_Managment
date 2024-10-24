// src/__tests__/ProductListPage.test.tsx
import React from "react";
import { describe, it, expect, beforeEach, } from "vitest";
import { render, screen,act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import ProductListPage from "../pages/VendorProducts";
import productsSlice, { fetchProducts } from "../utils/products";
import productsReducer from "../utils/products";

// Mock Axios
const mock = new MockAdapter(axios);

// Mock products data
const mockProducts = [
    {
        name: "Product1",
        category: "Category1",
        stock: 10,
        regularPrice: 100,
        salePrice: 80,
        image: "h.jpeg",
        description: "kjkdj",
        tags: ["jd", "kjdk"],
        publish: true,
    },
    // Add more mock products as needed
];

// Utility function to render the component with a Redux store
const renderWithRedux = (
    component: React.ReactNode,
) => {
    const store = configureStore({
        reducer: {
            product: productsReducer,
        },
        
    });
    return render(<Provider store={store}>{component}</Provider>);
};

describe("ProductListPage", () => {
    beforeEach(() => {
        mock.reset();
    });

    it("renders loading shimmer initially", () => {
        renderWithRedux(<ProductListPage />);

        // Expect shimmer to be in the document
        expect(screen.getByText("Product List")).toBeInTheDocument();
        // You could further check for specific parts of the shimmer UI
    });

    it("renders product table after loading", async () => {
        // Mock API call
        mock.onGet("http://localhost:5000/api/products").reply(200, mockProducts);

        const store = configureStore({
            reducer: {
                product: productsSlice,
            },
            
        });

        render(<Provider store={store}><ProductListPage /></Provider>);

        await act(async () => {
            store.dispatch(fetchProducts() as any);
        });

        // Expect product table to be in the document
        expect(await screen.findByText("Product1")).toBeInTheDocument();
        expect(await screen.findByText("Category1")).toBeInTheDocument();
    });

    it("displays no products found when products array is empty", async () => {
        // Mock API call with an empty product list
        mock.onGet("http://localhost:5000/api/products").reply(200, []);

        const store = configureStore({
            reducer: {
                product: productsSlice,
            },
        });

        render(<Provider store={store}><ProductListPage /></Provider>);

        await act(async () => {
            store.dispatch(fetchProducts() as any);
        });

        // Expect "No products found" to be in the document
        expect(await screen.findByText("No products found")).toBeInTheDocument();
    });
});
