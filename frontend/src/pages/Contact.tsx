import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="site-width flex-1 py-16 sm:py-24">
        <div className="glass p-8 sm:p-12 md:p-16 rounded-[3rem] shadow-2xl border border-white/50 max-w-4xl mx-auto">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-6 block">Support</span>
          <h1 className="text-4xl font-serif font-black tracking-tight text-charcoal sm:text-6xl mb-10 leading-tight">
            Contact <span className="italic text-primary">Us</span>
          </h1>
          <p className="text-lg leading-relaxed text-charcoal/60 font-medium mb-12">
            Get in touch with any questions about recipes, your account, or
            feedback. Our team is here to assist you.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-10">
            <div className="p-8 rounded-3xl bg-white/50 border border-black/5 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <dt className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-2">Email</dt>
              <dd>
                <a
                  href="mailto:support@chefslexicon.com"
                  className="text-xl font-serif font-black text-charcoal hover:text-primary transition-colors"
                >
                  support@chefslexicon.com
                </a>
              </dd>
            </div>

            <div className="p-8 rounded-3xl bg-white/50 border border-black/5 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <dt className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-2">Phone</dt>
              <dd className="text-xl font-serif font-black text-charcoal">
                +1 234 567 890
              </dd>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
