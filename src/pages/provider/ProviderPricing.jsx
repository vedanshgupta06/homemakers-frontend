import { useEffect, useState } from "react";
import api from "../../api/axios";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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
  const [selectedService, setSelectedService] = useState("ALL");

  const user = JSON.parse(localStorage.getItem("user"));
  const city = user?.city;

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

  const savePricing = async (service, pricingType) => {
    const price = pricing[service];

    if (!price || isNaN(price) || Number(price) <= 0) {
      alert("Enter valid price");
      return;
    }

    try {
      setSaving(prev => ({ ...prev, [service]: true }));

      await api.post("/api/provider/pricing", {
        service,
        pricingType,
        price: Number(price),
        city
      });

      alert("Saved!");
    } catch {
      alert("Failed");
    } finally {
      setSaving(prev => ({ ...prev, [service]: false }));
    }
  };

  // 🔥 FILTERED SERVICES
  const filteredServices =
    selectedService === "ALL"
      ? SERVICES
      : SERVICES.filter(s => s.name === selectedService);

  return (
    <Container>
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">

        {/* 🔥 HEADER */}
        <div className="relative">
          <div className="
            absolute -top-16 -left-10 w-72 h-72 
            bg-pink-400/20 blur-3xl rounded-full
            pointer-events-none
          "></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              Set Your Pricing 💰
            </h2>
            <p className="text-textSub mt-2">
              Define how much you charge
            </p>
          </div>
        </div>

        {/* 🔥 SERVICE CHIPS */}
        <div className="flex flex-wrap gap-2">

          <Chip
            active={selectedService === "ALL"}
            onClick={() => setSelectedService("ALL")}
          >
            All
          </Chip>

          {SERVICES.map(s => (
            <Chip
              key={s.name}
              active={selectedService === s.name}
              onClick={() => setSelectedService(s.name)}
            >
              {s.name.replaceAll("_", " ")}
            </Chip>
          ))}
        </div>

        {/* 📋 PRICING */}
        <Card>
          <div className="space-y-5">

            {filteredServices.map(({ name, type }) => (
              <div
                key={name}
                className="
                  flex flex-col md:flex-row md:items-center 
                  justify-between gap-3 border-b pb-4 last:border-none
                "
              >

                <div className="font-medium">
                  {name.replaceAll("_", " ")}
                </div>

                <div className="flex gap-3 items-center">

                  <input
                    type="number"
                    value={pricing[name] || ""}
                    onChange={e => handleChange(name, e.target.value)}
                    placeholder={
                      type === "HOURLY_MONTHLY"
                        ? "₹ / hour"
                        : "₹ / month"
                    }
                    className="
                      border rounded-xl px-3 py-2 w-36
                      focus:ring-2 focus:ring-purple-400
                    "
                  />

                  <Button
                    onClick={() => savePricing(name, type)}
                    disabled={saving[name]}
                  >
                    {saving[name] ? "Saving..." : "Save"}
                  </Button>

                </div>

              </div>
            ))}

          </div>
        </Card>

      </div>
    </Container>
  );
}

/* 🔥 CHIP COMPONENT */
const Chip = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-1.5 rounded-full text-sm font-medium transition

      ${
        active
          ? "bg-brand-gradient text-white shadow-glow"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }
    `}
  >
    {children}
  </button>
);

export default ProviderPricing;