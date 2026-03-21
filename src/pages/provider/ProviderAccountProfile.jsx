import { useEffect, useState } from "react";
import api from "../../api/axios";

function ProviderAccountProfile() {

  const [provider, setProvider] = useState(null);
  const [city, setCity] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const res = await api.get("/api/provider/me");

      setProvider(res.data);

      setCity(res.data.city || "");
      setExperienceYears(res.data.experienceYears || "");

    } catch {

      setMessage("Failed to load profile");

    }

  };

  const updateProfile = async () => {

    try {

      setLoading(true);
      setMessage("");

      await api.put("/api/provider/me", {
        city,
        experienceYears
      });

      setMessage("Profile updated successfully");

      loadProfile();

    } catch (err) {

      setMessage(
        err.response?.data?.message || "Failed to update profile"
      );

    } finally {

      setLoading(false);

    }

  };

  if (!provider) return <p>Loading profile...</p>;

  return (

    <div style={{ padding: "30px" }}>

      <h2>My Profile</h2>

      {/* PHOTO */}

      <div style={{ marginBottom: "20px" }}>

        <h4>Profile Photo</h4>

        {provider.profilePhotoUrl ? (

          <img
            src={`http://localhost:8080${provider.profilePhotoUrl}`}
            alt="profile"
            width="140"
            style={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb"
            }}
          />

        ) : (

          <p>No photo uploaded</p>

        )}

      </div>

      {/* BASIC INFO */}

      <div style={{ marginBottom: "20px" }}>

        <p>
          <strong>Email:</strong> {provider.user?.email}
        </p>

        <p>
          <strong>Rating:</strong> ⭐ {provider.rating} ({provider.totalRatings} reviews)
        </p>

        <p>
          <strong>Verification:</strong>{" "}
          {provider.verified ? (
            <span style={{ color: "green" }}>Verified ✔</span>
          ) : (
            <span style={{ color: "red" }}>Pending Verification</span>
          )}
        </p>

      </div>

      {/* EDITABLE INFO */}

      <div style={{ marginBottom: "20px" }}>

        <h4>Edit Basic Info</h4>

        <div style={{ marginBottom: "10px" }}>

          <label>City</label>

          <br />

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "6px",
              width: "220px"
            }}
          />

        </div>

        <div>

          <label>Experience (Years)</label>

          <br />

          <input
            type="number"
            min="0"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            style={{
              padding: "6px",
              width: "220px"
            }}
          />

        </div>

      </div>

      {/* SERVICES */}

      <div style={{ marginBottom: "20px" }}>

        <h4>Services Offered</h4>

        {provider.services?.length === 0 && (
          <p>No services selected</p>
        )}

        {provider.services?.map(service => (

          <span
            key={service}
            style={{
              background: "#f3f4f6",
              padding: "6px 12px",
              borderRadius: "20px",
              marginRight: "8px",
              fontSize: "13px"
            }}
          >
            {service.replace("_"," ")}
          </span>

        ))}

      </div>

      {/* SAVE BUTTON */}

      <button
        onClick={updateProfile}
        disabled={loading}
        style={{
          padding: "10px 18px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >

        {loading ? "Updating..." : "Update Profile"}

      </button>

      {message && (

        <p style={{ marginTop: "10px", color: "green" }}>
          {message}
        </p>

      )}

    </div>

  );

}

export default ProviderAccountProfile;