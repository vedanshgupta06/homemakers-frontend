import { useEffect, useState } from "react";
import api from "../../api/axios";
import { SERVICES } from "../../constants/services";

function ProviderProfile() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Load provider profile ONCE
  useEffect(() => {
    api.get("/api/provider/me")
      .then(res => {
        setSelectedServices(res.data.services || []);
      })
      .catch(() => {
        setMessage("Failed to load provider profile");
      });
  }, []);

  // ✅ CORRECT TOGGLE LOGIC
  const toggleService = (service) => {
    setSelectedServices(prevServices => {
      if (prevServices.includes(service)) {
        // remove
        return prevServices.filter(s => s !== service);
      } else {
        // add
        return [...prevServices, service];
      }
    });
  };

  const saveProfile = async () => {
    if (selectedServices.length === 0) {
      setMessage("Please select at least one service");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await api.put("/api/provider/me/services", selectedServices);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Profile</h2>
      <h4>Services Offered</h4>

      {SERVICES.map(service => (
        <div key={service}>
          <label>
            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={() => toggleService(service)}
            />
            {" "}
            {service.replace("_", " ")}
          </label>
        </div>
      ))}

      <br />

      <button
        onClick={saveProfile}
        disabled={loading || selectedServices.length === 0}
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>

      {message && (
        <p style={{ marginTop: "10px", color: "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ProviderProfile;
