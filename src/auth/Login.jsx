import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Components (assuming these handle basic padding/styling)
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

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
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* LEFT SIDE: Branding & Background */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#0a192f] p-12 text-white lg:flex">
        {/* Background Image Overlay (Geometric patterns) */}
        <div 
          className="absolute inset-0 opacity-40" 
          style={{ 
            backgroundImage: "url('https://your-image-source.com/geometric-bg.jpg')", // Replace with your actual asset
            backgroundSize: 'cover' 
          }}
        />
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
             <span className="font-bold text-white">Vp</span>
          </div>
          <span className="text-xl font-bold tracking-tight">VidPro</span>
          <button className="ml-auto text-sm text-gray-300 hover:text-white transition-colors">
            ← Back to Website
          </button>
        </div>

        <div className="relative z-10 mb-20 max-w-md">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Edit Smarter. Export Faster. <br />
            Create Anywhere.
          </h1>
          <p className="mt-6 text-gray-300 text-lg">
            From quick social media clips to full-length videos, our powerful editor lets you work seamlessly across devices.
          </p>
          <div className="mt-8 flex gap-2">
            <div className="h-1 w-8 rounded-full bg-white"></div>
            <div className="h-1 w-2 rounded-full bg-white/30"></div>
            <div className="h-1 w-2 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="mt-2 text-gray-500">Log in to start creating stunning videos with ease.</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Input your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Input your company name" // Match placeholder from screenshot
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                Remember Me
              </label>
              <Link to="/forgot-password" title="Forgot Password?" className="text-sm text-gray-400 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-4 font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-black hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;