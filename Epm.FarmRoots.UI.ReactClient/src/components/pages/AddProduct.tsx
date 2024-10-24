import React, { Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { validationSchema } from "./schema/validation/addProduct";
import { addProduct } from "../utils/products";
import { AppDispatch } from "../utils/store";
import { useNavigate } from "react-router-dom";
import { COUNTRY_LIST } from "../utils/constants/countryList";
import InputField from "../common/vendor/InputField";
import SelectField from "../common/vendor/selectField";
import TextAreaField from "../common/vendor/TextAreaField";
import CheckboxField from "../common/vendor/CheckboxField";
import "../../index.css";

const TopBar = lazy(() => import("./TopBar"));

const AddProduct: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const formik = useFormik({
        initialValues: {
            product_name: "",
            product_type: "",
            short_description: "",
            full_description: "",
            product_condition: "",
            country_of_origin: "",
            product_tags: "",
            available_start_date: "",
            available_end_date: "",
            delivery_time: 0,
            free_shipping: false,
            additional_shipping_charge: 0,
            quantity_unit: "",
            stock_quantity: 0,
            minimum_cart_quantity: 0,
            maximum_cart_quantity: 0,
            quantity_step: 0,
            sale_price: 0,
            mr_price: 0,
            special_price: 0,
            special_price_from: "",
            special_price_to: "",
            product_cost: 0,
            disable_buy_button: false,
            base_price_calculation: "",
            main_image_for_main_page: "",
            product_image_for_product_page: "",
            published: false,
        },
        validationSchema,
        onSubmit: (values) => {
            const validateFields = (values: any) => {
                const requiredFields = [
                    "product_name",
                    "product_type",
                    "short_description",
                    "product_condition",
                    "product_tags",
                    "stock_quantity",
                    "minimum_cart_quantity",
                    "maximum_cart_quantity",
                    "quantity_step",
                    "sale_price",
                    "mr_price",
                    "product_cost",
                    "disable_buy_button",
                    "published"
                ];

                const missingFields = requiredFields.filter(
                    (field) => !values[field] && values[field] !== false
                );

                if (missingFields.length > 0) {
                    return missingFields;
                }
                return null;
            };

            const missingFields = validateFields(values);

            if (missingFields) {
                alert(`Missing required fields: ${missingFields.join(", ")}`);
                return;
            }

            const tagsArray = values.product_tags
                .split(",")
                .map((tag) => tag.trim());

            const product:any = {
                product_name: values.product_name,
                product_type: values.product_type,
                short_description: values.short_description,
                full_description: values.full_description,
                product_condition: values.product_condition,
                country_of_origin: values.country_of_origin,
                product_tags: tagsArray,
                available_start_date: values.available_start_date,
                available_end_date: values.available_end_date,
                delivery_time: values.delivery_time,
                free_shipping: values.free_shipping,
                additional_shipping_charge: values.additional_shipping_charge,
                quantity_unit: values.quantity_unit,
                inventory: {
                    stock_quantity: values.stock_quantity,
                    minimum_cart_quantity: values.minimum_cart_quantity,
                    maximum_cart_quantity: values.maximum_cart_quantity,
                    quantity_step: values.quantity_step,
                },
                price: {
                    sale_price: values.sale_price,
                    mr_price: values.mr_price,
                    special_price: values.special_price,
                    special_price_from: values.special_price_from,
                    special_price_to: values.special_price_to,
                    product_cost: values.product_cost,
                },
                disable_buy_button: values.disable_buy_button,
                base_price_calculation: values.base_price_calculation,
                image: {
                    main_image_for_main_page: values.main_image_for_main_page,
                    product_image_for_product_page:
                        values.product_image_for_product_page,
                },
                published: values.published,
            };

            console.log(product);
            dispatch(addProduct(product));
            navigate('/my-products')
        }
    });

    const handleBasePriceCalculationChange = (event: any) => {
        const value = event.target.value;
        formik.setFieldValue("base_price_calculation", value);
        formik.setFieldValue("quantity_unit", value);
    };

    const handleQuantityUnitChange = (event: any) => {
        const value = event.target.value;
        formik.setFieldValue("quantity_unit", value);
        formik.setFieldValue("base_price_calculation", value);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="bg-gray-800 p-4 text-white fixed">
                {/* Sidebar content here */}
            </div>
            <div className="md:ml-64 mt-12 w-full">
                <Suspense fallback={<div>Loading...</div>}>
                    <TopBar />
                </Suspense>
                <div className="mt-12 p-2">
                    <h1 className="text-2xl font-bold mb-6">Add Product</h1>
                    <form
                        onSubmit={formik.handleSubmit}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                name="product_name"
                                label="Product Name"
                                field={formik.getFieldProps("product_name")}
                                meta={formik.getFieldMeta("product_name")}
                            />
                            <SelectField
                                name="product_type"
                                label="Product Type"
                                field={formik.getFieldProps("product_type")}
                                meta={formik.getFieldMeta("product_type")}
                                options={[
                                    { value: "Simple Product", label: "Simple Product" },
                                    { value: "Bundled Product", label: "Bundled Product" },
                                ]}
                            />
                            <TextAreaField
                                name="short_description"
                                label="Short Description"
                                field={formik.getFieldProps("short_description")}
                                meta={formik.getFieldMeta("short_description")}
                            />
                            <TextAreaField
                                name="full_description"
                                label="Full Description"
                                rows={4}
                                field={formik.getFieldProps("full_description")}
                                meta={formik.getFieldMeta("full_description")}
                            />
                            <SelectField
                                name="product_condition"
                                label="Product Condition"
                                field={formik.getFieldProps("product_condition")}
                                meta={formik.getFieldMeta("product_condition")}
                                options={[
                                    { value: "New", label: "New" },
                                    { value: "Used", label: "Used" },
                                    { value: "Refurbished", label: "Refurbished" },
                                ]}
                            />
                            <label className="block">
                                <span className="text-gray-700">
                                    Country of Origin
                                </span>
                                <input
                                    type="text"
                                    list="countries"
                                    name="country_of_origin"
                                    value={formik.values.country_of_origin}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                <datalist id="countries">
                                    {COUNTRY_LIST.map((country:any, index:any) => (
                                        <option key={index} value={country} />
                                    ))}
                                </datalist>
                                {formik.touched.country_of_origin &&
                                    formik.errors.country_of_origin && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {formik.errors.country_of_origin}
                                        </div>
                                    )}
                            </label>
                            <InputField
                                name="product_tags"
                                label="Product Tags (comma-separated)"
                                field={formik.getFieldProps("product_tags")}
                                meta={formik.getFieldMeta("product_tags")}
                            />
                            <InputField
                                name="available_start_date"
                                label="Available Start Date"
                                type="date"
                                field={formik.getFieldProps("available_start_date")}
                                meta={formik.getFieldMeta("available_start_date")}
                            />
                            <InputField
                                name="available_end_date"
                                label="Available End Date"
                                type="date"
                                field={formik.getFieldProps("available_end_date")}
                                meta={formik.getFieldMeta("available_end_date")}
                            />
                            
                            <InputField
                                name="delivery_time"
                                label="Delivery Time (in hours)"
                                type="number"
                                field={formik.getFieldProps("delivery_time")}
                                meta={formik.getFieldMeta("delivery_time")}
                            />
                            <CheckboxField
                                name="free_shipping"
                                label="Free Shipping"
                                field={formik.getFieldProps("free_shipping")}
                                meta={formik.getFieldMeta("free_shipping")}
                            />
                            <InputField
                                name="additional_shipping_charge"
                                label="Additional Shipping Charge"
                                type="number"
                                field={formik.getFieldProps("additional_shipping_charge")}
                                meta={formik.getFieldMeta("additional_shipping_charge")}
                                disabled={formik.values.free_shipping}
                            />
                            <SelectField
                                name="quantity_unit"
                                label="Quantity Unit"
                                field={formik.getFieldProps("quantity_unit")}
                                meta={formik.getFieldMeta("quantity_unit")}
                                options={[
                                    { value: "gms", label: "gms" },
                                    { value: "ml", label: "ml" },
                                    { value: "piece", label: "piece" },
                                ]}
                                onChange={handleQuantityUnitChange}
                            />
                            <InputField
                                name="stock_quantity"
                                label="Stock Quantity"
                                type="number"
                                field={formik.getFieldProps("stock_quantity")}
                                meta={formik.getFieldMeta("stock_quantity")}
                            />
                            <InputField
                                name="minimum_cart_quantity"
                                label="Minimum Cart Quantity"
                                type="number"
                                field={formik.getFieldProps("minimum_cart_quantity")}
                                meta={formik.getFieldMeta("minimum_cart_quantity")}
                            />
                            <InputField
                                name="maximum_cart_quantity"
                                label="Maximum Cart Quantity"
                                type="number"
                                field={formik.getFieldProps("maximum_cart_quantity")}
                                meta={formik.getFieldMeta("maximum_cart_quantity")}
                            />
                            <InputField
                                name="quantity_step"
                                label="Quantity Step"
                                type="number"
                                field={formik.getFieldProps("quantity_step")}
                                meta={formik.getFieldMeta("quantity_step")}
                            />
                            <InputField
                                name="sale_price"
                                label="Sale Price"
                                type="number"
                                field={formik.getFieldProps("sale_price")}
                                meta={formik.getFieldMeta("sale_price")}
                            />
                            <InputField
                                name="mr_price"
                                label="MR Price"
                                type="number"
                                field={formik.getFieldProps("mr_price")}
                                meta={formik.getFieldMeta("mr_price")}
                            />
                            <InputField
                                name="special_price"
                                label="Special Price"
                                type="number"
                                field={formik.getFieldProps("special_price")}
                                meta={formik.getFieldMeta("special_price")}
                            />
                            <InputField
                                name="special_price_from"
                                label="Special Price From"
                                type="date"
                                field={formik.getFieldProps("special_price_from")}
                                meta={formik.getFieldMeta("special_price_from")}
                            />
                            <InputField
                                name="special_price_to"
                                label="Special Price To"
                                type="date"
                                field={formik.getFieldProps("special_price_to")}
                                meta={formik.getFieldMeta("special_price_to")}
                            />
                            <InputField
                                name="product_cost"
                                label="Product Cost"
                                type="number"
                                field={formik.getFieldProps("product_cost")}
                                meta={formik.getFieldMeta("product_cost")}
                            />
                            <CheckboxField
                                name="disable_buy_button"
                                label="Disable Buy Button"
                                field={formik.getFieldProps("disable_buy_button")}
                                meta={formik.getFieldMeta("disable_buy_button")}
                            />
                            <SelectField
                                name="base_price_calculation"
                                label="Base Price Calculation"
                                field={formik.getFieldProps("base_price_calculation")}
                                meta={formik.getFieldMeta("base_price_calculation")}
                                options={[
                                    { value: "gms", label: "gms" },
                                    { value: "ml", label: "ml" },
                                    { value: "piece", label: "piece" },
                                ]}
                                onChange={handleBasePriceCalculationChange}
                            />
                            <InputField
                                name="main_image_for_main_page"
                                label="Main Image for Main Page"
                                type="url"
                                field={formik.getFieldProps("main_image_for_main_page")}
                                meta={formik.getFieldMeta("main_image_for_main_page")}
                            />
                            <InputField
                                name="product_image_for_product_page"
                                label="Product Image for Product Page"
                                type="url"
                                field={formik.getFieldProps("product_image_for_product_page")}
                                meta={formik.getFieldMeta("product_image_for_product_page")}
                            />
                            <CheckboxField
                                name="published"
                                label="Publish"
                                field={formik.getFieldProps("published")}
                                meta={formik.getFieldMeta("published")}
                            />
                        </div>

                        <div className="mt-6">
                            <button 
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;