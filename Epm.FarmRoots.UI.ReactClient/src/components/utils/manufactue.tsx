import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

// Define the Manufacturer type
export interface Manufacturer {
    _id: string;
    name: string;
    product_ids: { _id: string }[];
}

export interface ManufacturerProducts {
    _id:string;
    product_ids:{_id:string};
}

// Define the Manufacturer state type
interface ManufacturerState {
    manufacturers: Manufacturer[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

// interface ManufacturerProductsState {
//     manufacturerProducts:ManufacturerProducts|null,
//     status: "idle" | "loading" | "succeeded" | "failed";
//     error: string | null;
// }

// Initial state
const initialState: ManufacturerState = {
    manufacturers: [],
    status: "idle",
    error: null,
};

// Thunk for fetching all manufacturers
export const fetchManufacturers = createAsyncThunk(
    "manufacturers/fetchManufacturers",
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.get(
                "http://localhost:5000/api/vendors/manufacturers",
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
                    error.response?.data || "Failed to fetch manufacturers"
                );
            }
            return rejectWithValue("Failed to fetch manufacturers");
        }
    }
);

// Thunk for fetching products related to a manufacturer
export const fetchManufacturerProducts = createAsyncThunk(
    "manufacturers/fetchManufacturerProducts",
    async (manufacturerId: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.get(
                `http://localhost:5000/api/vendors/manufacturer/${manufacturerId}`,
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
                    error.response?.data || "Failed to fetch manufacturer products"
                );
            }
            return rejectWithValue("Failed to fetch manufacturer products");
        }
    }
);

// Thunk for updating a manufacturer
export const updateManufacturer = createAsyncThunk(
    "manufacturers/updateManufacturer",
    async ({ id, name }: { id: string; name: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.put(
                `http://localhost:5000/api/vendors/manufacturer/${id}`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.manufacturer;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to update manufacturer"
                );
            }
            return rejectWithValue("Failed to update manufacturer");
        }
    }
);

// Thunk for deleting a manufacturer
export const deleteManufacturer = createAsyncThunk(
    "manufacturers/deleteManufacturer",
    async (id: string, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            await axios.delete(
                `http://localhost:5000/api/vendors/manufacturer/${id}`,
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
                    error.response?.data || "Failed to delete manufacturer"
                );
            }
            return rejectWithValue("Failed to delete manufacturer");
        }
    }
);

// Thunk for adding a manufacturer
export const addManufacturer = createAsyncThunk(
    "manufacturers/addManufacturer",
    async ({ name }: { name: string }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.post(
                "http://localhost:5000/api/vendors/manufacturer",
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.manufacturer;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to add manufacturer"
                );
            }
            return rejectWithValue("Failed to add manufacturer");
        }
    }
);

// Thunk for updating products in a manufacturer
export const updateManufacturerProducts = createAsyncThunk(
    "manufacturers/updateManufacturerProducts",
    async ({ manufacturerId, product_ids }: { manufacturerId: string; product_ids: string[] }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const token = state.vendor.vendor?.token;
            const response = await axios.put(
                `http://localhost:5000/api/vendors/manufacturer-prod/${manufacturerId}`,
                { product_ids },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data.manufacturer)
            return response.data.manufacturer;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(
                    error.response?.data || "Failed to update manufacturer products"
                );
            }
            return rejectWithValue("Failed to update manufacturer products");
        }
    }
);

const manufacturersSlice = createSlice({
    name: 'manufacturers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchManufacturers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchManufacturers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.manufacturers = action.payload;
            })
            .addCase(fetchManufacturers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch manufacturers";
            })
            .addCase(fetchManufacturerProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchManufacturerProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.manufacturers = action.payload;
            })
            .addCase(fetchManufacturerProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch manufacturers";
            })
            .addCase(updateManufacturer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateManufacturer.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.manufacturers.findIndex(manufacturer => manufacturer._id === action.payload._id);
                if (index !== -1) {
                    state.manufacturers[index] = action.payload;
                }
            })
            .addCase(updateManufacturer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to update manufacturer";
            })
            .addCase(deleteManufacturer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteManufacturer.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.manufacturers = state.manufacturers.filter(manufacturer => manufacturer._id !== action.payload);
            })
            .addCase(deleteManufacturer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to delete manufacturer";
            })
            .addCase(addManufacturer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addManufacturer.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.manufacturers.push(action.payload);
            })
            .addCase(addManufacturer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to add manufacturer";
            })
            .addCase(updateManufacturerProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateManufacturerProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.manufacturers.findIndex(manufacturer => manufacturer._id === action.payload._id);
                if (index !== -1) {
                    state.manufacturers[index] = action.payload;
                }
            })
            .addCase(updateManufacturerProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to update manufacturer products";
            });
    }
});

export default manufacturersSlice.reducer;