const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  "http://localhost:3000/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

export type ChatRecipe = {
  recipe_name: string;
  cooking_time_minutes: number;
  calories_per_serving: number;
  image_url: string;
  category: string;
};

export type ChatResponse = {
  message: string;
  recipes: ChatRecipe[];
};

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Recipe {
  _id: string;
  recipeName: string;
  category: string;
  ingredients: string[];
  cookingTimeMinutes: number;
  instructions: string;
  caloriesPerServing: number;
  imageName: string;
}

export interface PaginatedRecipes {
  recipes: Recipe[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  const bodyText = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON from ${url}, but got ${contentType || "non-JSON response"}. ` +
      "Ensure backend is running on http://localhost:3000 and frontend uses Vite dev proxy."
    );
  }

  let data: any;
  try {
    data = JSON.parse(bodyText);
  } catch {
    throw new Error(`Invalid JSON response from ${url}`);
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data as T;
}

export const api = {
  chat: (message: string) =>
    requestJson<ChatResponse>("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }),
};

export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  return requestJson<AuthResponse>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return requestJson<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function getRecipes(
  search = "",
  category = "",
  ingredients = "",
  maxTime?: number,
  maxCalories?: number
): Promise<PaginatedRecipes> {
  let url = `/recipes?limit=1000`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }
  if (ingredients) {
    url += `&ingredients=${encodeURIComponent(ingredients)}`;
  }
  if (maxTime) {
    url += `&maxTime=${maxTime}`;
  }
  if (maxCalories) {
    url += `&maxCalories=${maxCalories}`;
  }
  return requestJson<PaginatedRecipes>(url);
}

const TOKEN_KEY = "recipe_token";

export async function toggleFavorite(recipeId: string): Promise<{ favorites: string[] }> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Authentication required");

  return requestJson<{ favorites: string[] }>(`/recipes/${recipeId}/favorite`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

export async function getFavorites(): Promise<Recipe[]> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Authentication required");

  const data = await requestJson<{ recipes: Recipe[] }>(`/recipes/user/favorites`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return data.recipes;
}

export async function getRecommendations(
  query = "",
  limit = 5
): Promise<{ recommendations: Recipe[] }> {
  let url = `/recommendations?limit=${limit}`;
  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }
  return requestJson<{ recommendations: Recipe[] }>(url);
}

export async function getRecipeById(id: string): Promise<Recipe> {
  const data = await requestJson<{ recipe: Recipe }>(`/recipes/${id}`);
  return data.recipe;
}

export function getRecipeImageUrl(imageName: string): string {
  const cleanName = imageName?.trim();
  if (!cleanName) {
    return "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800&h=600&text=Recipe";
  }

  // If it's already a full URL, return it
  if (cleanName.startsWith("http://") || cleanName.startsWith("https://")) {
    return cleanName;
  }

  return `${API_ORIGIN}/recipe_images/${encodeURIComponent(cleanName)}`;
}
