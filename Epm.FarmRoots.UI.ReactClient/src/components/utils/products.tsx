// src/redux/productsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

// Define a type for the product
export interface Product {
    _id?: string;
    product_name: string;
    product_type: string;
    short_description: string;
    full_description: string;
    product_condition: string;
    country_of_origin: string;
    product_tags: string[];
    available_start_date: string;
    available_end_date: string;
    delivery_time: number;
    free_shipping: boolean;
    additional_shipping_charge: number;
    quantity_unit: string;
    inventory: {
        stock_quantity: number;
        minimum_cart_quantity: number;
        maximum_cart_quantity: number;
        quantity_step: number;
    };
    price: {
        sale_price: number;
        mr_price: number;
        special_price: number;
        special_price_from: string;
        special_price_to: string;
        product_cost: number;
    };
    disable_buy_button: boolean;
    base_price_calculation: string;
    image: {
        main_image_for_main_page: string;
        product_image_for_product_page: string;
    };
    published: boolean;
    category:string[],
    subcategory:string[],
    manufacturer:string[],
}

// Define a type for the slice state
interface ProductsState {
    products: Product[];
    vendorProducts: Product[];
    status: "idle" | "loading" | "succeeded" | "failed";
    loading: boolean;
    error: string | null;
    editProduct:{ product: Product } | null;
}

// Initial state
const initialState: ProductsState = {
    products: [],
    vendorProducts: [],
    status: "idle",
    loading: false,
    error: null,
    editProduct: null,
};


export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            await axios.delete(
                `http://localhost:5000/api/vendors/product/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return id;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to delete product"
                );
            }
            return rejectWithValue("Failed to delete product");
        }
    }
);

export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",
    async (id: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.get(
                `http://localhost:5000/api/vendors/get-product/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data)
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to fetch product"
                );
            }
            return rejectWithValue("Failed to fetch product");
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async (product: Product, { rejectWithValue, getState }) => {
        const state = getState() as RootState;
        const token = state.vendor.vendor?.token;

        if (!token) {
            return rejectWithValue("No token found");
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/vendors/product/${product._id}`,
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to update product"
                );
            }
            return rejectWithValue("Failed to update product");
        }
    }
);

// Create an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async () => {
        const response = await axios.get("http://localhost:5000/api/products");
        return response.data;
    }
);

export const fetchVendorProducts = createAsyncThunk(
    "products/fetchVendorProducts",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const token = state.vendor.vendor?.token; // Adjust this based on where the token is stored

        if (!token) {
            return rejectWithValue("No token found");
        }

        try {
            const response = await axios.get(
                "http://localhost:5000/api/vendors/products",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to fetch vendor products"
                );
            }
            return rejectWithValue("Failed to fetch vendor products");
        }
    }
);

// Create an async thunk for adding a product
export const addProduct = createAsyncThunk(
    "products/addProduct",
    async (product: Product, { rejectWithValue, getState }) => {
        const state = getState() as RootState;
        console.log("state here", state);
        console.log("product", product);

        // Access the token based on where it is actually stored
        const token = state.vendor.vendor?.token; // Adjust this based on where the token is stored
        console.log("token", token);
        console.log(product); // Assuming token is stored in auth slice

        try {
            const response = await axios.post(
                "http://localhost:5000/api/vendors/product",
                product,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to add product"
                );
            }
            return rejectWithValue("Failed to add product");
        }
    }
);
// Create the slice
const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to fetch products";
            })
            .addCase(fetchVendorProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchVendorProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.vendorProducts = action.payload;
            })
            .addCase(fetchVendorProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to fetch vendor products";
            })
            .addCase(addProduct.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add product";
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.editProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch product";
            })
            .addCase(updateProduct.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Update product in state.products
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to update product";
            })
            .addCase(deleteProduct.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.products = state.products.filter(
                    (product) => product._id !== action.payload
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message || "Failed to delete product";
            });
    },
});

export default productsSlice.reducer;
