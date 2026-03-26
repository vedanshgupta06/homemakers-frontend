import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
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
      const res = await api.post("/api/auth/login", {
        email,
        password
      });

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
    <Container>

      <div className="flex justify-center items-center min-h-[80vh]">

        {/* ❌ NO onClick here */}
        <Card className="w-full max-w-md">

          {/* ✅ Wrap content */}
          <div className="relative z-10 space-y-5">

            {/* HEADER */}
            <div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back 
              </h2>
              <p className="text-sm text-gray-500">
                Login to continue
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full px-4 py-2 rounded-xl border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all duration-200
                "
                required
              />

              {/* PASSWORD */}
              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full px-4 py-2 pr-10 rounded-xl border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition-all duration-200
                  "
                  required
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>

              </div>

              {/* BUTTON */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

            </form>

            {/* FOOTER */}
            <p className="text-sm text-gray-500 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-medium">
                Register
              </Link>
            </p>

          </div>

        </Card>

      </div>

    </Container>
  );
};

export default Login;