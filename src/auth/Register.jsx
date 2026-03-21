import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("USER");
  const [city, setCity] = useState(""); // ✅ FIX

  const cities = ["Delhi", "Mumbai", "Pune", "Nagpur", "Bangalore"];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      await api.post("/api/users/register",{
        name,
        email,
        password,
        role,
        city   // ✅ now works
      });

      alert("Registration successful");

      navigate("/login");

    }catch(err){

      console.error(err);
      alert("Registration failed");

    }

  };

  return (

    <div style={{padding:"40px"}}>

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <br/><br/>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <label>Register As</label>

        <br/>

        <select
          value={role}
          onChange={(e)=>setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="PROVIDER">Provider</option>
        </select>

        <br/><br/>

        {/* ✅ CITY FIX */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        >
          <option value="">Select City</option>
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <br/><br/>

        <button type="submit">
          Register
        </button>

      </form>

    </div>

  );

};

export default Register;