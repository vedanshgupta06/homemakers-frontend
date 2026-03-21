import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await api.post("/api/auth/login", {
        email,
        password
      });

      console.log("LOGIN RESPONSE:", res.data);

      const { accessToken, role } = res.data;

      if (!accessToken || !role) {
        alert("Invalid login response");
        return;
      }

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(res.data)); 
      login(accessToken, role);

      if (role === "USER") navigate("/user");
      else if (role === "PROVIDER") navigate("/provider");
      else if (role === "ADMIN") navigate("/admin");

    } catch (err) {

      console.error("Login failed", err);
      alert("Invalid email or password");

    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>

      </form>

      <br />

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>

    </div>

  );
};

export default Login;