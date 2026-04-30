import { Router, Request, Response } from "express";
import Recipe from "../models/Recipe";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lowerMessage = message.toLowerCase();

    // Improved stop words list
    const stopWords = new Set(["give", "some", "recipes", "recipe", "please", "find", "show", "me", "want", "for", "with", "and", "the", "under", "minutes", "minute", "few", "a", "of", "in", "to", "any"]);

    // Keyword extraction
    const words = lowerMessage.split(/\s+/).filter((w: string) => w.length > 2 && !stopWords.has(w));

    // Smart filtering logic
    const filters: any = {};
    const isHealthy = lowerMessage.includes("healthy") || lowerMessage.includes("low calorie");
    const isQuick = lowerMessage.includes("quick") || lowerMessage.includes("fast") || lowerMessage.includes("minutes") || lowerMessage.includes("minute") || lowerMessage.includes("few");

    if (isHealthy) filters.calories_per_serving = { $lt: 500 };
    if (isQuick) filters.cooking_time_minutes = { $lt: 30 };

    const categories = ["breakfast", "lunch", "dinner", "dessert", "snack", "appetizer", "salad", "soup", "curry", "pasta", "seafood", "chicken", "vegetarian", "beverage", "rice"];
    const foundCategory = categories.find(cat => lowerMessage.includes(cat));
    if (foundCategory) {
      filters.category = { $regex: new RegExp(foundCategory, "i") };
    }

    // Keyword matching logic
    const keywords = words.filter((w: string) => !["healthy", "quick", "fast"].includes(w));

    let query: any = { ...filters };
    if (keywords.length > 0) {
      const searchTerms = keywords.filter((kw: string) => !categories.includes(kw) || keywords.length === 1);

      if (searchTerms.length > 0) {
        query.$or = searchTerms.flatMap((kw: string) => [
          { recipe_name: { $regex: kw, $options: "i" } },
          { ingredients: { $regex: kw, $options: "i" } }
        ]);
      }
    }

    let recipes = await Recipe.find(query).limit(20).lean();

    // Fallback: If no results found with keywords + filters, try just filters or just keywords
    if (recipes.length === 0 && Object.keys(filters).length > 0 && keywords.length > 0) {
      // Try just filters
      recipes = await Recipe.find(filters).limit(20).lean();
    }

    if (recipes.length === 0 && keywords.length > 0) {
      // Try just keywords
      const keywordOnlyQuery = {
        $or: keywords.flatMap((kw: string) => [
          { recipe_name: { $regex: kw, $options: "i" } },
          { ingredients: { $regex: kw, $options: "i" } }
        ])
      };
      recipes = await Recipe.find(keywordOnlyQuery).limit(20).lean();
    }

    // Ranking system
    const scoredRecipes = recipes.map(recipe => {
      let score = 0;
      keywords.forEach((kw: string | RegExp) => {
        const regex = new RegExp(kw, "i");
        if (regex.test(recipe.recipe_name)) score += 2;
        if (regex.test(recipe.ingredients)) score += 1;
        if (regex.test(recipe.category)) score += 1;
      });
      return { ...recipe, score };
    });

    // Sort by score and take top 5
    const topRecipes = scoredRecipes
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(r => ({
        recipe_name: r.recipe_name,
        cooking_time_minutes: r.cooking_time_minutes,
        calories_per_serving: r.calories_per_serving,
        image_url: r.imageName, // imageName contains the full URL in this DB
        category: r.category
      }));

    let botMessage = "I found some recipes for you!";
    if (topRecipes.length === 0) {
      botMessage = "I couldn't find any recipes matching your request. Try different keywords!";
    }

    res.json({
      message: botMessage,
      recipes: topRecipes
    });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
