// VendorProfile.test.tsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import vendorReducer, { fetchVendorProfile, VendorState, Vendor } from "../utils/vendorSlice";
import VendorProfile from "../pages/VendorProfile";

// Mock Axios
const mock = new MockAdapter(axios);

// Utility function to render the component with a Redux store
const renderWithRedux = (
    component: React.ReactNode,
    initialState: { vendor: VendorState } = {
        vendor: {
            vendor: null,
            loading: false,
            error: null,
            profile: null,
        },
    }
) => {
    const store = configureStore({
        reducer: {
            vendor: vendorReducer,
        },
        preloadedState: initialState,
    });
    return render(<Provider store={store}>{component}</Provider>);
};

describe("VendorProfile", () => {
    beforeEach(() => {
        mock.reset();
    });

    test("displays loading shimmer when loading", () => {
        renderWithRedux(<VendorProfile />, {
            vendor: { vendor: null, loading: true, error: null, profile: null },
        });
        expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
    });

    
    test("displays profile data when available", async () => {
        const profile: Vendor = {
            id: "1",
            companyName: "Test Company",
            contactName: "John Doe",
            email: "test@example.com",
            phone: "123-456-7890",
            role: "Admin",
            token: "fake-token"
        };

        // Mock fetchVendorProfile to return a resolved promise
        mock.onGet("http://localhost:5000/api/vendors/profile")
            .reply(200, profile);

        const store = configureStore({
            reducer: {
                vendor: vendorReducer,
            },
            preloadedState: {
                vendor: {
                    vendor: { token: "fake-token" } as Vendor,
                    loading: true,
                    error: null,
                    profile: null,
                }
            },
        });

        // Render with initial state having a profile
        render(<Provider store={store}><VendorProfile /></Provider>);

        await act(async () => {
            store.dispatch(fetchVendorProfile() as any);
        });

        // Wait and check for the profile data
        expect(screen.getByText("Vendor Profile")).toBeInTheDocument();
        expect(screen.getByText("Company Name:")).toBeInTheDocument();
        expect(screen.getByText(profile.companyName)).toBeInTheDocument();
        expect(screen.getByText("Contact Name:")).toBeInTheDocument();
        expect(screen.getByText(profile.contactName)).toBeInTheDocument();
        expect(screen.getByText("Email:")).toBeInTheDocument();
        expect(screen.getByText(profile.email)).toBeInTheDocument();
        expect(screen.getByText("Phone:")).toBeInTheDocument();
        expect(screen.getByText(profile.phone)).toBeInTheDocument();
        expect(screen.getByText("Role:")).toBeInTheDocument();
        expect(screen.getByText(profile.role)).toBeInTheDocument();
    });
});


