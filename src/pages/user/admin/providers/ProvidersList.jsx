import { useEffect, useState } from "react";
import {
  getAllProviders,
  verifyProvider
} from "../../../../api/adminProviderApi";

export default function ProvidersList() {

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {

    try {

      setLoading(true);

      const res = await getAllProviders();

      console.log("Providers API response:", res.data);

      // Ensure providers is always an array
      if (Array.isArray(res.data)) {
        setProviders(res.data);
      } else {
        setProviders([]);
      }

    } catch (err) {

      console.error("Failed to load providers", err);
      setProviders([]);

    } finally {

      setLoading(false);

    }

  };

  const handleVerify = async (id) => {

    try {

      await verifyProvider(id);

      alert("Provider verified successfully");

      loadProviders();

    } catch (err) {

      console.error("Verification failed", err);

      alert("Verification failed");

    }

  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <p>Loading providers...</p>
      </div>
    );
  }

  return (

    <div style={{ padding: "30px" }}>

      <h2 style={{ marginBottom: "20px" }}>All Providers</h2>

      {/* Providers count */}
      <p style={{ marginBottom: "15px" }}>
        Total Providers: {providers.length}
      </p>

      {providers.length === 0 ? (

        <p>No providers found.</p>

      ) : (

        providers.map((provider) => (

          <div
            key={provider.id}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >

            <h3>{provider.user?.email || "Unknown Provider"}</h3>

            <p><strong>City:</strong> {provider.city || "N/A"}</p>

            <p><strong>Experience:</strong> {provider.experienceYears} years</p>

            <p>
              <strong>Rating:</strong> ⭐ {provider.rating} ({provider.totalRatings} reviews)
            </p>

            <p><strong>Price per Hour:</strong> ₹{provider.pricePerHour}</p>

            {/* SERVICES */}

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
                      fontSize: "12px"
                    }}
                  >
                    {service.replace("_", " ")}
                  </span>

                ))}

              </div>

            </div>

            {/* PROFILE PHOTO */}

            <div style={{ marginTop: "15px" }}>

              <strong>Profile Photo:</strong>

              <div style={{ marginTop: "8px" }}>

                {provider.profilePhotoUrl ? (

                  <img
                    src={`http://localhost:8080${provider.profilePhotoUrl}`}
                    alt="provider"
                    width="120"
                    style={{ borderRadius: "10px" }}
                  />

                ) : (

                  <p>No photo uploaded</p>

                )}

              </div>

            </div>

            {/* DOCUMENTS */}

            <div style={{ marginTop: "15px" }}>

              <strong>Documents:</strong>

              <div style={{ marginTop: "8px" }}>

                {provider.idProofUrl && (
                  <a
                    href={`http://localhost:8080${provider.idProofUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginRight: "15px" }}
                  >
                    View ID Proof
                  </a>
                )}

                {provider.addressProofUrl && (
                  <a
                    href={`http://localhost:8080${provider.addressProofUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Address Proof
                  </a>
                )}

                {!provider.idProofUrl && !provider.addressProofUrl && (
                  <p>No documents uploaded</p>
                )}

              </div>

            </div>

            {/* STATUS */}

            <div style={{ marginTop: "15px" }}>

              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: provider.verified ? "#16a34a" : "#dc2626",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: "bold"
                }}
              >
                {provider.verified ? "VERIFIED" : "NOT VERIFIED"}
              </span>

            </div>

            {/* VERIFY BUTTON */}

            {!provider.verified && (

              <button
                onClick={() => handleVerify(provider.id)}
                style={{
                  marginTop: "15px",
                  padding: "8px 14px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Verify Provider
              </button>

            )}

          </div>

        ))

      )}

    </div>

  );

}