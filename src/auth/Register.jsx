import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

// Components
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = ["Delhi", "Mumbai", "Pune", "Nagpur", "Bangalore"];
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/users/register", {
        name,
        email,
        password,
        role,
        city,
      });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* LEFT SIDE: Branding (Consistent with Login) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-[#0a192f] p-12 text-white lg:flex">
        <div 
          className="absolute inset-0 opacity-40" 
          style={{ 
            backgroundImage: "url('https://your-image-source.com/geometric-bg.jpg')", 
            backgroundSize: 'cover' 
          }}
        />
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
             <span className="font-bold text-white">Vp</span>
          </div>
          <span className="text-xl font-bold tracking-tight">VidPro</span>
          <Link to="/" className="ml-auto text-sm text-gray-300 hover:text-white transition-colors">
            ← Back to Website
          </Link>
        </div>

        <div className="relative z-10 mb-20 max-w-md">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Start Your Creative <br />
            Journey Today.
          </h1>
          <p className="mt-6 text-gray-300 text-lg">
            Join thousands of creators using VidPro to streamline their workflow and deliver high-quality content faster.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Register Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-500">Sign up to get started with VidPro.</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* FULL NAME */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* ROLE & CITY (Grid for better spacing) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Account Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="USER">User</option>
                  <option value="PROVIDER">Provider</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-4 mt-4 font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-black hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;