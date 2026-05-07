export interface RecipeResponse {
  _id: string;
  recipeName: string;
  category: string;
  ingredients: string[];
  cookingTimeMinutes: number;
  instructions: string;
  caloriesPerServing: number;
  imageName: string;
}

export function deriveImageName(doc: Record<string, any>): string {
  if (doc.imageName) return String(doc.imageName).trim();
  if (doc.image_name) return String(doc.image_name).trim();

  const url = String(doc.imageUrl || doc.image_url || "").trim();
  if (url) {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    const parts = url.split("/");
    return parts[parts.length - 1] || "";
  }

  return "";
}

export function normalizeIngredients(rawIngredients: unknown): string[] {
  if (Array.isArray(rawIngredients)) {
    return rawIngredients
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return String(rawIngredients ?? "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseIngredientsInput(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  const raw = String(value ?? "").trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch {
    // Fall back to splitting user-entered text.
  }

  return raw
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeIngredients(ingredients: string[]): string {
  return ingredients
    .map((item) => item.trim())
    .filter(Boolean)
    .join("; ");
}

export function toRecipeResponse(doc: Record<string, any>): RecipeResponse {
  return {
    _id: String(doc._id),
    recipeName: doc.recipeName ?? doc.recipe_name ?? "",
    category: doc.category ?? "",
    ingredients: normalizeIngredients(doc.ingredients ?? doc.ingredients_list ?? []),
    cookingTimeMinutes:
      Number(doc.cookingTimeMinutes ?? doc.cooking_time_minutes ?? 0) || 0,
    instructions: doc.instructions ?? "",
    caloriesPerServing:
      Number(doc.caloriesPerServing ?? doc.calories_per_serving ?? 0) || 0,
    imageName: deriveImageName(doc),
  };
}
