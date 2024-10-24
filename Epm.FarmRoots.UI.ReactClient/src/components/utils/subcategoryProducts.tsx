import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

export interface SubcategoryProduct {
    _id: string;
    product_ids: { _id: string; product_name?: string }[];
}

interface SubcategoryProductState {
    subcategoryProduct: SubcategoryProduct | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: SubcategoryProductState = {
    subcategoryProduct: null,
    status: "idle",
    error: null,
};

// Thunk for fetching products related to a subcategory
export const fetchSubcategoryProducts = createAsyncThunk(
    "subcategoryProducts/fetchSubcategoryProducts",
    async (subcategoryId: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.get(
                `http://localhost:5000/api/vendors/subcategory/${subcategoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("hhhhh", response.data);
            return response.data; // Ensure returning full response data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data ||
                        "Failed to fetch subcategory products"
                );
            }
            return rejectWithValue("Failed to fetch subcategory products");
        }
    }
);

// Thunk for updating products in a subcategory
export const updateSubcategoryProducts = createAsyncThunk(
    "subcategoryProducts/updateSubcategoryProducts",
    async (
        {
            subcategoryId,
            product_ids,
        }: { subcategoryId: string; product_ids: string[] },
        { rejectWithValue, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.put(
                `http://localhost:5000/api/vendors/sub-category-prod/${subcategoryId}`,
                { product_ids },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.subcategory; // Ensure the returned data is the subcategory
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data ||
                        "Failed to update subcategory products"
                );
            }
            return rejectWithValue("Failed to update subcategory products");
        }
    }
);

// Thunk for adding products to a subcategory
export const mapProductsToSubcategory = createAsyncThunk(
    "subcategoryProducts/mapProductsToSubcategory",
    async (
        {
            subcategoryId,
            product_ids,
        }: { subcategoryId: string; product_ids: string[] },
        { rejectWithValue, getState }
    ) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.post(
                `http://localhost:5000/api/vendors/sub-category-map/${subcategoryId}`,
                { product_ids },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.subcategory; // Ensure the returned data is the subcategory
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data ||
                        "Failed to map products to subcategory"
                );
            }
            return rejectWithValue("Failed to map products to subcategory");
        }
    }
);

// Define the slice
const subcategoryProductsSlice = createSlice({
    name: "subcategoryProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubcategoryProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSubcategoryProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.subcategoryProduct = action.payload;
            })
            .addCase(fetchSubcategoryProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message ||
                    "Failed to fetch subcategory products";
            })
            .addCase(updateSubcategoryProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateSubcategoryProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.subcategoryProduct = action.payload;
            })
            .addCase(updateSubcategoryProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message ||
                    "Failed to update subcategory products";
            })
            .addCase(mapProductsToSubcategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(mapProductsToSubcategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.subcategoryProduct = action.payload;
            })
            .addCase(mapProductsToSubcategory.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message ||
                    "Failed to map products to subcategory";
            });
    },
});

export default subcategoryProductsSlice.reducer;
