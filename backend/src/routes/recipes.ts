import { Router, Request, Response } from "express";
import multer from "multer";
import mongoose from "mongoose";
import Recipe from "../models/Recipe";
import User from "../models/User";
import {
  authenticate,
  authorizeAdmin,
  type AuthenticatedRequest,
} from "../middleware/auth";
import {
  parseIngredientsInput,
  serializeIngredients,
  toRecipeResponse,
} from "../lib/recipes";
import { deleteRecipeImage, uploadRecipeImage } from "../lib/supabase";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

type RecipePayload = {
  recipeName: string;
  category: string;
  ingredients: string[];
  cookingTimeMinutes: number;
  instructions: string;
  caloriesPerServing: number;
};

function buildRecipeFilter(req: Request) {
  const category = (req.query.category as string | undefined)?.trim();
  const search = (req.query.search as string | undefined)?.trim();
  const ingredients = (req.query.ingredients as string | undefined)?.trim();
  const maxTime = Number(req.query.maxTime);
  const maxCalories = Number(req.query.maxCalories);

  const filter: Record<string, any> = {};

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
    const ingredientList = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (ingredientList.length > 0) {
      filter.ingredients = {
        $all: ingredientList.map((item) => new RegExp(item, "i")),
      };
    }
  }

  if (Number.isFinite(maxTime) && maxTime > 0) {
    filter.cooking_time_minutes = { $lte: maxTime };
  }

  if (Number.isFinite(maxCalories) && maxCalories > 0) {
    filter.calories_per_serving = { $lte: maxCalories };
  }

  return filter;
}

function validateRecipePayload(body: Record<string, any>): RecipePayload {
  const recipeName = String(body.recipeName ?? "").trim();
  const category = String(body.category ?? "").trim();
  const ingredients = parseIngredientsInput(body.ingredients);
  const cookingTimeMinutes = Number(body.cookingTimeMinutes);
  const instructions = String(body.instructions ?? "").trim();
  const caloriesPerServing = Number(body.caloriesPerServing);

  if (!recipeName || !category || !instructions || ingredients.length === 0) {
    throw new Error("Recipe name, category, ingredients, and instructions are required");
  }

  if (!Number.isFinite(cookingTimeMinutes) || cookingTimeMinutes <= 0) {
    throw new Error("Cooking time must be a positive number");
  }

  if (!Number.isFinite(caloriesPerServing) || caloriesPerServing < 0) {
    throw new Error("Calories per serving must be zero or greater");
  }

  return {
    recipeName,
    category,
    ingredients,
    cookingTimeMinutes,
    instructions,
    caloriesPerServing,
  };
}

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limitParam = req.query.limit ? Number(req.query.limit) : 1000;
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), 5000)
      : 1000;
    const skip = (page - 1) * limit;

    const filter = buildRecipeFilter(req);
    const totalCount = await Recipe.countDocuments(filter);
    const recipeDocs = await Recipe.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      recipes: recipeDocs.map((doc) => toRecipeResponse(doc)),
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = validateRecipePayload(req.body);
      let imageName = "";

      if (req.file) {
        imageName = await uploadRecipeImage(req.file);
      }

      const recipe = await Recipe.create({
        recipe_name: payload.recipeName,
        category: payload.category,
        ingredients: serializeIngredients(payload.ingredients),
        cooking_time_minutes: payload.cookingTimeMinutes,
        instructions: payload.instructions,
        calories_per_serving: payload.caloriesPerServing,
        imageName,
      });

      res.status(201).json({ recipe: toRecipeResponse(recipe.toObject()) });
    } catch (error) {
      console.error(error);

      if (error instanceof multer.MulterError) {
        res.status(400).json({ error: error.message });
        return;
      }

      if (error instanceof Error) {
        const duplicateKeyError = error.message.includes("duplicate key");
        res.status(duplicateKeyError ? 409 : 400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: "Failed to create recipe" });
    }
  }
);

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await Recipe.findById(req.params.id).lean();
    if (!doc) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    res.json({ recipe: toRecipeResponse(doc) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = validateRecipePayload(req.body);
      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }

      if (req.file) {
        const previousImage = recipe.imageName || "";
        recipe.imageName = await uploadRecipeImage(req.file);

        if (previousImage) {
          try {
            await deleteRecipeImage(previousImage);
          } catch (cleanupError) {
            console.error(cleanupError);
          }
        }
      }

      recipe.recipe_name = payload.recipeName;
      recipe.category = payload.category;
      recipe.ingredients = serializeIngredients(payload.ingredients);
      recipe.cooking_time_minutes = payload.cookingTimeMinutes;
      recipe.instructions = payload.instructions;
      recipe.calories_per_serving = payload.caloriesPerServing;

      await recipe.save();

      res.json({ recipe: toRecipeResponse(recipe.toObject()) });
    } catch (error) {
      console.error(error);

      if (error instanceof multer.MulterError) {
        res.status(400).json({ error: error.message });
        return;
      }

      if (error instanceof Error) {
        const duplicateKeyError = error.message.includes("duplicate key");
        res.status(duplicateKeyError ? 409 : 400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: "Failed to update recipe" });
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }

      const imageReference = recipe.imageName || "";

      await Recipe.findByIdAndDelete(req.params.id);

      if (imageReference) {
        try {
          await deleteRecipeImage(imageReference);
        } catch (cleanupError) {
          console.error(cleanupError);
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete recipe" });
    }
  }
);

router.post(
  "/:id/favorite",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const recipeId = String(req.params.id);

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
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
  }
);

router.get(
  "/user/favorites",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as AuthenticatedRequest).userId;
      const user = await User.findById(userId).populate("favorites");
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const recipes = (user.favorites as Record<string, any>[]).map((doc) =>
        toRecipeResponse(doc)
      );

      res.json({ recipes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  }
);

export default router;
