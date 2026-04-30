import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const usefulLinks = [
  { label: "Featured", href: "/recipes" },
  { label: "New Arrivals", href: "/recipes" },
  { label: "Top Categories", href: "/recipes" },
];

const informationLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Terms & Conditions", to: "#" },
  { label: "Privacy Policy", to: "#" },
];

function SocialIcon({
  href,
  label,
  bgClass,
  children,
}: {
  href: string;
  label: string;
  bgClass: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:opacity-90 ${bgClass}`}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/5 bg-white text-charcoal/60">
      <div className="site-width grid w-full gap-16 py-24 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Link to="/" className="flex items-center gap-3 group mb-8">
            <div className="h-10 w-10 overflow-hidden rounded-xl bg-white border border-black/5 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <img
                src="/src/assets/Logo.png"
                alt="Chef's Lexicon logo"
                className="h-full w-full object-contain p-1.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-serif font-black tracking-tight text-charcoal leading-none">
                CHEF'S<span className="text-primary">LEXICON</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-charcoal/40 mt-0.5">
                The Art of Cooking
              </span>
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-10 font-medium">
            Your premium recipe companion. Discover curated masterpieces, personalize your culinary journey, and join a community of discerning food lovers.
          </p>

          <div className="flex items-center gap-4">
            <SocialIcon href="#" label="Facebook" bgClass="bg-charcoal/5 hover:bg-primary text-charcoal group">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current transition-colors group-hover:text-white" aria-hidden="true">
                <path d="M13.5 8.5V6.75c0-.57.43-.75.73-.75H16V3h-2.44C10.8 3 10 5 10 7v1.5H8V12h2v9h3.5v-9H16l.5-3.5h-3Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="LinkedIn" bgClass="bg-charcoal/5 hover:bg-primary text-charcoal group">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current transition-colors group-hover:text-white" aria-hidden="true">
                <path d="M6.55 8.25a2.1 2.1 0 1 1 .02-4.2 2.1 2.1 0 0 1-.02 4.2ZM4.8 9.8h3.5V20H4.8V9.8Zm5.4 0h3.35v1.4h.05c.47-.88 1.62-1.8 3.34-1.8 3.57 0 4.23 2.35 4.23 5.42V20h-3.5v-4.6c0-1.1-.02-2.5-1.52-2.5-1.52 0-1.75 1.2-1.75 2.42V20h-3.5V9.8Z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" label="Instagram" bgClass="bg-charcoal/5 hover:bg-primary text-charcoal group">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current transition-colors group-hover:text-white" aria-hidden="true">
                <path d="M7.75 3h8.5A4.75 4.75 0 0 1 21 7.75v8.5A4.75 4.75 0 0 1 16.25 21h-8.5A4.75 4.75 0 0 1 3 16.25v-8.5A4.75 4.75 0 0 1 7.75 3Zm0 1.8A2.95 2.95 0 0 0 4.8 7.75v8.5A2.95 2.95 0 0 0 7.75 19.2h8.5a2.95 2.95 0 0 0 2.95-2.95v-8.5a2.95 2.95 0 0 0-2.95-2.95h-8.5ZM12 8.4A3.6 3.6 0 1 1 8.4 12 3.6 3.6 0 0 1 12 8.4Zm0 1.8a1.8 1.8 0 1 0 1.8 1.8A1.8 1.8 0 0 0 12 10.2Zm4.15-2.95a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal">Useful links</h3>
          <ul className="mt-8 space-y-4 text-xs font-bold uppercase tracking-widest">
            {usefulLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal">Information</h3>
          <ul className="mt-8 space-y-4 text-xs font-bold uppercase tracking-widest">
            {informationLinks.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5 py-10">
        <div className="site-width flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/20">© {new Date().getFullYear()} Chef's Lexicon. All rights reserved.</p>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-charcoal/20">
            <a href="#" className="hover:text-charcoal transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-charcoal transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
