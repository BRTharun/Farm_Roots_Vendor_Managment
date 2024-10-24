// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./products";
import userReducer from "./userSlice";
import vendorReducer from "./vendorSlice";
import categoriesReducer from './category';
import subcategoryReducer from "./subcategory";
import subcategoryProductsReducer from "./subcategoryProducts";
import manufacturerReducer from "./manufactue";

const store = configureStore({
    reducer: {
        product: productsReducer,
        user: userReducer,
        vendor: vendorReducer,
        categories: categoriesReducer,
        subcategories: subcategoryReducer,
        subcategoryProducts: subcategoryProductsReducer,
        manufacturers:manufacturerReducer
    },
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
