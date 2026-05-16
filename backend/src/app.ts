import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import laporanRoutes from "./routes/laporanRoutes";
import { upload } from "./middleware/uploadMiddleware";
import adminRoutes from "./routes/adminRoutes";
import commentRoutes from "./routes/commentRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/comment", commentRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/admin", adminRoutes);



app.listen(3000, () => {
  console.log("Server running 🚀");
});