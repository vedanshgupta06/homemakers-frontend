import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Home, ArrowLeft, Sparkles, Shield, Clock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { accessToken, role } = res.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(res.data));
      login(accessToken, role);
      if (role === "USER") navigate("/user");
      else if (role === "PROVIDER") navigate("/provider");
      else navigate("/admin");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Sparkles, text: "Professional home services" },
    { icon: Shield,   text: "Verified & trusted providers" },
    { icon: Clock,    text: "Flexible scheduling" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">

      {/* LEFT PANEL */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between bg-[#1E293B] p-12 overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-400/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* TOP - Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Home size={20} className="text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">TheHomemakers</span>
        </div>

        {/* MIDDLE - Hero content */}
        <div className="relative z-10 space-y-8">

          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Premium Home Services</span>
          </div>

          <div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tight leading-[1.05]">
              Your Home,<br />
              <span className="text-blue-400">Our Care.</span>
            </h1>
            <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-sm">
              Book trusted professionals for babysitting, cooking, cleaning and more — all in one place.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Decorative image card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-violet-500"].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-[#1E293B] flex items-center justify-center`}>
                    <span className="text-white text-[10px] font-black">{["A","B","C","D"][i]}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-xs font-black">500+ Happy Customers</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-2.5 h-2.5 rounded-sm bg-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              "TheHomemakers transformed how I manage my home. Reliable, professional, and always on time."
            </p>
            <p className="text-blue-400 text-xs font-black mt-2">— Priya S., Mumbai</p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft size={14} />
            Back to website
          </Link>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      {/* RIGHT PANEL - Form */}
<div className="flex w-full lg:w-1/2 items-center justify-center px-8 py-12 bg-white">
  <div className="w-full max-w-sm">

    {/* Mobile logo */}
    <div className="flex items-center gap-2 mb-8 lg:hidden">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
        <Home size={16} className="text-white" />
      </div>
      <span className="text-base font-black text-slate-800">TheHomemakers</span>
    </div>

    {/* Heading */}
    <div className="mb-8">
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Welcome Back</span>
      <h2 className="text-3xl font-black text-slate-900 mt-2 leading-tight">
        Sign in to your<br />
        <span className="text-blue-600">account</span>
      </h2>
      <p className="mt-3 text-sm text-slate-400">
        No account?{" "}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )}

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* Email */}
      <div>
        <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Email</label>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-300 transition-all"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-300 transition-all pr-11"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
          <input type="checkbox" className="w-3.5 h-3.5 rounded accent-blue-600" />
          Remember me
        </label>
        <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all mt-1
          ${loading
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"
          }`}
      >
        {loading ? "Signing in..." : "Sign In →"}
      </button>

    </form>

    {/* Divider */}
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-100" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-[10px] text-slate-300 uppercase tracking-widest">or</span>
      </div>
    </div>

    {/* Google */}
    <button className="flex w-full items-center justify-center gap-2.5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-600 transition-all">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-4 w-4" alt="Google" />
      Continue with Google
    </button>

  </div>
</div>
    </div>
  );
};

export default Login;