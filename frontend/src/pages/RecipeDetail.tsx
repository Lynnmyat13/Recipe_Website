import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipeById, getRecipeImageUrl, toggleFavorite, getFavorites, type Recipe } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipeById(id);
        setRecipe(data);

        // Check if it's in favorites if logged in
        if (token) {
          const favorites = await getFavorites();
          setIsFavorite(favorites.some(f => f._id === id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, token]);

  const handleToggleFavorite = async () => {
    if (!id || togglingFavorite) return;

    if (!token) {
      alert("Please log in to save favorites");
      return;
    }

    setTogglingFavorite(true);
    try {
      await toggleFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
      alert("Failed to update favorites");
    } finally {
      setTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Header />
        <main className="site-width flex-1 py-16">
          <div className="animate-pulse">
            <div className="h-4 w-24 bg-black/5 rounded mb-12" />
            <div className="grid lg:grid-cols-2 gap-20">
              <div className="aspect-square bg-black/5 rounded-[3rem]" />
              <div>
                <div className="h-16 w-3/4 bg-black/5 rounded mb-8" />
                <div className="flex gap-4 mb-12">
                  <div className="h-12 w-32 bg-black/5 rounded-2xl" />
                  <div className="h-12 w-32 bg-black/5 rounded-2xl" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-black/5 rounded w-full" />
                  <div className="h-4 bg-black/5 rounded w-full" />
                  <div className="h-4 bg-black/5 rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Header />
        <main className="site-width flex-1 py-32 text-center">
          <div className="max-w-2xl mx-auto glass p-16 rounded-[4rem] border border-black/5 shadow-2xl">
            <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-10">
              <svg className="w-12 h-12 text-charcoal/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-4xl font-serif font-black text-charcoal mb-6">Archive Missing</h2>
            <p className="text-charcoal/50 text-lg leading-relaxed mb-12 font-medium">{error || "The specific recipe could not be located in our archives."}</p>
            <Link
              to="/recipes"
              className="bg-charcoal text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-2xl shadow-charcoal/20"
            >
              Back to Lexicon
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="site-width flex-1 py-16 print:py-0 print:m-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 print:hidden">
          <Link
            to="/recipes"
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30 hover:text-primary transition-all"
          >
            <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Back to Lexicon
          </Link>

          <button
            onClick={handleToggleFavorite}
            disabled={togglingFavorite}
            className={`flex items-center gap-4 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${isFavorite
              ? "bg-primary text-white shadow-primary/30"
              : "bg-white text-charcoal border border-black/5 hover:border-primary/30 shadow-charcoal/5"
              }`}
          >
            <svg className={`w-5 h-5 transition-transform duration-500 ${isFavorite ? 'scale-110 fill-current' : 'scale-100 fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isFavorite ? 'Saved in Collection' : 'Add to Collection'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start print:grid-cols-1 print:gap-4 print:block">
          {/* Recipe Image */}
          <div className="relative aspect-4/5 overflow-hidden rounded-[4rem] bg-white shadow-3xl group print:aspect-video print:rounded-2xl print:mb-4 print:max-h-75">
            <img
              src={getRecipeImageUrl(recipe.imageName)}
              alt={recipe.recipeName}
              className="h-full w-full object-cover transition-transform duration-2000 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('unsplash')) {
                  target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800&h=1000";
                }
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-charcoal/40 to-transparent" />
            <div className="absolute top-10 left-10">
              <span className="glass px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-charcoal rounded-full shadow-xl">
                {recipe.category}
              </span>
            </div>
          </div>

          {/* Recipe Info */}
          <div className="flex flex-col print:mt-0">
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mb-6 block print:mb-2">Masterpiece No. {recipe._id.slice(-4)}</span>
            <h1 className="text-5xl sm:text-7xl font-serif font-black text-charcoal leading-[1.1] mb-12 print:text-4xl print:mb-6">
              {recipe.recipeName}
            </h1>

            <div className="flex flex-wrap items-center gap-10 mb-16 print:mb-8 print:gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary print:w-10 print:h-10 print:rounded-lg">
                  <svg className="w-6 h-6 print:w-4 print:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-black tracking-widest text-charcoal/30 print:text-[7px]">Preparation</span>
                  <span className="text-lg font-black text-charcoal print:text-sm">{recipe.cookingTimeMinutes}m</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary print:w-10 print:h-10 print:rounded-lg">
                  <svg className="w-6 h-6 print:w-4 print:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.99 7.99 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-black tracking-widest text-charcoal/30 print:text-[7px]">Calories</span>
                  <span className="text-lg font-black text-charcoal print:text-sm">{recipe.caloriesPerServing} kcal</span>
                </div>
              </div>
            </div>

            <div className="mb-16 print:mb-8">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-charcoal mb-8 pb-4 border-b border-black/5 print:mb-4 print:pb-2 print:text-[9px]">
                The Elements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-4 p-5 glass rounded-3xl border border-white/50 text-charcoal/60 text-sm font-medium transition-all hover:border-primary/30 hover:shadow-lg print:p-2 print:rounded-xl print:text-xs">
                    <div className="h-2 w-2 rounded-full bg-primary print:h-1.5 print:w-1.5" />
                    {ingredient}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-charcoal mb-8 pb-4 border-b border-black/5 print:mb-4 print:pb-2 print:text-[9px]">
                The Process
              </h2>
              <div className="space-y-6 print:space-y-2">
                {recipe.instructions.split(/[.!?]\s+/).filter(step => step.trim().length > 0).map((step, index) => (
                  <div key={index} className="flex gap-6 group print:gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-[10px] font-black text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 print:w-6 print:h-6 print:text-[8px]">
                      {index + 1}
                    </div>
                    <p className="text-charcoal/70 leading-[1.8] text-sm font-medium pt-2 print:pt-1 print:text-[10px] print:leading-normal">
                      {step.trim()}{step.trim().endsWith('.') ? '' : '.'}
                    </p>
                  </div>
                ))}

                {/* Chef's Note Section */}
                <div className="mt-12 p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 relative overflow-hidden group print:mt-4 print:p-4 print:rounded-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 print:hidden" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 print:mb-1">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary print:w-5 print:h-5">
                        <svg className="w-4 h-4 print:w-3 print:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary print:text-[8px]">Chef's Note</span>
                    </div>
                    <p className="text-charcoal/60 text-xs font-medium leading-relaxed italic print:text-[9px] print:leading-tight">
                      For the most authentic experience, ensure your ingredients are room temperature before beginning. Precision in preparation is the secret to a masterpiece.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Share/Print Actions */}
            <div className="mt-16 flex items-center gap-4 pt-10 border-t border-black/5">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-white transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-white transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100 5.368m0-5.368l-6.632 3.316" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
