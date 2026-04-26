import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { Home, ArrowLeft, Sparkles, Shield, Clock, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole]               = useState("USER");
  const [city, setCity]               = useState("");
  const [pincode, setPincode]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const cities = ["Delhi", "Mumbai", "Pune", "Nagpur", "Bangalore"];
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/users/register", {
        name, email, password, role, city,
        pincode: pincode || null,
      });
      navigate("/login");
    } catch {
      setError("Registration failed. Please try again.");
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
    <div className="flex min-h-screen font-sans">

      {/* LEFT PANEL */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between bg-[#1E293B] p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-400/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
            <Home size={20} className="text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">TheHomemakers</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Join TheHomemakers</span>
          </div>

          <div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tight leading-[1.05]">
              Start Your<br />
              <span className="text-blue-400">Journey.</span>
            </h1>
            <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-sm">
              Join thousands of happy homeowners who trust our verified professionals for daily home services.
            </p>
          </div>

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

          <div className="grid grid-cols-3 gap-4">
            {[["500+", "Customers"], ["50+", "Providers"], ["4.8★", "Rating"]].map(([val, label]) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-white font-black text-lg">{val}</p>
                <p className="text-slate-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft size={14} />
            Back to website
          </Link>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-8 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <span className="text-base font-black text-slate-800">TheHomemakers</span>
          </div>

          <div className="mb-8">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Get Started</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2 leading-tight">
              Create your<br />
              <span className="text-blue-600">account</span>
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Name */}
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-300 transition-all"
                required
              />
            </div>

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
                  placeholder="Min. 8 characters"
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

            {/* Role + City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Account Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                >
                  <option value="USER">User</option>
                  <option value="PROVIDER">Provider</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                  required
                >
                  <option value="">Select</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pincode — used for provider matching */}
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5 block">
                Pincode <span className="normal-case font-medium text-slate-400">(helps find nearby providers)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 440010"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                pattern="[0-9]{6}"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white placeholder:text-slate-300 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide transition-all mt-1
                ${loading
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98]"
                }`}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>

          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[10px] text-slate-300 uppercase tracking-widest">or</span>
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-2.5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-600 transition-all">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-4 w-4" alt="Google" />
            Continue with Google
          </button>

        </div>
      </div>
    </div>
  );
};

export default Register;