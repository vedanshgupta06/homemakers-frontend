import { useEffect, useState } from "react";
import { getAllProviders } from "../../../../api/adminProviderApi";

export default function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const res = await getAllProviders();
      setProviders(res.data || []);
    } catch (err) {
      console.error("Failed to load providers", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading providers...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>All Providers</h2>

      {providers.length === 0 && <p>No providers found.</p>}

      {providers.map((provider) => (
        <div
          key={provider.id}
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h3>{provider.user?.email}</h3>

          <p>
            <strong>City:</strong> {provider.city}
          </p>

          <p>
            <strong>Experience:</strong> {provider.experienceYears} years
          </p>

          <p>
            <strong>Rating:</strong> ⭐ {provider.rating} (
            {provider.totalRatings} reviews)
          </p>

          <p>
            <strong>Price per Hour:</strong> ₹{provider.pricePerHour}
          </p>

          <div style={{ marginTop: "10px" }}>
            <strong>Services:</strong>
            <div style={{ marginTop: "6px" }}>
              {provider.services?.map((service, i) => (
                <span
                  key={i}
                  style={{
                    background: "#f3f4f6",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    marginRight: "8px",
                    fontSize: "12px",
                  }}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                background: provider.verified ? "#16a34a" : "#dc2626",
                color: "white",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              {provider.verified ? "VERIFIED" : "NOT VERIFIED"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}