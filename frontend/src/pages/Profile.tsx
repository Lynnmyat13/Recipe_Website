import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getFavorites, getRecipeImageUrl, type Recipe } from "../lib/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const data = await getFavorites();
        setSavedRecipes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load collection");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
    window.scrollTo(0, 0);
  }, [navigate, token, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Header />
        <main className="flex-1 py-16 site-width">
          <div className="animate-pulse">
            <div className="h-64 bg-black/5 rounded-[4rem] mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-4/5 bg-black/5 rounded-[2.5rem] mb-6" />
                  <div className="h-6 bg-black/5 rounded w-3/4 mb-3" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />

      <main className="flex-1 py-16 site-width">
        {/* Profile Header */}
        <div className="mb-20">
          <div className="glass p-10 sm:p-16 rounded-[4rem] border border-white/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-1000" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-4xl bg-charcoal flex items-center justify-center text-4xl font-serif font-black text-white shadow-2xl shadow-charcoal/20">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">Personal Archive</span>
                  <h1 className="text-4xl sm:text-5xl font-serif font-black text-charcoal leading-tight mb-2">
                    {user.name}
                  </h1>
                  <p className="text-charcoal/40 text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-8 py-4 glass rounded-3xl border border-black/5 flex flex-col items-center">
                  <span className="text-2xl font-serif font-black text-charcoal">{savedRecipes.length}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">Masterpieces</span>
                </div>
                <button
                  onClick={logout}
                  className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm group"
                  title="Sign Out"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Grid */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-serif font-black text-charcoal mb-2">My <span className="italic text-primary">Collection</span></h2>
              <p className="text-charcoal/40 text-sm font-medium uppercase tracking-widest">Your curated culinary library</p>
            </div>
            <Link
              to="/recipes"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary-dark transition-colors border-b-2 border-primary/10 pb-1 hover:border-primary"
            >
              Discover More
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-4/5 bg-black/5 rounded-[2.5rem] mb-6" />
                  <div className="h-6 bg-black/5 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-black/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 glass rounded-[3rem] border border-red-100 max-w-xl mx-auto px-10">
              <p className="text-red-500 font-bold uppercase tracking-widest text-xs">{error}</p>
            </div>
          ) : savedRecipes.length === 0 ? (
            <div className="text-center py-32 glass rounded-[4rem] border-2 border-dashed border-black/5 max-w-3xl mx-auto px-12">
              <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-10">
                <svg className="w-12 h-12 text-charcoal/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-black text-charcoal mb-6">Your Gallery is Empty</h2>
              <p className="text-charcoal/50 max-w-md mx-auto mb-12 text-lg leading-relaxed font-medium">
                You haven't added any masterpieces to your personal collection yet.
              </p>
              <Link
                to="/recipes"
                className="inline-block bg-charcoal text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-2xl shadow-charcoal/20"
              >
                Start Exploring
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
              {savedRecipes.map((recipe) => (
                <Link
                  key={recipe._id}
                  to={`/recipe/${recipe._id}`}
                  className="group block"
                >
                  <div className="relative aspect-4/5 overflow-hidden rounded-[3rem] mb-6 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-4">
                    <img
                      src={getRecipeImageUrl(recipe.imageName)}
                      alt={recipe.recipeName}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('unsplash')) {
                          target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800&h=1000";
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

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
        </section>
      </main>

      <Footer />
    </div>
  );
}
