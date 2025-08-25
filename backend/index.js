import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import machineRoutes from "./routes/machineRoutes.js";
import { notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

// DB Connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/machines", machineRoutes);

// Error Handling
app.use(notFound);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
