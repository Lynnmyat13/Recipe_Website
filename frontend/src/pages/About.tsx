import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="site-width flex-1 py-16 sm:py-24">
        <div className="glass p-8 sm:p-12 md:p-16 rounded-[3rem] shadow-2xl border border-white/50 max-w-4xl mx-auto">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">Our Story</span>
          <h1 className="text-4xl font-serif font-black tracking-tight text-charcoal sm:text-6xl mb-10 leading-tight">
            About <span className="italic text-primary">Us</span>
          </h1>
          <div className="space-y-8">
            <p className="text-lg leading-relaxed text-charcoal/60 font-medium">
              Chef&apos;s Lexicon is your premium recipe companion for discovering popular
              dishes, organising meals, and exploring culinary art from around the world.
            </p>
            <p className="text-charcoal/50 leading-relaxed font-medium">
              We help you find recipes that match your tastes, diet, and schedule.
              Browse by cuisine, cooking time, and caloric content—and save your
              favourites for easy meal planning.
            </p>
            <div className="pt-10 border-t border-black/5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-serif font-black text-charcoal mb-1">2.5k+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Curated Recipes</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-black text-charcoal mb-1">15k+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Active Members</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-3xl font-serif font-black text-charcoal mb-1">50+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">World Cuisines</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
