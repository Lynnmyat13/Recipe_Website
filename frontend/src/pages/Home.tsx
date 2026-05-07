import Header from "../components/Header";
import Footer from "../components/Footer";
import homeBg from "../assets/Home_bg.png";
import pastaImg from "../assets/Pasta.png";
import logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { type Recipe, getRecipeImageUrl, getRecipes } from "../lib/api";

export default function Home() {
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);
  const [randomLoading, setRandomLoading] = useState(true);
  const [randomError, setRandomError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchRandomRecipes() {
      setRandomLoading(true);
      setRandomError(null);

      try {
        const data = await getRecipes("", "", "", undefined, undefined, 1, 1000);
        const recipes = data.recipes;
        if (recipes.length === 0) {
          setRandomRecipes([]);
          return;
        }

        const shuffled = [...recipes];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        setRandomRecipes(shuffled.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch random recipes:", error);
        setRandomError("Unable to load recipe suggestions.");
      } finally {
        setRandomLoading(false);
      }
    }

    void fetchRandomRecipes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <Header />

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative min-h-[85vh] flex items-center pt-20 pb-32 overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-bg -z-10 rounded-l-[10rem]" />
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

          <div className="relative site-width">
            <div className="grid lg:grid-cols-2 items-center gap-16 xl:gap-24">
              {/* Text Area */}
              <div className="flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Premium Culinary Experience
                </div>

                <h1 className="text-6xl lg:text-8xl font-serif font-black text-charcoal leading-[1.05] mb-8">
                  Elevate <br />
                  Your <span className="italic text-primary">Daily</span> <br />
                  <span className="text-primary">Dining.</span>
                </h1>

                <p className="text-charcoal/60 text-lg font-medium mb-12 leading-relaxed max-w-lg">
                  A curated collection of exceptional recipes, designed for the modern kitchen and refined for the discerning palate.
                </p>

                <div className="flex flex-wrap gap-6">
                  <Link
                    to="/recipes"
                    className="bg-charcoal text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-primary transition-all shadow-xl shadow-charcoal/10 hover:-translate-y-1"
                  >
                    Browse Recipes
                  </Link>
                  <Link
                    to="/register"
                    className="group flex items-center gap-3 bg-white border border-black/5 text-charcoal px-10 py-4 rounded-full font-bold text-sm hover:border-primary/30 transition-all hover:bg-bg"
                  >
                    Join the Club
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                <div className="mt-20 flex items-center gap-12">
                  <div className="flex flex-col">
                    <span className="text-3xl font-serif font-black text-charcoal">2.5k+</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">Recipes</span>
                  </div>
                  <div className="w-px h-10 bg-black/5" />
                  <div className="flex flex-col">
                    <span className="text-3xl font-serif font-black text-charcoal">15k+</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">Members</span>
                  </div>
                </div>
              </div>

              {/* Image Area */}
              <div className="relative">
                {/* Floating Pasta Image */}
                <div className="absolute -top-20 -right-10 w-64 h-64 z-20 animate-float hidden xl:block">
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-white group">
                    <img
                      src={pastaImg}
                      alt="Floating Pasta"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                </div>

                <div className="relative z-10 group">
                  <div className="absolute -inset-10 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-all duration-1000" />
                  <div className="relative aspect-4/5 rounded-[4rem] overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
                    <img
                      src={homeBg}
                      alt="Hero Culinary"
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-2000"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-charcoal/40 via-transparent to-transparent" />
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -bottom-10 -left-10 glass p-5 rounded-3xl shadow-xl border border-white/50 animate-float">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center p-1.5 shadow-sm">
                        <img src={logo} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-charcoal uppercase tracking-widest">Recipe of the Day</div>
                        <div className="text-xs text-charcoal/60">Saffron Risotto</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Random Picks Section */}
        <section className="py-32 site-width">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">
                Discover
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-charcoal mb-6 leading-tight">
                Culinary <span className="italic text-primary">Inspiration</span>
              </h2>
              <p className="text-charcoal/50 text-lg leading-relaxed">
                Fresh inspiration every visit — a curated selection of eight masterpieces to help you explore something new.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 z-10 md:px-4">
              <button
                type="button"
                onClick={() => {
                  if (!carouselRef.current) return;
                  carouselRef.current.scrollBy({ left: -carouselRef.current.clientWidth * 0.9, behavior: "smooth" });
                }}
                className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal shadow-sm transition hover:border-primary/30 hover:text-primary"
                aria-label="Scroll left"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 z-10 md:px-4">
              <button
                type="button"
                onClick={() => {
                  if (!carouselRef.current) return;
                  carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth * 0.9, behavior: "smooth" });
                }}
                className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-charcoal shadow-sm transition hover:border-primary/30 hover:text-primary"
                aria-label="Scroll right"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {randomError ? (
              <div className="rounded-4xl border border-red-100 bg-red-50 px-8 py-12 text-center text-sm font-semibold text-red-600">
                {randomError}
              </div>
            ) : randomLoading ? (
              <div className="flex gap-6 overflow-hidden px-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="min-w-70 rounded-[3rem] bg-bg p-6 shadow-sm">
                    <div className="aspect-4/5 animate-pulse rounded-4xl bg-black/5 mb-6" />
                    <div className="h-4 animate-pulse rounded bg-black/5 mb-3" />
                    <div className="h-4 animate-pulse rounded bg-black/5 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                ref={carouselRef}
                className="no-scrollbar flex gap-8 overflow-x-auto pb-4 pr-4 scroll-smooth"
              >
                {randomRecipes.map((recipe) => (
                  <Link
                    key={recipe._id}
                    to={`/recipe/${recipe._id}`}
                    className="min-w-70 max-w-70 shrink-0 overflow-hidden rounded-[3rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1"
                  >
                    <div className="relative aspect-4/5 overflow-hidden">
                      <img
                        src={getRecipeImageUrl(recipe.imageName)}
                        alt={recipe.recipeName}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("unsplash")) {
                            target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=60&w=400&h=500";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-charcoal/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-charcoal shadow-sm">
                        {recipe.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-serif font-black text-charcoal leading-tight mb-3">
                        {recipe.recipeName}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-charcoal/60">
                        <span>{recipe.cookingTimeMinutes}m</span>
                        <span>{recipe.caloriesPerServing} kcal</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-32 bg-bg/50">
          <div className="site-width text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Exploration</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-charcoal mb-20 leading-tight">
              Culinary <span className="italic text-primary">Lexicon</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[
                { name: "Breakfast", icon: "🍳", color: "bg-orange-50" },
                { name: "Dinner", icon: "🍝", color: "bg-blue-50" },
                { name: "Seafood", icon: "🦐", color: "bg-cyan-50" },
                { name: "Dessert", icon: "🍰", color: "bg-pink-50" },
                { name: "Vegetarian", icon: "🥗", color: "bg-green-50" },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  to={`/recipes?category=${cat.name}`}
                  className={`group p-10 rounded-[3rem] ${cat.color} border border-black/5 hover:border-primary/20 transition-all hover:-translate-y-2`}
                >
                  <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500">{cat.icon}</div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-charcoal">{cat.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Chef's Choice / Daily Special */}
        <section className="py-32 site-width">
          <div className="glass p-12 md:p-20 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -z-10 rounded-l-[10rem] group-hover:bg-primary/10 transition-colors" />
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=70&w=800&h=450"
                  alt="Daily Special"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-2000"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-10 left-10">
                  <span className="glass px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-white rounded-full shadow-xl">
                    Daily Special
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-6 block">Chef's Recommendation</span>
                <h3 className="text-4xl md:text-6xl font-serif font-black text-charcoal mb-8 leading-tight">
                  Modern <span className="italic text-primary">Avocado</span> <br />
                  Harvest Bowl
                </h3>
                <p className="text-charcoal/60 text-lg mb-12 leading-relaxed font-medium">
                  A nutrient-dense masterpiece featuring hand-picked greens, roasted seasonal tubers, and our signature lemon-tahini infusion.
                </p>
                <Link
                  to="/recipes"
                  className="inline-flex items-center gap-4 bg-charcoal text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-primary transition-all shadow-xl shadow-charcoal/20"
                >
                  Discover the Secret
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative Floating Elements Section */}
        <div className="relative h-64 overflow-hidden pointer-events-none">
          <div className="absolute left-1/4 top-0 w-32 h-32 animate-float opacity-20">
            <img src={pastaImg} alt="" className="w-full h-full object-cover rounded-full shadow-2xl rotate-12" />
          </div>
          <div className="absolute right-1/3 bottom-0 w-48 h-48 animate-float-delayed opacity-10">
            <img src={pastaImg} alt="" className="w-full h-full object-cover rounded-full shadow-2xl -rotate-12" />
          </div>
        </div>

        {/* Features Section */}
        <section className="py-32 site-width">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                title: "Curated Excellence",
                desc: "Every recipe in our archive is tested and refined for professional results at home.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                )
              },
              {
                title: "Modern Interface",
                desc: "A seamless, intuitive experience designed for the modern digital kitchen.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Rapid Search",
                desc: "Find exactly what you're looking for with our advanced AI-driven search engine.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-serif font-black text-charcoal mb-4">{feature.title}</h4>
                <p className="text-charcoal/50 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-40 relative bg-charcoal overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-200 h-200 bg-primary rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-150 h-150 bg-primary rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="site-width relative z-10 text-center">
            <div className="max-w-3xl mx-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-8 block">Newsletter</span>
              <h2 className="text-5xl md:text-7xl font-serif font-black text-white mb-10 leading-tight">
                The <span className="italic">Gourmet</span> Journal
              </h2>
              <p className="text-white/50 text-lg mb-16 max-w-xl mx-auto leading-relaxed font-medium">
                Receive exclusive recipes, expert tips, and seasonal guides directly in your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto p-2 bg-white/5 backdrop-blur-md rounded-4xl border border-white/10">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-transparent px-6 py-4 rounded-2xl text-white placeholder:text-white/20 focus:outline-none flex-1 text-sm font-medium"
                />
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-black/20">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div >
  );
}
