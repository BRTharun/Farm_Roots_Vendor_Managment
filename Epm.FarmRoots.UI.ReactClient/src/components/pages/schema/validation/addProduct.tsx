import * as Yup from "yup";
import { COUNTRY_LIST } from "../../../utils/constants/countryList";

// Validation schema here ...

export const validationSchema = Yup.object({
    product_name: Yup.string()
        .max(20, "Product name cannot exceed 100 characters")
        .required("Product name is required"),
    product_type: Yup.string()
        .oneOf(["Simple Product", "Bundled Product"])
        .required("Product type is required"),
    short_description: Yup.string()
        .test(
            "max-words",
            "Short description cannot exceed 50 words",
            (value: any) => value?.split(" ")?.length <= 50
        )
        .required("Short description is required"),
    full_description: Yup.string()
        .notRequired()
        .test(
            "max-words",
            "Full description cannot exceed 300 words",

            (value: any) => {
                if (!value) {
                    return true;
                }
                return value?.split(" ")?.length <= 300;
            }
        ),
    product_condition: Yup.string()
        .oneOf(["New", "Used", "Refurbished"])
        .required("Product condition is required"),
    country_of_origin: Yup.string().oneOf(COUNTRY_LIST),
    product_tags: Yup.string().test(
        "valid-tags",
        "Tags should be separated by commas with no extra spaces, and you can specify up to 10 tags",
        (value) => {
            // Check for spaces around commas and ensure the tag count is <= 10
            if (!value) return true; // if value is empty, it's valid

            // Check for valid format
            const hasInvalidSeparator = /[^a-zA-Z0-9\s,]/.test(value);
            const hasSpacesAroundCommas = /,\s|,\s/.test(value);
            const tags = value.split(",").map((tag) => tag.trim());

            return (
                !hasInvalidSeparator &&
                !hasSpacesAroundCommas &&
                tags.length <= 10
            );
        }
    ),
    available_start_date: Yup.date().min(
        new Date(),
        "Available start date cannot be in the past"
    ),
    available_end_date: Yup.date().min(
        Yup.ref("available_start_date"),
        "Available end date should be later than start date"
    ),
    delivery_time: Yup.number()
        .min(0, "Delivery time cannot be negative")
        .max(140, "Delivery time cannot be more than 140 hrs"),
    free_shipping: Yup.boolean(),
    additional_shipping_charge: Yup.number()
        .test(
            "additional-shipping-charge",
            "Additional shipping charge is required when free shipping is not selected",
            function (value) {
                const { free_shipping } = this.parent;
                if (!free_shipping && (value === undefined || value === null)) {
                    return false;
                }
                return true;
            }
        )
        .notRequired()
        .min(1, "Additional Shipping Charge cannot be less than 1")
        .max(140, "Additional Shipping Charge cannot be more than 140 hrs"),
    quantity_unit: Yup.string().oneOf(["gms", "ml", "piece"]),
    stock_quantity: Yup.number()
        .integer()
        .min(0)
        .max(100000)
        .required("Stock quantity is required"),
    minimum_cart_quantity: Yup.number()
        .integer()
        .min(0)
        .lessThan(
            Yup.ref("stock_quantity"),
            "Minimum cart quantity must be less than stock quantity"
        )
        .required("Minimum cart quantity is required"),
    maximum_cart_quantity: Yup.number()
        .integer()
        .min(
            Yup.ref("minimum_cart_quantity"),
            "Max cart quantity should be greater than minimum"
        )
        .lessThan(
            Yup.ref("stock_quantity"),
            "Max cart quantity must be less than stock quantity"
        )
        .required("Maximum cart quantity is required"),
    quantity_step: Yup.number()
        .positive()
        .integer()
        .test(
            "divisible-step",
            "Quantity step should be divisible by minimum ,maximum cart quantity and stock quantity",
            function (value) {
                const {
                    minimum_cart_quantity,
                    maximum_cart_quantity,
                    stock_quantity,
                } = this.parent;
                return value &&
                    minimum_cart_quantity &&
                    maximum_cart_quantity &&
                    stock_quantity
                    ? minimum_cart_quantity % value === 0 &&
                          maximum_cart_quantity % value === 0 &&
                          stock_quantity % value === 0
                    : true;
            }
        )
        .required("Quantity step is required"),
    sale_price: Yup.number()
        .min(0, "Sale price should be positive")
        .required("Sale price is required"),

    mr_price: Yup.number()
        .min(Yup.ref("sale_price"), "MR price should be higher than sale price")
        .required("MR price is required"),
    special_price: Yup.number()
        .max(Yup.ref("mr_price"), "Special price should be less than MR price")
        .notRequired()
        .test(
            "check-special-price",
            "Special price should be less than sale price",
            function (value: any) {
                const { sale_price } = this.parent;
                if (
                    value !== undefined &&
                    sale_price !== undefined &&
                    value > sale_price
                ) {
                    return false;
                }
                return true;
            }
        ),

    special_price_from: Yup.lazy((value, context) => {
        const special_price = context.parent.special_price;
        if (special_price !== undefined) {
            return Yup.date()
                .required("Special price start date is required")
                .test(
                    "check-special-price-from-date",
                    "Special price start date cannot be in the past",
                    function (value) {
                        const now = new Date();
                        if (value && value < now) {
                            return false;
                        }
                        return true;
                    }
                );
        }
        return Yup.date().notRequired();
    }),

    special_price_to: Yup.lazy((value, context) => {
        const special_price = context.parent.special_price;
        if (special_price !== undefined) {
            return Yup.date()
                .required("Special price end date is required")
                .test(
                    "Special price end date should be later than start date",
                    "Special price end date should be later than start date",
                    function (value) {
                        const { special_price_from } = this.parent;
                        if (
                            value &&
                            special_price_from &&
                            value < special_price_from
                        ) {
                            return false;
                        }
                        return true;
                    }
                );
        }
        return Yup.date().notRequired();
    }),

    product_cost: Yup.number()
        .max(Yup.ref("mr_price"), "Product cost should be less than MR price")
        .lessThan(
            Yup.ref("sale_price"),
            "Product cost should be less than sale price"
        )
        .required("Product cost is required"),
    disable_buy_button: Yup.boolean(),
    base_price_calculation: Yup.string().oneOf(["gms", "ml", "piece"]),
    main_image_for_main_page: Yup.string().url(
        "Invalid URL format for main image"
    ),
    product_image_for_product_page: Yup.string().url(
        "Invalid URL format for product image"
    ),
    published: Yup.boolean(),
});
