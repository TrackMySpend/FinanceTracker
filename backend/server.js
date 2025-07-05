require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http"); // ⬅️ Needed for socket.io
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const splitBillRoutes = require("./routes/splitBillRoutes");
const settlementRoutes = require("./routes/settlementRoutes");

const app = express();
const server = http.createServer(app); // ⬅️ Create HTTP server

// ✅ Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Attach io to app so controllers can use it
app.set("io", io);

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
connectDB();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/reminders", reminderRoutes);
app.use("/api/v1/splitbills", splitBillRoutes);
app.use("/api/v1/settlements", settlementRoutes);

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
