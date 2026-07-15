import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { initFirebaseAdmin } from "./config/firebaseAdmin";
import authRoutes from "./routes/auth.routes";
import packageRoutes from "./routes/package.routes";

dotenv.config();
initFirebaseAdmin();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("TourNest API is running");
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
