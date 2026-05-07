const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  "http://localhost:3000/api";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");
const TOKEN_KEY = "recipe_token";

export type UserRole = "admin" | "user";

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
  role: UserRole;
  profileImage?: string;
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

export interface AdminRecipeInput {
  recipeName: string;
  category: string;
  ingredients: string[];
  cookingTimeMinutes: number;
  instructions: string;
  caloriesPerServing: number;
  imageFile?: File | null;
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function buildAuthHeaders(extraHeaders?: HeadersInit): Headers {
  const headers = new Headers(extraHeaders);
  const token = getStoredToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  const bodyText = await res.text();

  let data: any = null;
  if (bodyText) {
    if (!contentType.includes("application/json")) {
      throw new Error(
        `Expected JSON from ${url}, but got ${contentType || "non-JSON response"}. ` +
        "Ensure backend is running on http://localhost:3000 and frontend uses Vite dev proxy."
      );
    }

    try {
      data = JSON.parse(bodyText);
    } catch {
      throw new Error(`Invalid JSON response from ${url}`);
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data as T;
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(path, init);
}

function buildRecipeFormData(input: AdminRecipeInput) {
  const formData = new FormData();
  formData.set("recipeName", input.recipeName);
  formData.set("category", input.category);
  formData.set("ingredients", JSON.stringify(input.ingredients));
  formData.set("cookingTimeMinutes", String(input.cookingTimeMinutes));
  formData.set("instructions", input.instructions);
  formData.set("caloriesPerServing", String(input.caloriesPerServing));

  if (input.imageFile) {
    formData.set("image", input.imageFile);
  }

  return formData;
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
  maxCalories?: number,
  page = 1,
  limit = 1000
): Promise<PaginatedRecipes> {
  let url = `/recipes?page=${page}&limit=${limit}`;
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

export async function toggleFavorite(
  recipeId: string
): Promise<{ favorites: string[] }> {
  return requestJson<{ favorites: string[] }>(`/recipes/${recipeId}/favorite`, {
    method: "POST",
    headers: buildAuthHeaders(),
  });
}

export async function getFavorites(): Promise<Recipe[]> {
  const data = await requestJson<{ recipes: Recipe[] }>(`/recipes/user/favorites`, {
    headers: buildAuthHeaders(),
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

export async function updateProfile(input: {
  name: string;
  email: string;
}): Promise<User> {
  const data = await requestJson<{ user: User }>("/auth/profile", {
    method: "PUT",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(input),
  });
  return data.user;
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await requestJson<{ message: string }>("/auth/password", {
    method: "PUT",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(input),
  });
}

export async function uploadProfileImage(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("image", file);

  const data = await requestJson<{ user: User }>("/auth/profile-image", {
    method: "POST",
    headers: buildAuthHeaders(),
    body: formData,
  });
  return data.user;
}

export async function getCurrentUser(): Promise<User> {
  const data = await requestJson<{ user: User }>("/auth/me", {
    headers: buildAuthHeaders(),
  });
  return data.user;
}

export async function createRecipe(input: AdminRecipeInput): Promise<Recipe> {
  const data = await requestJson<{ recipe: Recipe }>("/recipes", {
    method: "POST",
    headers: buildAuthHeaders(),
    body: buildRecipeFormData(input),
  });
  return data.recipe;
}

export async function updateRecipe(
  id: string,
  input: AdminRecipeInput
): Promise<Recipe> {
  const data = await requestJson<{ recipe: Recipe }>(`/recipes/${id}`, {
    method: "PUT",
    headers: buildAuthHeaders(),
    body: buildRecipeFormData(input),
  });
  return data.recipe;
}

export async function deleteRecipe(id: string): Promise<void> {
  await requestJson<{ success: boolean }>(`/recipes/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(),
  });
}

export function getRecipeImageUrl(imageName: string): string {
  const cleanName = imageName?.trim();
  if (!cleanName) {
    return "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800&h=600&text=Recipe";
  }

  if (cleanName.startsWith("http://") || cleanName.startsWith("https://")) {
    return cleanName;
  }

  return `${API_ORIGIN}/recipe_images/${encodeURIComponent(cleanName)}`;
}

