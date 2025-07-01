require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

// ✅ NEW routes for split bill
const splitBillRoutes = require("./routes/splitBillRoutes");
const settlementRoutes = require("./routes/settlementRoutes");

const app = express();

// CORS setup
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// JSON middleware
app.use(express.json());

// Database connection
connectDB();

// Route middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/reminders", reminderRoutes);

// ✅ Add these two lines
app.use("/api/v1/splitbills", splitBillRoutes);
app.use("/api/v1/settlements", settlementRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
