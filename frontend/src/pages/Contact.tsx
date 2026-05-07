import Header from "../components/Header";
import Footer from "../components/Footer";
import contactBg from "../assets/Contact_bg.png";

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="site-width flex-1 py-16 sm:py-24">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-stretch max-w-6xl mx-auto">
          {/* Left Side: Contact Info */}
          <div className="flex flex-col justify-between glass p-10 sm:p-14 rounded-[3.5rem] shadow-2xl border border-white/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-primary/10 transition-all duration-1000" />

            <div className="relative z-10">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">Support</span>
              <h1 className="text-4xl font-serif font-black tracking-tight text-charcoal sm:text-6xl mb-8 leading-tight">
                Let's <span className="italic text-primary">Connect</span>
              </h1>
              <p className="text-lg leading-relaxed text-charcoal/60 font-medium mb-12 max-w-sm">
                Have a question about a recipe or want to share your culinary feedback?
                Our team is always ready to assist.
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="p-8 rounded-[2rem] bg-white/40 border border-black/5 hover:border-primary/30 transition-all group/card">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover/card:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <dt className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 mb-1">Email Our Kitchen</dt>
                    <dd>
                      <a href="mailto:hello@chefslexicon.com" className="text-lg font-serif font-black text-charcoal hover:text-primary transition-colors">
                        hello@chefslexicon.com
                      </a>
                    </dd>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-white/40 border border-black/5 hover:border-primary/30 transition-all group/card">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover/card:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <dt className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 mb-1">Call Our Team</dt>
                    <dd className="text-lg font-serif font-black text-charcoal">+1 (234) 567-890</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Decorative Image & Form Placeholder */}
          <div className="relative h-full min-h-[500px] lg:min-h-full">
            <div className="absolute inset-0 rounded-[3.5rem] overflow-hidden shadow-2xl bg-charcoal">
              <img
                src={contactBg}
                alt="Kitchen Interior"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/80 via-charcoal/20 to-transparent" />

              <div className="absolute bottom-10 left-10 right-10 glass p-8 rounded-[2.5rem] border border-white/20 backdrop-blur-md">
                <p className="text-white text-sm font-medium leading-relaxed italic">
                  "Cooking is an art, but all art requires knowing something about the techniques and materials."
                </p>
                <p className="text-primary font-black text-[10px] uppercase tracking-widest mt-4">
                  — The Chef's Philosophy
                </p>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
