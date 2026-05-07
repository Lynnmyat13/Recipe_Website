import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim();

function getSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_STORAGE_BUCKET) {
    throw new Error(
      "Supabase storage is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET."
    );
  }

  return {
    url: SUPABASE_URL,
    key: SUPABASE_SERVICE_ROLE_KEY,
    bucket: SUPABASE_STORAGE_BUCKET,
  };
}

function getSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function sanitizeBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "recipe";
}

function getFileExtension(name: string) {
  const parts = name.split(".");
  if (parts.length < 2) return "";
  const extension = parts[parts.length - 1].trim().toLowerCase();
  return extension ? `.${extension}` : "";
}

function buildStoragePath(fileName: string) {
  const baseName = sanitizeBaseName(fileName.replace(/\.[^/.]+$/, ""));
  const extension = getFileExtension(fileName);
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `recipes/${Date.now()}-${baseName}-${randomPart}${extension}`;
}

function getPublicUrl(storagePath: string) {
  const client = getSupabaseClient();
  const { bucket } = getSupabaseConfig();
  const { data } = client.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadRecipeImage(file: Express.Multer.File) {
  const client = getSupabaseClient();
  const { bucket } = getSupabaseConfig();
  const storagePath = buildStoragePath(file.originalname || "recipe-image");

  const { error } = await client.storage.from(bucket).upload(storagePath, file.buffer, {
    contentType: file.mimetype || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }

  return getPublicUrl(storagePath);
}

export function extractStoragePath(imageReference: string) {
  const cleanReference = imageReference.trim();
  if (!cleanReference) return null;

  if (cleanReference.startsWith("recipes/")) {
    return cleanReference;
  }

  if (!SUPABASE_STORAGE_BUCKET) {
    return null;
  }

  const publicMarker = `/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`;

  if (cleanReference.includes(publicMarker)) {
    return cleanReference.split(publicMarker)[1] || null;
  }

  return null;
}

export async function deleteRecipeImage(imageReference: string) {
  const storagePath = extractStoragePath(imageReference);
  if (!storagePath) return;

  const client = getSupabaseClient();
  const { bucket } = getSupabaseConfig();
  const { error } = await client.storage.from(bucket).remove([storagePath]);

  if (error) {
    throw new Error(`Failed to delete Supabase image: ${error.message}`);
  }
}
