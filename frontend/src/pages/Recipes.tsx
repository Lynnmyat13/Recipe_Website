import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getRecipes, getRecipeImageUrl, type Recipe } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedIngredients = searchParams.get("ingredients") || "";
  const maxTime = searchParams.get("maxTime") ? Number(searchParams.get("maxTime")) : undefined;
  const maxCalories = searchParams.get("maxCalories") ? Number(searchParams.get("maxCalories")) : undefined;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Appetizer",
    "Beverage",
    "Breakfast",
    "Chicken",
    "Curry",
    "Dessert",
    "Dinner",
    "Lunch",
    "Pasta",
    "Rice",
    "Salad",
    "Seafood",
    "Soup",
    "Vegetarian",
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoryFilter = selectedCategory === "All" ? "" : selectedCategory;
        const data = await getRecipes(searchQuery, categoryFilter, selectedIngredients, maxTime, maxCalories);

        if (data && typeof data === 'object') {
          if ('recipes' in data && Array.isArray(data.recipes)) {
            setRecipes(data.recipes);
            if (data.pagination) {
              setTotalRecipes(data.pagination.total || 0);
            } else {
              setTotalRecipes(data.recipes.length);
            }
          } else if (Array.isArray(data)) {
            setRecipes(data as any);
            setTotalRecipes(data.length);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    window.scrollTo(0, 0);
  }, [searchQuery, selectedCategory, selectedIngredients, maxTime, maxCalories]);

  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category && category !== "All") {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header
        showSearch={true}
        searchValue={searchQuery}
        onSearchChange={handleSearch}
      />

      <main className="flex-1 py-16 site-width">
        <div className="mb-20">
          <div className="max-w-3xl">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">The Lexicon</span>
            <h1 className="text-5xl lg:text-7xl font-serif font-black text-charcoal mb-8 leading-tight">
              Curated <span className="italic text-primary">Collections</span>
            </h1>
            <p className="text-charcoal/50 text-lg max-w-xl leading-relaxed font-medium">
              Explore masterpieces from our kitchen. Refine by category or use advanced filters to find your perfect match.
            </p>
          </div>

          {/* Category Bar - More Elegant */}
          <div className="mt-16 border-b border-black/5">
            <div className="flex overflow-x-auto pb-0 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 gap-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex-shrink-0 pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative group ${(selectedCategory === cat || (cat === "All" && !selectedCategory))
                    ? "text-charcoal"
                    : "text-charcoal/30 hover:text-primary"
                    }`}
                >
                  {cat}
                  <span className={`absolute bottom-0 left-0 right-0 h-1 bg-primary transition-transform duration-300 ${(selectedCategory === cat || (cat === "All" && !selectedCategory)) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters Section - Integrated and Premium */}
          <div className="mt-10">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showFilters
                ? "bg-charcoal text-white shadow-xl shadow-charcoal/20"
                : "bg-white text-charcoal border border-black/5 hover:border-primary/30 shadow-sm"
                }`}
            >
              <svg className={`w-4 h-4 transition-transform duration-500 ${showFilters ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {showFilters ? 'Close Filters' : 'Filter Lexicon'}
              {(selectedIngredients || maxTime || maxCalories) && !showFilters && (
                <span className="ml-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </button>

            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showFilters ? 'max-h-[600px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
              <div className="glass p-10 rounded-[3rem] shadow-2xl shadow-charcoal/5 border border-white/50 grid grid-cols-1 md:grid-cols-3 gap-10 text-left relative">
                <div className="relative">
                  <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">
                    Ingredients
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Saffron, Basil"
                    className="w-full px-0 py-3 bg-transparent border-b border-black/5 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-charcoal/20"
                    value={selectedIngredients}
                    onChange={(e) => updateFilter('ingredients', e.target.value)}
                  />
                </div>

                <div className="relative">
                  <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">
                    Preparation Time
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Max minutes"
                      className="w-full px-0 py-3 bg-transparent border-b border-black/5 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-charcoal/20"
                      value={maxTime || ''}
                      onChange={(e) => updateFilter('maxTime', e.target.value)}
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black text-charcoal/20 uppercase tracking-widest">MIN</span>
                  </div>
                </div>

                <div className="relative">
                  <label className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">
                    Caloric Content
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Max kcal"
                      className="w-full px-0 py-3 bg-transparent border-b border-black/5 text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-charcoal/20"
                      value={maxCalories || ''}
                      onChange={(e) => updateFilter('maxCalories', e.target.value)}
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black text-charcoal/20 uppercase tracking-widest">KCAL</span>
                  </div>
                </div>

                <div className="md:col-span-3 flex justify-between items-center pt-6 border-t border-black/5">
                  <p className="text-[10px] text-charcoal/40 font-bold uppercase tracking-widest">
                    {(selectedIngredients || maxTime || maxCalories) ? 'Active filters applied' : 'No filters active'}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-black text-red-500/60 hover:text-red-600 uppercase tracking-[0.2em] transition-colors"
                  >
                    Reset Lexicon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-black/5 rounded-[2.5rem] mb-6" />
                <div className="h-6 bg-black/5 rounded w-3/4 mb-3" />
                <div className="h-4 bg-black/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-32 glass rounded-[4rem] border border-red-100 max-w-2xl mx-auto px-12">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-black text-charcoal mb-4">Culinary Interruption</h2>
            <p className="text-charcoal/50 mb-10 leading-relaxed font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-charcoal text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-charcoal/20"
            >
              Restore Lexicon
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-32 glass rounded-[4rem] border-2 border-dashed border-black/5 max-w-3xl mx-auto px-12">
            <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-10">
              <svg className="w-12 h-12 text-charcoal/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif font-black text-charcoal mb-6">No Secrets Found</h2>
            <p className="text-charcoal/50 max-w-md mx-auto mb-12 text-lg leading-relaxed font-medium">
              Our culinary archives don't contain any recipes matching your specific criteria. Try a broader search.
            </p>
            <button
              onClick={clearFilters}
              className="bg-charcoal text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-2xl shadow-charcoal/20"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16 mb-20">
            {recipes.map((recipe) => (
              <Link
                key={recipe._id}
                to={`/recipe/${recipe._id}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] mb-6 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-4">
                  <img
                    src={getRecipeImageUrl(recipe.imageName)}
                    alt={recipe.recipeName}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('unsplash')) {
                        target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=60&w=400&h=500";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="absolute top-8 left-8">
                    <span className="px-5 py-2 glass text-charcoal text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {recipe.category}
                    </span>
                  </div>

                  <div className="absolute bottom-10 left-10 right-10 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-5 text-white/90 text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {recipe.cookingTimeMinutes}m
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <span>{recipe.caloriesPerServing} kcal</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-black text-charcoal group-hover:text-primary transition-colors line-clamp-2 leading-[1.2]">
                  {recipe.recipeName}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
