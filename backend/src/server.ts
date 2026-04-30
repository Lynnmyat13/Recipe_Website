import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "./routes/auth";
import recipesRoutes from "./routes/recipes";
import recommendationsRoutes from "./routes/recommendations";
import chatRoutes from "./routes/chat";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const recipeImagesDir = path.join(process.cwd(), "src", "recipe_images");
app.use("/recipe_images", express.static(recipeImagesDir));

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/recipe_web";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Recipe API - Pagination Enabled" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/chat", chatRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
