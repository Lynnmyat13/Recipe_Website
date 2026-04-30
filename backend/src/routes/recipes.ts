import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Recipe from "../models/Recipe";
import User from "../models/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = payload.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

function deriveImageName(doc: any): string {
  if (doc.imageName) return String(doc.imageName).trim();
  if (doc.image_name) return String(doc.image_name).trim();

  const url = (doc.imageUrl || doc.image_url || "").trim();
  if (url) {
    // If it's a full URL, return it as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Otherwise, try to get the last part (filename)
    const parts = url.split("/");
    return parts[parts.length - 1] || "";
  }
  return "";
}

router.get("/", async (req: Request, res: Response): Promise<void> => {
  console.log("GET /api/recipes called with query:", req.query);
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limitParam = req.query.limit ? Number(req.query.limit) : 1000;
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), 5000)
      : 1000;
    const skip = (page - 1) * limit;

    const category = (req.query.category as string | undefined)?.trim();
    const search = (req.query.search as string | undefined)?.trim();
    const ingredients = (req.query.ingredients as string | undefined)?.trim();
    const maxTime = Number(req.query.maxTime);
    const maxCalories = Number(req.query.maxCalories);

    const filter: any = {};
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }
    if (search) {
      filter.$or = [
        { recipe_name: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
        { instructions: { $regex: search, $options: "i" } },
      ];
    }
    if (ingredients) {
      const ingredientList = ingredients.split(',').map(i => i.trim()).filter(Boolean);
      if (ingredientList.length > 0) {
        filter.ingredients = { $all: ingredientList.map(i => new RegExp(i, 'i')) };
      }
    }
    if (Number.isFinite(maxTime) && maxTime > 0) {
      filter.cooking_time_minutes = { $lte: maxTime };
    }
    if (Number.isFinite(maxCalories) && maxCalories > 0) {
      filter.calories_per_serving = { $lte: maxCalories };
    }

    const totalCount = await Recipe.countDocuments(filter);
    const recipeDocs = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const recipes = recipeDocs.map((doc: any) => {
      const rawIngredients = doc.ingredients ?? doc.ingredients_list ?? [];
      const ingredients = Array.isArray(rawIngredients)
        ? rawIngredients
        : String(rawIngredients)
          .split(";")
          .map((item) => item.trim())
          .filter(Boolean);

      return {
        _id: String(doc._id),
        recipeName: doc.recipeName ?? doc.recipe_name ?? "",
        category: doc.category ?? "",
        ingredients,
        cookingTimeMinutes:
          Number(doc.cookingTimeMinutes ?? doc.cooking_time_minutes ?? 0) || 0,
        instructions: doc.instructions ?? "",
        caloriesPerServing:
          Number(doc.caloriesPerServing ?? doc.calories_per_serving ?? 0) || 0,
        imageName: deriveImageName(doc),
      };
    });

    res.json({
      recipes,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(totalCount / limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const doc: any = await Recipe.findById(req.params.id).lean();
    if (!doc) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    const rawIngredients = doc.ingredients ?? doc.ingredients_list ?? [];
    const ingredients = Array.isArray(rawIngredients)
      ? rawIngredients
      : String(rawIngredients)
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean);

    const recipe = {
      _id: String(doc._id),
      recipeName: doc.recipeName ?? doc.recipe_name ?? "",
      category: doc.category ?? "",
      ingredients,
      cookingTimeMinutes:
        Number(doc.cookingTimeMinutes ?? doc.cooking_time_minutes ?? 0) || 0,
      instructions: doc.instructions ?? "",
      caloriesPerServing:
        Number(doc.caloriesPerServing ?? doc.calories_per_serving ?? 0) || 0,
      imageName: deriveImageName(doc),
    };

    res.json({ recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// POST /api/recipes/:id/favorite - Toggle favorite
router.post("/:id/favorite", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const recipeId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const recipeObjectId = new (require("mongoose").Types.ObjectId)(recipeId);
    const index = user.favorites.indexOf(recipeObjectId);

    if (index === -1) {
      user.favorites.push(recipeObjectId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
});

// GET /api/recipes/favorites - Get user's favorites
router.get("/user/favorites", authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const recipes = (user.favorites as any[]).map((doc: any) => ({
      _id: String(doc._id),
      recipeName: doc.recipeName ?? doc.recipe_name ?? "",
      category: doc.category ?? "",
      ingredients: doc.ingredients ?? [],
      cookingTimeMinutes: Number(doc.cookingTimeMinutes ?? 0),
      instructions: doc.instructions ?? "",
      caloriesPerServing: Number(doc.caloriesPerServing ?? 0),
      imageName: deriveImageName(doc),
    }));

    res.json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

export default router;
