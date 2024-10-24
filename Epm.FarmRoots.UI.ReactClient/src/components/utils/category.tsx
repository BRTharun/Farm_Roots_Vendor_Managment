import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

// Define the Category type
export interface Category {
    _id: string;
    name: string;
}

// Define the Category state type
interface CategoryState {
    categories: Category[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

// Initial state
const initialState: CategoryState = {
    categories: [],
    status: "idle",
    error: null,
};

// Thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue,getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.get("http://localhost:5000/api/vendors/categorys",
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
                    error.response?.data || "Failed to fetch categories"
                );
            }
            return rejectWithValue("Failed to fetch categories");
        }
    }
);

// Thunk for updating a category
export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, name }: { id: string; name: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.put(
                `http://localhost:5000/api/vendors/category/${id}`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.category;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to update category"
                );
            }
            return rejectWithValue("Failed to update category");
        }
    }
);

// Thunk for deleting a category
export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            await axios.delete(
                `http://localhost:5000/api/vendors/category/${id}`,
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
                    error.response?.data || "Failed to delete category"
                );
            }
            return rejectWithValue("Failed to delete category");
        }
    }
);

export const addCategory = createAsyncThunk(
    "categories/addCategory",
    async (name: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.post(
                "http://localhost:5000/api/vendors/category",
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.category;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to add category"
                );
            }
            return rejectWithValue("Failed to add category");
        }
    }
);


const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch categories";
            })
            .addCase(updateCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.categories.findIndex(category => category._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to update category";
            })
            .addCase(deleteCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categories = state.categories.filter(category => category._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to delete category";
            })
            .addCase(addCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.categories.push(action.payload);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add category";
            });
    }
});

export default categoriesSlice.reducer;