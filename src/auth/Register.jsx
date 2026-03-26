import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Register = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("USER");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = ["Delhi", "Mumbai", "Pune", "Nagpur", "Bangalore"];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try{

      await api.post("/api/users/register",{
        name,
        email,
        password,
        role,
        city
      });

      navigate("/login");

    }catch(err){
      console.error(err);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <Container>

      <div className="flex justify-center items-center min-h-[80vh]">

        <Card className="w-full max-w-md space-y-5">

          {/* HEADER */}
          <div>
            <h2 className="text-2xl font-semibold text-primary">
              Create account 
            </h2>
            <p className="text-sm text-gray-500">
              Join Homemakers today
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

            {/* NAME */}
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            {/* ROLE */}
            <select
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="USER">User</option>
              <option value="PROVIDER">Provider</option>
            </select>

            {/* CITY */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select City</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* BUTTON */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </Button>

          </form>

          {/* FOOTER */}
          <p className="text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Login
            </Link>
          </p>

        </Card>

      </div>

    </Container>

  );

};

export default Register;