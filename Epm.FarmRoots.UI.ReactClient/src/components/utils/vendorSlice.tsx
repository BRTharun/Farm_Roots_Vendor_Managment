import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Vendor {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    role:string;
    token?:string
}

export interface VendorState {
    vendor: Vendor | null;
    loading: boolean;
    error: string | null;
    profile: Vendor | null;
}

const initialState: VendorState = {
    vendor: null,
    loading: false,
    profile: null, 
    error: null,
};

// Async thunks
export const loginVendor = createAsyncThunk<
    Vendor,
    { email: string; password: string }
>("vendor/login", async (vendorData) => {
    const response = await axios.post<Vendor>(
        "http://localhost:5000/api/auth/login/vendor",
        vendorData
    );
    return response.data;
});

export const registerVendor = createAsyncThunk<
    Vendor,
    {
        companyName: string;
        contactName: string;
        email: string;
        password: string;
        phone: string
    }
>("vendor/register", async (vendorData) => {
    const response = await axios.post<Vendor>(
        "http://localhost:5000/api/auth/register/vendor",
        vendorData
    );
    return response.data;
});

export const fetchVendorProfile = createAsyncThunk<
    Vendor,
    void,
    { state: { vendor: VendorState } }
>("vendor/fetchVendorProfile", async (_, { getState, rejectWithValue }) => {
    const state = getState() as { vendor: VendorState };
    console.log(state)
    const token = state.vendor.vendor?.token;
    console.log("token",token);

    if (!token) {
        return rejectWithValue("No token found");
    }

    try {
        const response = await axios.get<Vendor>(
            "http://localhost:5000/api/vendors/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data || "Failed to fetch vendor profile");
        }
        return rejectWithValue("Failed to fetch vendor profile");
    }
});

export const logoutVendor = createAsyncThunk("vendor/logout", async () => {
    // Perform any necessary logout operations
    localStorage.removeItem("vendor");
});

const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginVendor.fulfilled, (state, action) => {
                state.vendor = action.payload;
                state.loading = false;
            })
            .addCase(loginVendor.rejected, (state, action) => {
                state.error = action.error.message || "Login failed";
                state.loading = false;
            })
            .addCase(registerVendor.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerVendor.fulfilled, (state, action) => {
                state.vendor = action.payload;
                state.loading = false;
            })
            .addCase(registerVendor.rejected, (state, action) => {
                state.error = action.error.message || "Registration failed";
                state.loading = false;
            })
            .addCase(fetchVendorProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVendorProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.loading = false;
            })
            .addCase(fetchVendorProfile.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch vendor profile";
                state.loading = false;
            })
            .addCase(logoutVendor.fulfilled, (state) => {
                state.vendor = null;
            });
    },
});

export default vendorSlice.reducer;
