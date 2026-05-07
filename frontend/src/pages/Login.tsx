import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import bgImage from "../assets/Recipe_books.png";
import logo from "../assets/Logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/profile" : "/", { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const err = submitError ?? error;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg">
        {/* Main Card */}
        <div className="relative glass rounded-[3rem] p-10 sm:p-14 shadow-2xl border border-white/20 overflow-hidden min-h-150 flex flex-col">

          <div className="flex-1 flex flex-col relative z-10">
            {/* Logo Section */}
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-3 mb-8 group mx-auto">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-white border border-black/5 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={logo}
                    alt="Chef's Lexicon logo"
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl font-serif font-black tracking-tight text-charcoal leading-none">
                    CHEF'S<span className="text-primary">LEXICON</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40 mt-1">
                    The Art of Cooking
                  </span>
                </div>
              </Link>

              <h2 className="text-3xl font-serif font-black text-charcoal leading-tight mb-4">
                Welcome <span className="italic text-primary">Back</span>
              </h2>
              <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest">
                Sign in to your culinary collection
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {err && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-[10px] font-bold text-red-600 border border-red-100 uppercase tracking-widest animate-shake text-center">
                  {err}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-charcoal/40 uppercase tracking-[0.2em] ml-4">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-charcoal/20 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="block w-full pl-12 pr-5 py-4 bg-white/50 border border-black/5 rounded-2xl text-sm font-medium placeholder-charcoal/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-charcoal/40 uppercase tracking-[0.2em] ml-4">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-charcoal/20 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-4 bg-white/50 border border-black/5 rounded-2xl text-sm font-medium placeholder-charcoal/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-charcoal/20 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center group cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 border-black/5 rounded bg-white/50 text-primary focus:ring-primary/20" />
                  <span className="ml-3 text-[10px] font-black text-charcoal/40 uppercase tracking-widest group-hover:text-charcoal transition-colors">Remember Me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-charcoal text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-charcoal/20 hover:bg-primary hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              >
                {submitting ? "Processing..." : "Sign In"}
              </button>

              <p className="mt-10 text-center text-[10px] font-black text-charcoal/40 uppercase tracking-widest">
                New to the lexicon?{" "}
                <Link to="/register" className="text-primary hover:text-primary-dark transition-colors underline underline-offset-4 decoration-2 decoration-primary/20">
                  Create Account
                </Link>
              </p>
            </form>
          </div>

          {/* Decorative Floating Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] z-0 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] z-0 translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
