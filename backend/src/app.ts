import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import laporanRoutes from "./routes/laporanRoutes";
import { upload } from "./middleware/uploadMiddleware";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/laporan", laporanRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(3000, () => {
  console.log("Server running 🚀");
});