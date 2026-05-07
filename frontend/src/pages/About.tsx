import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="site-width flex-1 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="glass p-8 sm:p-12 md:p-16 rounded-[3rem] shadow-2xl border border-white/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-1000" />
            
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">Our Story</span>
            <h1 className="text-4xl font-serif font-black tracking-tight text-charcoal sm:text-6xl mb-10 leading-tight">
              Crafting <span className="italic text-primary">Lexicons</span> of Flavor
            </h1>
            <div className="space-y-8">
              <p className="text-lg leading-relaxed text-charcoal/60 font-medium">
                Chef&apos;s Lexicon is your premium recipe companion for discovering popular
                dishes, organising meals, and exploring culinary art from around the world.
              </p>
              <p className="text-charcoal/50 leading-relaxed font-medium">
                We believe that every dish tells a story. Our mission is to help you find 
                recipes that match your unique tastes, diet, and schedule, turning every 
                meal into a masterpiece.
              </p>
              <div className="pt-10 border-t border-black/5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-center sm:text-left">
                  <div className="space-y-1">
                    <div className="text-3xl font-serif font-black text-charcoal">2.5k+</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">Curated Recipes</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-serif font-black text-charcoal">15k+</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">Active Members</div>
                  </div>
                  <div className="hidden sm:block space-y-1">
                    <div className="text-3xl font-serif font-black text-charcoal">50+</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">World Cuisines</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700 bg-charcoal">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000&h=1250" 
                alt="Chef at work" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-bg transform -rotate-6 hidden sm:block bg-charcoal">
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400&h=400" 
                alt="Gourmet dish" 
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Discover",
              desc: "Explore a vast lexicon of recipes from street food classics to fine dining delights.",
              icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            },
            {
              title: "Organize",
              desc: "Save your favorite masterpieces and plan your weekly culinary journey with ease.",
              icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            },
            {
              title: "Create",
              desc: "Follow detailed instructions designed for both amateur cooks and seasoned chefs.",
              icon: "M12 6v6m0 0v6m0-6h6m-6 0H6"
            }
          ].map((feature, i) => (
            <div key={i} className="glass p-10 rounded-[2.5rem] border border-white/50 hover:-translate-y-2 transition-all duration-500">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-black text-charcoal mb-4">{feature.title}</h3>
              <p className="text-charcoal/50 leading-relaxed text-sm font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
