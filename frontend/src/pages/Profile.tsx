import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getFavorites,
  getRecipeImageUrl,
  updateProfile,
  changePassword,
  uploadProfileImage,
  type Recipe,
} from "../lib/api";
import AdminRecipeManager from "../components/AdminRecipeManager";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Profile() {
  const { user, token, logout, isLoading: authLoading, setUser } = useAuth();
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "password">("profile");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  // Form States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchFavorites = async () => {
      if (user?.role === "admin") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getFavorites();
        setSavedRecipes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load collection");
      } finally {
        setLoading(false);
      }
    };

    void fetchFavorites();
    window.scrollTo(0, 0);
  }, [navigate, token, authLoading, user?.role]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError(null);
    setSettingsSuccess(null);

    try {
      const updatedUser = await updateProfile(profileForm);
      setUser(updatedUser);
      setSettingsSuccess("Profile updated successfully");
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSettingsError("Passwords do not match");
      return;
    }

    setSettingsLoading(true);
    setSettingsError(null);
    setSettingsSuccess(null);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSettingsSuccess("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSettingsLoading(true);
    setSettingsError(null);
    setSettingsSuccess(null);

    try {
      const updatedUser = await uploadProfileImage(file);
      setUser(updatedUser);
      setSettingsSuccess("Profile photo updated");
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setSettingsLoading(false);
    }
  };

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

  const collectionSection = (
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
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("unsplash")) {
                      target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=60&w=400&h=500";
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
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />

      <main className="flex-1 py-16 site-width">
        <div className="mb-20">
          <div className="glass p-10 sm:p-16 rounded-[4rem] border border-white/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-1000" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <div className="relative group/avatar">
                  <div className="w-24 h-24 rounded-4xl bg-charcoal flex items-center justify-center text-4xl font-serif font-black text-white shadow-2xl shadow-charcoal/20 overflow-hidden">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all opacity-0 group-hover/avatar:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">
                    {user.role === "admin" ? "Profile & Admin Studio" : "Personal Archive"}
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-serif font-black text-charcoal leading-tight mb-2">
                    {user.name}
                  </h1>
                  <p className="text-charcoal/40 text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-4 rounded-2xl bg-white/50 text-charcoal hover:bg-charcoal hover:text-white transition-all shadow-sm group"
                  title="Profile Settings"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                {user.role !== "admin" && (
                  <div className="px-8 py-4 glass rounded-3xl border border-black/5 flex flex-col items-center">
                    <span className="text-2xl font-serif font-black text-charcoal">{savedRecipes.length}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">Masterpieces</span>
                  </div>
                )}
                {user.role === "admin" && (
                  <div className="px-8 py-4 glass rounded-3xl border border-black/5 flex flex-col items-center">
                    <span className="text-2xl font-serif font-black text-charcoal">CRUD</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/30">Enabled</span>
                  </div>
                )}
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

        {user.role === "admin" ? (
          <AdminRecipeManager adminName={user.name} />
        ) : (
          collectionSection
        )}
      </main>

      <Footer />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-black text-charcoal">Settings</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Configure your experience</p>
              </div>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setSettingsError(null);
                  setSettingsSuccess(null);
                }}
                className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-charcoal/40 hover:bg-black/10 hover:text-charcoal transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-8 border-b border-black/5">
              <button
                onClick={() => setSettingsTab("profile")}
                className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                  settingsTab === "profile" ? "text-charcoal" : "text-charcoal/30 hover:text-charcoal/60"
                }`}
              >
                Profile Info
                {settingsTab === "profile" && (
                  <span className="absolute bottom-0 left-6 right-6 h-1 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSettingsTab("password")}
                className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                  settingsTab === "password" ? "text-charcoal" : "text-charcoal/30 hover:text-charcoal/60"
                }`}
              >
                Security
                {settingsTab === "password" && (
                  <span className="absolute bottom-0 left-6 right-6 h-1 bg-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {settingsError && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-500 text-sm font-bold border border-red-100">
                  {settingsError}
                </div>
              )}
              {settingsSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                  {settingsSuccess}
                </div>
              )}

              {settingsTab === "profile" ? (
                <div className="space-y-8">
                  {/* Photo Upload */}
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-4xl bg-charcoal flex items-center justify-center text-5xl font-serif font-black text-white shadow-xl overflow-hidden">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={settingsLoading}
                        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all rounded-4xl disabled:opacity-50"
                      >
                        <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[8px] font-black uppercase tracking-widest">Update Photo</span>
                      </button>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-serif font-black text-charcoal">Profile Photo</h4>
                      <p className="text-sm text-charcoal/40 font-medium mt-1">A professional photo makes your profile more personal.</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Display Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Email Address</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="w-full bg-charcoal text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all disabled:opacity-50"
                    >
                      {settingsLoading ? "Saving..." : "Update Profile"}
                    </button>
                  </form>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full bg-black/5 border border-black/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className="w-full bg-charcoal text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all disabled:opacity-50"
                  >
                    {settingsLoading ? "Updating..." : "Change Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
