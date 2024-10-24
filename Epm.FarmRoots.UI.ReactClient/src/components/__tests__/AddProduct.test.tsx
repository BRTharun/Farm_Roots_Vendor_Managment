import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../utils/store"; // Assuming store is exported from here
import AddProduct from "../pages/AddProduct";

describe("AddProduct Component Tests", () => {
    const fillInputs = (values:any) => {
        Object.keys(values).forEach((key) => {
            const element = screen.getByLabelText(new RegExp(key, 'i'));
            if (element) {
                fireEvent.change(element, {
                    target: { value: values[key] },
                });
            }
        });
    };

    test("component should render input elements for product details", () => {
        render(
            <Provider store={store}>
                <AddProduct />
            </Provider>
        );

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Image URL/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Stock/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Regular Price/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Sale Price/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Publish/i)).toBeInTheDocument();
    });

    test("fields should have initial empty or default values", () => {
        render(
            <Provider store={store}>
                <AddProduct />
            </Provider>
        );

        expect((screen.getByLabelText(/Name/i) as HTMLInputElement).value).toBe("");
        expect((screen.getByLabelText(/Category/i) as HTMLInputElement).value).toBe("");
        expect((screen.getByLabelText(/Image URL/i) as HTMLInputElement).value).toBe("");
        expect((screen.getByLabelText(/Description/i) as HTMLTextAreaElement).value).toBe("");
        expect((screen.getByLabelText(/Stock/i) as HTMLInputElement).value).toBe("0");
        expect((screen.getByLabelText(/Tags/i) as HTMLInputElement).value).toBe("");
        expect((screen.getByLabelText(/Regular Price/i) as HTMLInputElement).value).toBe("0");
        expect((screen.getByLabelText(/Sale Price/i) as HTMLInputElement).value).toBe("0");
        expect((screen.getByLabelText(/Publish/i) as HTMLInputElement).checked).toBeFalsy();
    });

    test("should display error message when required fields are empty on submit", async () => {
        render(
            <Provider store={store}>
                <AddProduct />
            </Provider>
        );
        fireEvent.submit(screen.getByRole("button", { name: /Add Product/i }));
        await waitFor(async () => {
            expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Category is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Image URL is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Stock cannot be less than one/i)).toBeInTheDocument();
            expect(screen.getByText(/Regular Price cannot be less than one/i)).toBeInTheDocument();
            expect(screen.getByText(/Sale Price cannot be less than one/i)).toBeInTheDocument();
        });
    });

    test("valid inputs should not show error messages and submit successfully", async () => {
        render(
            <Provider store={store}>
                <AddProduct />
            </Provider>
        );

        fillInputs({
            Name: "Sample Product",
            Category: "Electronics",
            "Image URL": "http://example.com/image.jpg",
            Description: "A sample product description",
            Stock: "10",
            Tags: "sample, product",
            "Regular Price": "100",
            "Sale Price": "90",
        });

        fireEvent.click(screen.getByLabelText(/Publish/i));
        fireEvent.submit(screen.getByRole("button", { name: /Add Product/i }));

        await waitFor(async () => {
            expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/cannot be less than one/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/cannot be greater than Regular Price/i)).not.toBeInTheDocument();
        });
    });

    test("should display error for invalid image URL", async () => {
        render(
            <Provider store={store}>
                <AddProduct />
            </Provider>
        );

        fillInputs({
            "Image URL": "invalid-url",
        });

        fireEvent.submit(screen.getByRole("button", { name: /Add Product/i }));

        await waitFor(async () => {
            expect(screen.getByText(/Invalid URL format/i)).toBeInTheDocument();
        });
    });

    test("should enforce correct constraints on stock, regular price, and sale price", async () => {
        render(
            <Provider store={store}>
                <AddProduct />
            </Provider>
        );

        fillInputs({
            Stock: "0",
            "Regular Price": "0",
            "Sale Price": "0",
        });

        fireEvent.submit(screen.getByRole("button", { name: /Add Product/i }));

        await waitFor(async () => {
            expect(screen.getByText(/Stock cannot be less than one/i)).toBeInTheDocument();
            expect(screen.getByText(/Regular Price cannot be less than one/i)).toBeInTheDocument();
            expect(screen.getByText(/Sale Price cannot be less than one/i)).toBeInTheDocument();
        });
    });

    
});