import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import { Link } from "react-router-dom";
import { SERVICES } from "../../../../constants/services";

function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [service, setService] = useState("");
  const [error, setError] = useState("");

  const loadProviders = async () => {
    try {
      const res = await api.get(`/api/providers/search?service=${service}`);
      setProviders(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load providers");
    }
  };

  useEffect(() => {
    loadProviders();
  }, [service]);

  return (
    <div>
      <h2>Find Providers</h2>

      <label>Select Service:</label>
        <select value={service} onChange={e => setService(e.target.value)}>
        <option value="">Select Service</option>
        {SERVICES.map(s => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>


      {error && <p style={{ color: "red" }}>{error}</p>}

      {providers.length === 0 ? (
        <p>No providers available</p>
      ) : (
        <ul>
          {providers.map(p => (
            <li key={p.id}>
              <b>{p.user.email}</b><br />
              <b>Experience:</b> {p.experienceYears} years<br />
              <b>Price:</b> ₹{p.pricePerHour}/hour<br />
              <Link to={`/user/providers/${p.id}`}>
                View Slots
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProvidersList;
