import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
    User,
    { email: string; password: string }
>("user/login", async (userData) => {
    const response = await axios.post<User>(
        "http://localhost:5000/api/auth/login/user",
        userData
    );
    console.log("lll",response.data)
    return response.data;
});

export const registerUser = createAsyncThunk<
    User,
    { firstName: string; lastName: string; email: string; password: string }
>("user/register", async (userData) => {
    console.log("userData", userData);
    const response = await axios.post<User>(
        "http://localhost:5000/api/auth/register/user",
        userData
    );
    return response.data;
});

export const logoutUser = createAsyncThunk("user/logout", async () => {
    // Perform any necessary logout operations
    localStorage.removeItem("user");
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.error.message || "Login failed";
                state.loading = false;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.error.message || "Registration failed";
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export default userSlice.reducer;
