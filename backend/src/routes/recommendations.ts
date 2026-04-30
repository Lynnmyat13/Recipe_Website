import { Router, Request, Response } from "express";
import Recipe from "../models/Recipe";

const router = Router();

type RecommendationRecipe = {
  _id: string;
  recipeName: string;
  category: string;
  ingredients: string[];
  cookingTimeMinutes: number;
  instructions: string;
  caloriesPerServing: number;
  imageName: string;
  tokens: Set<string>;
};

const STOP_WORDS = new Set([
  "the", "and", "or", "with", "to", "of", "a", "an", "for", "in", "on", "at", "from", "your", "our", "this", "that",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9+]+/i)
      .map((token) => token.trim())
      .filter((token) => token.length > 1 && !STOP_WORDS.has(token))
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const limitParam = Number(req.query.limit ?? 5);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 20) : 5;

    // Fetch recipes from MongoDB
    const recipeDocs = await Recipe.find().lean();

    const recipes: RecommendationRecipe[] = recipeDocs.map((doc: any) => {
      const rawIngredients = doc.ingredients ?? doc.ingredients_list ?? "";
      const ingredientsArray = Array.isArray(rawIngredients)
        ? rawIngredients
        : String(rawIngredients)
            .split(";")
            .map((item) => item.trim())
            .filter(Boolean);

      const combinedText = [
        doc.recipe_name || doc.recipeName,
        doc.category,
        ingredientsArray.join(" "),
        doc.instructions,
      ].filter(Boolean).join(" ");

      // Correctly derive image name or URL
      let imageName = (doc.imageName || doc.image_name || "").trim();
      if (!imageName) {
        const url = (doc.imageUrl || doc.image_url || "").trim();
        if (url) {
          imageName = (url.startsWith("http://") || url.startsWith("https://"))
            ? url
            : (url.split("/").pop() || "");
        }
      }

      return {
        _id: String(doc._id),
        recipeName: doc.recipe_name || doc.recipeName || "",
        category: doc.category || "",
        ingredients: ingredientsArray,
        cookingTimeMinutes: Number(doc.cooking_time_minutes || doc.cookingTimeMinutes) || 0,
        instructions: doc.instructions || "",
        caloriesPerServing: Number(doc.calories_per_serving || doc.caloriesPerServing) || 0,
        imageName: imageName,
        tokens: tokenize(combinedText),
      };
    });

    if (!q || typeof q !== "string" || !q.trim()) {
      res.json({ recommendations: recipes.slice(0, limit) });
      return;
    }

    const queryTokens = tokenize(q);
    const scored = recipes
      .map((recipe) => {
        const baseScore = jaccardSimilarity(queryTokens, recipe.tokens);
        const categoryToken = recipe.category.toLowerCase();
        const hasCategoryInQuery = queryTokens.has(categoryToken);
        const categoryBonus = hasCategoryInQuery ? 0.05 : 0;

        let timeBonus = 0;
        if (queryTokens.has("quick") && recipe.cookingTimeMinutes <= 30) {
          timeBonus = 0.05;
        }

        const score = baseScore + categoryBonus + timeBonus;
        return { recipe, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => {
        // Remove tokens before sending to client
        const { tokens, ...rest } = item.recipe;
        return rest;
      });

    res.json({ recommendations: scored });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to compute recipe recommendations" });
  }
});

export default router;
