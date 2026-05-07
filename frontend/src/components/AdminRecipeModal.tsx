import { useEffect, useMemo, useState } from "react";
import {
  getRecipeImageUrl,
  type AdminRecipeInput,
  type Recipe,
} from "../lib/api";

type AdminRecipeModalProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  recipe: Recipe | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: AdminRecipeInput) => Promise<void>;
};

type FormState = {
  recipeName: string;
  category: string;
  ingredientsText: string;
  cookingTimeMinutes: string;
  instructions: string;
  caloriesPerServing: string;
  imageFile: File | null;
};

const EMPTY_FORM: FormState = {
  recipeName: "",
  category: "",
  ingredientsText: "",
  cookingTimeMinutes: "",
  instructions: "",
  caloriesPerServing: "",
  imageFile: null,
};

function createFormState(recipe: Recipe | null): FormState {
  if (!recipe) return EMPTY_FORM;

  return {
    recipeName: recipe.recipeName,
    category: recipe.category,
    ingredientsText: recipe.ingredients.join("\n"),
    cookingTimeMinutes: String(recipe.cookingTimeMinutes),
    instructions: recipe.instructions,
    caloriesPerServing: String(recipe.caloriesPerServing),
    imageFile: null,
  };
}

export default function AdminRecipeModal({
  isOpen,
  mode,
  recipe,
  submitting,
  error,
  onClose,
  onSubmit,
}: AdminRecipeModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setForm(createFormState(recipe));
    setValidationError(null);
  }, [isOpen, recipe]);

  const previewUrl = useMemo(() => {
    if (form.imageFile) {
      return URL.createObjectURL(form.imageFile);
    }

    if (recipe?.imageName) {
      return getRecipeImageUrl(recipe.imageName);
    }

    return "";
  }, [form.imageFile, recipe?.imageName]);

  useEffect(() => {
    return () => {
      if (form.imageFile && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [form.imageFile, previewUrl]);

  if (!isOpen) return null;

  const handleChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }) as FormState);
  };

  const handleImageSelection = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setValidationError("Please upload an image file.");
      return;
    }

    setValidationError(null);
    handleChange("imageFile", file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    handleImageSelection(event.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    const ingredients = form.ingredientsText
      .split(/\r?\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (
      !form.recipeName.trim() ||
      !form.category.trim() ||
      !form.instructions.trim() ||
      ingredients.length === 0
    ) {
      setValidationError(
        "Recipe name, category, ingredients, and instructions are required."
      );
      return;
    }

    const cookingTimeMinutes = Number(form.cookingTimeMinutes);
    const caloriesPerServing = Number(form.caloriesPerServing);

    if (!Number.isFinite(cookingTimeMinutes) || cookingTimeMinutes <= 0) {
      setValidationError("Cooking time must be a positive number.");
      return;
    }

    if (!Number.isFinite(caloriesPerServing) || caloriesPerServing < 0) {
      setValidationError("Calories per serving must be zero or greater.");
      return;
    }

    await onSubmit({
      recipeName: form.recipeName.trim(),
      category: form.category.trim(),
      ingredients,
      cookingTimeMinutes,
      instructions: form.instructions.trim(),
      caloriesPerServing,
      imageFile: form.imageFile,
    });
  };

  const displayedError = validationError ?? error;
  const hasExistingImage = Boolean(recipe?.imageName) && !form.imageFile;
  const dropZoneClassName = isDragActive
    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
    : "border-white/12 bg-white/6 hover:border-primary/40 hover:bg-white/10";

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden bg-charcoal/50 px-4 py-8 backdrop-blur-sm">
      <div className="flex h-full items-center justify-center">
        <div className="glass flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center justify-between border-b border-black/5 px-8 py-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Admin Studio
              </p>
              <h2 className="mt-2 text-3xl font-serif font-black text-charcoal">
                {mode === "create" ? "Create New Recipe" : "Edit Recipe"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-charcoal/50 transition-colors hover:bg-black/10 hover:text-charcoal"
              disabled={submitting}
              aria-label="Close recipe form"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,250,250,0.98))] px-8 py-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                {displayedError && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {displayedError}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                      Recipe Name
                    </span>
                    <input
                      type="text"
                      value={form.recipeName}
                      onChange={(event) => handleChange("recipeName", event.target.value)}
                      className="w-full rounded-2xl border border-black/5 bg-white/70 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                      placeholder="Roasted Tomato Pasta"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                      Category
                    </span>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(event) => handleChange("category", event.target.value)}
                      className="w-full rounded-2xl border border-black/5 bg-white/70 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                      placeholder="Pasta"
                    />
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                      Cooking Time
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={form.cookingTimeMinutes}
                      onChange={(event) =>
                        handleChange("cookingTimeMinutes", event.target.value)
                      }
                      className="w-full rounded-2xl border border-black/5 bg-white/70 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                      placeholder="30"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                      Calories Per Serving
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={form.caloriesPerServing}
                      onChange={(event) =>
                        handleChange("caloriesPerServing", event.target.value)
                      }
                      className="w-full rounded-2xl border border-black/5 bg-white/70 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                      placeholder="420"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                    Ingredients
                  </span>
                  <textarea
                    rows={6}
                    value={form.ingredientsText}
                    onChange={(event) => handleChange("ingredientsText", event.target.value)}
                    className="w-full rounded-[1.75rem] border border-black/5 bg-white/70 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                    placeholder={"1 cup pasta\n2 tomatoes\nFresh basil"}
                  />
                  <p className="text-xs text-charcoal/35">
                    Enter one ingredient per line. Commas and semicolons are also accepted.
                  </p>
                </label>

                <label className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                    Instructions
                  </span>
                  <textarea
                    rows={8}
                    value={form.instructions}
                    onChange={(event) => handleChange("instructions", event.target.value)}
                    className="w-full rounded-[1.75rem] border border-black/5 bg-white/70 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                    placeholder="Boil the pasta. Roast the tomatoes. Toss everything together and serve warm."
                  />
                </label>
              </div>

              <div className="space-y-6">
                <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-[linear-gradient(180deg,rgba(17,24,39,0.96),rgba(17,24,39,0.90))] shadow-xl shadow-charcoal/10">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                        Visual Preview
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white/70">
                        Cover image for the recipe card
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                      {form.imageFile ? "New Image" : hasExistingImage ? "Current Image" : "No Image"}
                    </div>
                  </div>

                  <label
                    className={`relative block aspect-[4/5] border-b border-white/10 bg-black/10 p-5 transition-all ${dropZoneClassName}`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {previewUrl ? (
                      <div className="relative h-full overflow-hidden rounded-[1.75rem] shadow-2xl shadow-black/30">
                        <img
                          src={previewUrl}
                          alt="Recipe preview"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary/85">
                            Recipe Cover
                          </p>
                          <p className="mt-2 line-clamp-2 text-xl font-serif font-black text-white">
                            {form.recipeName.trim() || "Your recipe title will appear here"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                              {form.category.trim() || "Category"}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                              {form.cookingTimeMinutes || "--"} min
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/5 px-8 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/8 text-primary">
                          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="mt-5 text-base font-black text-white">
                          Upload a hero image
                        </p>
                        <p className="mt-2 max-w-xs text-sm leading-6 text-white/55">
                          A strong photo makes the recipe card and detail page feel much more finished.
                        </p>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-[1.25rem] border border-white/10 bg-charcoal/55 px-4 py-3 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                            isDragActive ? "bg-primary text-white" : "bg-white/10 text-white/70"
                          }`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">
                            {isDragActive ? "Drop image on preview" : "Drag image onto preview"}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/55">
                            The preview panel and upload card both accept image drops.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  <div className="border-t border-white/10 px-5 py-5">
                    <label
                      className="block rounded-[1.75rem] border border-white/12 bg-white/6 px-5 py-5"
                    >
                      <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.24em] text-white/55">
                        Recipe Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleImageSelection(event.target.files?.[0] ?? null)
                        }
                        className="block w-full text-sm text-white/65 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-5 file:py-2.5 file:text-xs file:font-black file:uppercase file:tracking-[0.2em] file:text-charcoal hover:file:bg-primary hover:file:text-white"
                      />
                      <div className="mt-3 text-sm font-semibold text-white/75">
                        {form.imageFile ? form.imageFile.name : "No file chosen"}
                      </div>
                      {form.imageFile && (
                        <button
                          type="button"
                          onClick={() => handleChange("imageFile", null)}
                          className="mt-3 rounded-full border border-white/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white/25 hover:text-white"
                        >
                          Remove
                        </button>
                      )}
                    </label>
                    {mode === "edit" && recipe?.imageName && !form.imageFile && (
                      <p className="mt-3 text-xs text-white/45">
                        Leave this unchanged to keep the current image.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    Publishing Notes
                  </p>
                  <p className="mt-3 text-sm leading-7 text-charcoal/55">
                    New uploads go to Supabase Storage. Replacing an image during edit will
                    remove the previous Supabase file automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-black/5 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-full border border-black/10 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-black/20 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-charcoal px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-charcoal/20 transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : mode === "create"
                    ? "Create Recipe"
                    : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
