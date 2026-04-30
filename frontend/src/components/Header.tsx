import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/Logo.png";

interface HeaderProps {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function Header({
  showSearch = false,
  searchValue = "",
  onSearchChange,
}: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass border-b border-black/5">
      <div className="site-width flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white border border-black/5 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <img
                src={logo}
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
        </div>

        <nav className="flex items-center justify-center gap-1 text-[12px] font-bold uppercase tracking-wider">
          <Link to="/" className="px-4 py-2 text-charcoal/60 hover:text-primary transition-colors relative group">
            Home
            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
          <Link to="/recipes" className="px-4 py-2 text-charcoal/60 hover:text-primary transition-colors relative group">
            Recipes
            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
          <Link to="/about" className="px-4 py-2 text-charcoal/60 hover:text-primary transition-colors relative group">
            About
            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
          <Link to="/contact" className="px-4 py-2 text-charcoal/60 hover:text-primary transition-colors relative group">
            Contact
            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          {showSearch && (
            <div className="relative group hidden lg:block">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-charcoal/30 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search recipes..."
                className="w-56 rounded-full border border-black/5 bg-black/2 py-2 pl-11 pr-4 text-xs focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex flex-col items-end group">
                  <span className="text-[11px] font-black text-charcoal group-hover:text-primary transition-colors">{user.name}</span>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">Member</span>
                </Link>
                <button
                  onClick={logout}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-black/3 text-charcoal/50 hover:bg-red-50 hover:text-red-500 transition-all group"
                  title="Logout"
                >
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-[12px] font-bold text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-charcoal px-5 py-2 text-[12px] font-bold text-white shadow-lg shadow-charcoal/10 hover:bg-primary hover:-translate-y-0.5 transition-all"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
