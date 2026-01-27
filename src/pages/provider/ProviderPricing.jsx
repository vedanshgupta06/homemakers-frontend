import { useEffect, useState } from "react";
import api from "../../api/axios";

const SERVICES = [
  { name: "BABYSITTING", type: "HOURLY_MONTHLY" },
  { name: "COOKING", type: "HOURLY_MONTHLY" },
  { name: "ELDER_CARE", type: "HOURLY_MONTHLY" },

  { name: "CLEANING", type: "FLAT_MONTHLY" },
  { name: "LAUNDRY", type: "FLAT_MONTHLY" },
  { name: "DISH_WASHING", type: "FLAT_MONTHLY" },
  { name: "DUSTING", type: "FLAT_MONTHLY" }
];

function ProviderPricing() {
  const [pricing, setPricing] = useState({});
  const [saving, setSaving] = useState({});

  /* =========================
     LOAD EXISTING PRICING
  ========================== */
  useEffect(() => {
    api.get("/api/provider/pricing")
      .then(res => {
        const map = {};
        res.data.forEach(p => {
          map[p.service] =
            p.pricingType === "HOURLY_MONTHLY"
              ? p.pricePerHour
              : p.monthlyRate;
        });
        setPricing(map);
      })
      .catch(() => {});
  }, []);

  const handleChange = (service, value) => {
    setPricing(prev => ({ ...prev, [service]: value }));
  };

  /* =========================
     SAVE PRICING
  ========================== */
  const savePricing = async (service, pricingType) => {
    const price = pricing[service];

    if (!price || isNaN(price) || Number(price) <= 0) {
      alert("Enter a valid price");
      return;
    }

    try {
      setSaving(prev => ({ ...prev, [service]: true }));

      await api.post("/api/provider/pricing", {
        service,
        pricingType,        // ✅ ENUM MATCHES BACKEND
        price: Number(price)
      });

      alert("Pricing saved successfully");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to save pricing");
    } finally {
      setSaving(prev => ({ ...prev, [service]: false }));
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2>My Service Pricing (Monthly)</h2>

      {SERVICES.map(({ name, type }) => (
        <div key={name} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 140, fontWeight: 600 }}>
            {name.replace("_", " ")}
          </div>

          <input
            type="number"
            value={pricing[name] || ""}
            onChange={e => handleChange(name, e.target.value)}
            placeholder={
              type === "HOURLY_MONTHLY"
                ? "₹ per hour (monthly)"
                : "₹ per month"
            }
            style={{ width: 140 }}
          />

          <button
            onClick={() => savePricing(name, type)}
            disabled={saving[name]}
          >
            {saving[name] ? "Saving..." : "Save"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProviderPricing;
