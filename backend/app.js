const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./route/userRoutes");
const vendorRoutes = require("./route/vendorRoutes");
const productRoutes = require("./route/productRoutes");
const authRoutes = require("./route/authRoutes");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const testRoutes = require("./route/testRoutes");
const checkTokenBlacklist = require("./middleware/checkTokenBlacklist");

dotenv.config();
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use("/api/test", testRoutes);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); // Ensure this line is correct

// Error Handling Middleware

app.use(checkTokenBlacklist);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
