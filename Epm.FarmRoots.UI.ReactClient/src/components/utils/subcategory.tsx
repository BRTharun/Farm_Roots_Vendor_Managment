import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

export interface Subcategory {
    _id: string;
    name: string;
    category_ids: string[];
    product_ids: string[];
}

interface SubcategoryState {
    subcategories: Subcategory[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: SubcategoryState = {
    subcategories: [],
    status: "idle",
    error: null,
};

// Thunk for fetching subcategories
export const fetchSubcategories = createAsyncThunk(
    "subcategories/fetchSubcategories",
    async (categoryId: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.get(`http://localhost:5000/api/vendors/sub-categorys/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.subcategories;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to fetch subcategories"
                );
            }
            return rejectWithValue("Failed to fetch subcategories");
        }
    }
);

// Thunk for updating a subcategory
export const updateSubcategory = createAsyncThunk(
    "subcategories/updateSubcategory",
    async ({ id, name }: { id: string; name: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.put(
                `http://localhost:5000/api/vendors/sub-category/${id}`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.subcategory;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to update subcategory"
                );
            }
            return rejectWithValue("Failed to update subcategory");
        }
    }
);

export const addSubcategory = createAsyncThunk(
    "subcategories/addSubcategory",
    async ({ categoryId, name }: { categoryId: string; name: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.post(
                `http://localhost:5000/api/vendors/sub-category/${categoryId}`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.subcategory;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to add subcategory"
                );
            }
            return rejectWithValue("Failed to add subcategory");
        }
    }
);

// Thunk for deleting a subcategory
export const deleteSubcategory = createAsyncThunk(
    "subcategories/deleteSubcategory",
    async (id: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            await axios.delete(
                `http://localhost:5000/api/vendors/sub-category/${id}`,
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
                    error.response?.data || "Failed to delete subcategory"
                );
            }
            return rejectWithValue("Failed to delete subcategory");
        }
    }
);

const subcategoriesSlice = createSlice({
    name: 'subcategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubcategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSubcategories.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.subcategories = action.payload;
            })
            .addCase(fetchSubcategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch subcategories";
            })
            .addCase(updateSubcategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateSubcategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.subcategories.findIndex(subcategory => subcategory._id === action.payload._id);
                if (index !== -1) {
                    state.subcategories[index] = action.payload;
                }
            })
            .addCase(updateSubcategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to update subcategory";
            })
            .addCase(deleteSubcategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteSubcategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.subcategories = state.subcategories.filter(subcategory => subcategory._id !== action.payload);
            })
            .addCase(deleteSubcategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to delete subcategory";
            })
            .addCase(addSubcategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addSubcategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.subcategories.push(action.payload);
            })
            .addCase(addSubcategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add subcategory";
            });

    }
});

export default subcategoriesSlice.reducer;