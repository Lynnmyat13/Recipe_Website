import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminRecipeModal from "./AdminRecipeModal";
import {
  createRecipe,
  deleteRecipe,
  getRecipeImageUrl,
  getRecipes,
  updateRecipe,
  type AdminRecipeInput,
  type Recipe,
} from "../lib/api";

type AdminRecipeManagerProps = {
  adminName?: string;
};

export default function AdminRecipeManager({
  adminName = "Admin",
}: AdminRecipeManagerProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const visibleRecipes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return recipes;

    return recipes.filter((recipe) =>
      recipe.recipeName.toLowerCase().includes(normalizedSearch)
    );
  }, [recipes, search]);

  useEffect(() => {
    async function loadRecipes() {
      const shouldShowLoading = recipes.length === 0;
      if (shouldShowLoading) {
        setLoading(true);
      } else {
        setIsFetching(true);
      }
      setError(null);

      try {
        const data = await getRecipes(search, "", "", undefined, undefined, page, 10);
        setRecipes(data.recipes);
        setTotalPages(data.pagination.totalPages);
        setTotalRecipes(data.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load recipes");
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    }

    void loadRecipes();
  }, [page, search]);

  useEffect(() => {
    if (!recipeToDelete) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [recipeToDelete]);

  function openCreateModal() {
    setModalMode("create");
    setSelectedRecipe(null);
    setSubmitError(null);
    setModalOpen(true);
  }

  function openEditModal(recipe: Recipe) {
    setModalMode("edit");
    setSelectedRecipe(recipe);
    setSubmitError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
    setSelectedRecipe(null);
    setSubmitError(null);
  }

  async function handleModalSubmit(input: AdminRecipeInput) {
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (modalMode === "create") {
        const created = await createRecipe(input);
        setRecipes((current) => [created, ...current]);
      } else if (selectedRecipe) {
        const updated = await updateRecipe(selectedRecipe._id, input);
        setRecipes((current) =>
          current.map((recipe) =>
            recipe._id === selectedRecipe._id ? updated : recipe
          )
        );
      }

      setModalOpen(false);
      setSelectedRecipe(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save recipe");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(recipe: Recipe) {
    setDeletingId(recipe._id);
    setError(null);

    try {
      await deleteRecipe(recipe._id);
      setRecipes((current) => current.filter((item) => item._id !== recipe._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete recipe");
    } finally {
      setDeletingId(null);
      setRecipeToDelete(null);
    }
  }

  return (
    <>
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-[3rem] bg-charcoal px-8 py-10 text-white shadow-2xl shadow-charcoal/20 sm:px-12 sm:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.35),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.10),_transparent_25%)]" />
          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <span className="text-[11px] font-black uppercase tracking-[0.45em] text-primary/80">
                Admin Workspace
              </span>
              <h2 className="mt-5 text-4xl font-serif font-black leading-tight sm:text-6xl">
                Recipe <span className="italic text-primary">Control Room</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Manage the recipe archive, update records, and publish new dishes with
                cloud-backed images directly from your profile.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center xl:shrink-0 xl:flex-nowrap xl:justify-end">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">
                    Signed In
                  </p>
                  <p className="mt-2 text-lg font-black text-white">{adminName}</p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">
                    Recipes
                  </p>
                  <p className="mt-2 text-lg font-black text-white">{totalRecipes}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={openCreateModal}
                className="whitespace-nowrap rounded-full bg-primary px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-accent"
              >
                Create New Recipe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[3rem] border border-black/5 bg-white/80 p-6 shadow-xl shadow-charcoal/5 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">
                Archive Search
              </p>
              <h3 className="mt-3 text-3xl font-serif font-black text-charcoal">
                Find a recipe fast
              </h3>
            </div>

            <label className="relative block w-full max-w-xl">
              <span className="absolute inset-y-0 left-5 flex items-center text-charcoal/30">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M21 21l-5.2-5.2m2.2-4.8a7 7 0 11-14 0a7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by recipe name..."
                className="w-full rounded-full border border-black/5 bg-bg py-4 pl-12 pr-5 text-sm font-medium text-charcoal outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              />
            </label>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/5">
            {loading ? (
              <div className="space-y-4 px-6 py-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-2xl bg-black/5" />
                ))}
              </div>
            ) : visibleRecipes.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <p className="text-lg font-serif font-black text-charcoal">
                  No recipes match this search.
                </p>
                <p className="mt-3 text-sm text-charcoal/45">
                  Try a different recipe name or create a new entry.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black/5">
                  <thead className="bg-bg/80">
                    <tr className="text-left text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/40">
                      <th className="px-6 py-4">Recipe</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Calories</th>
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 bg-white/90">
                    {visibleRecipes.map((recipe) => (
                      <tr key={recipe._id} className="align-middle">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-black/5">
                              <img
                                src={getRecipeImageUrl(recipe.imageName)}
                                alt={recipe.recipeName}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  const target = event.target as HTMLImageElement;
                                  target.src =
                                    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=300&h=300";
                                }}
                              />
                            </div>
                            <div>
                              <p className="text-lg font-black text-charcoal">
                                {recipe.recipeName}
                              </p>
                              <p className="text-sm text-charcoal/45">
                                {recipe.ingredients.length} ingredients
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-charcoal/70">
                          {recipe.category}
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-charcoal/70">
                          {recipe.cookingTimeMinutes} min
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-charcoal/70">
                          {recipe.caloriesPerServing} kcal
                        </td>
                        <td className="px-6 py-5 text-sm font-semibold text-charcoal/70">
                          {recipe.imageName ? "Uploaded" : "None"}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Link
                              to={`/recipe/${recipe._id}`}
                              state={{ from: "/profile", backLabel: "Back to Profile" }}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-charcoal transition-colors hover:border-primary/30 hover:text-primary"
                              title="View recipe"
                              aria-label={`View ${recipe.recipeName}`}
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0a3 3 0 016 0z"
                                />
                              </svg>
                            </Link>
                            <button
                              type="button"
                              onClick={() => openEditModal(recipe)}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-charcoal transition-colors hover:border-primary/30 hover:text-primary"
                              title="Edit recipe"
                              aria-label={`Edit ${recipe.recipeName}`}
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.586 3.586a2 2 0 112.828 2.828L12 15.828l-4 1 1-4 9.586-9.242z"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRecipeToDelete(recipe)}
                              disabled={deletingId === recipe._id}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              title="Delete recipe"
                              aria-label={`Delete ${recipe.recipeName}`}
                            >
                              {deletingId === recipe._id ? (
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v4m0 8v4m8-8h-4M8 12H4m13.657-5.657l-2.829 2.829M9.172 14.828l-2.829 2.829m11.314 0l-2.829-2.829M9.172 9.172L6.343 6.343"
                                  />
                                </svg>
                              ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col gap-4 border-t border-black/5 bg-bg/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                    <p className="text-sm text-charcoal/70">
                      Page {page} of {totalPages} · {totalRecipes} recipes total
                    </p>
                    {isFetching && (
                      <p className="text-sm text-charcoal/50">
                        Loading page {page}...
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-charcoal transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                      disabled={page === totalPages}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-charcoal transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <AdminRecipeModal
        isOpen={modalOpen}
        mode={modalMode}
        recipe={selectedRecipe}
        submitting={submitting}
        error={submitError}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />

      {recipeToDelete && (
        <div className="fixed inset-0 z-[75] overflow-hidden bg-charcoal/55 px-4 backdrop-blur-sm">
          <div className="flex h-full items-center justify-center">
            <div className="glass w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8"
                  />
                </svg>
              </div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.35em] text-red-500">
                Confirm Delete
              </p>
              <h3 className="mt-3 text-3xl font-serif font-black text-charcoal">
                Delete this recipe?
              </h3>
              <p className="mt-4 text-sm leading-7 text-charcoal/55">
                <span className="font-black text-charcoal">{recipeToDelete.recipeName}</span> will
                be removed from the database, and its Supabase image will be deleted too if one
                exists.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setRecipeToDelete(null)}
                  disabled={deletingId === recipeToDelete._id}
                  className="rounded-full border border-black/10 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-black/20 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(recipeToDelete)}
                  disabled={deletingId === recipeToDelete._id}
                  className="rounded-full bg-red-500 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-500/20 transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === recipeToDelete._id ? "Deleting..." : "Delete Recipe"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
