import { useEffect, useState } from "react";
import api from "../../api/axios";
import { IndianRupee, Clock, Sparkles, Check, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const SERVICES = [
  { name: "BABYSITTING",  type: "HOURLY_MONTHLY",  icon: "👶" },
  { name: "COOKING",      type: "HOURLY_MONTHLY",  icon: "🍳" },
  { name: "ELDER_CARE",   type: "HOURLY_MONTHLY",  icon: "🤝" },
  { name: "CLEANING",     type: "FLAT_MONTHLY",    icon: "🧹" },
  { name: "LAUNDRY",      type: "FLAT_MONTHLY",    icon: "👕" },
  { name: "DISH_WASHING", type: "FLAT_MONTHLY",    icon: "🍽️" },
  { name: "DUSTING",      type: "FLAT_MONTHLY",    icon: "🪣" },
];

export default function ProviderPricing() {
  const [pricing, setPricing] = useState({});
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const city = user?.city;

  useEffect(() => {
    api.get("/api/provider/pricing")
      .then(res => {
        const map = {};
        res.data.forEach(p => {
          map[p.service] = p.pricingType === "HOURLY_MONTHLY"
            ? p.pricePerHour : p.monthlyRate;
        });
        setPricing(map);
      })
      .catch(() => {});
  }, []);

  const handleChange = (service, value) => {
    setPricing(prev => ({ ...prev, [service]: value }));
    setError(prev => ({ ...prev, [service]: "" }));
  };

  const savePricing = async (service, type) => {
    const price = pricing[service];
    if (!price || isNaN(price) || Number(price) <= 0) {
      setError(prev => ({ ...prev, [service]: "Enter a valid price" }));
      return;
    }
    setSaving(prev => ({ ...prev, [service]: true }));
    try {
      await api.post("/api/provider/pricing", {
        service, pricingType: type, price: Number(price), city
      });
      setSaved(prev => ({ ...prev, [service]: true }));
      setTimeout(() => setSaved(prev => ({ ...prev, [service]: false })), 2000);
    } catch {
      setError(prev => ({ ...prev, [service]: "Failed to save" }));
    } finally {
      setSaving(prev => ({ ...prev, [service]: false }));
    }
  };

  const formatService = (s) =>
    s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  const hourlyServices = SERVICES.filter(s => s.type === "HOURLY_MONTHLY");
  const flatServices   = SERVICES.filter(s => s.type === "FLAT_MONTHLY");

  const allFilters = ["ALL", "HOURLY", "FLAT"];

  const visibleHourly = filter === "FLAT" ? [] : hourlyServices;
  const visibleFlat   = filter === "HOURLY" ? [] : flatServices;

  const setPrices = Object.values(pricing).filter(v => v > 0).length;
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
           <button
          onClick={() => navigate(-1)}
          className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
        >
          <ArrowLeft 
            size={18} 
            strokeWidth={2.5} 
            className="text-slate-900 transition-transform group-hover:-translate-x-0.5" 
          />
        </button>
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Set Your <span className="text-blue-400">Pricing</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium max-w-xl">
            Define how much you charge for each service. Customers see these rates when booking.
          </p>

          {setPrices > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
              <CheckCircle2 size={12} className="text-emerald-300" />
              <span className="text-emerald-200 text-xs font-bold">{setPrices} of {SERVICES.length} prices set</span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="px-[5%] pb-16">
        <div className="max-w-3xl mx-auto -mt-8 md:-mt-12 relative z-10 space-y-5">

          {/* FILTER TABS */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 flex gap-2">
            {allFilters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all
                  ${filter === f
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                    : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
                  }`}
              >
                {f === "ALL" ? "All Services" : f === "HOURLY" ? "Hourly" : "Fixed Rate"}
              </button>
            ))}
          </div>

          {/* HOURLY SERVICES */}
          {visibleHourly.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Clock size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Hourly Services</h3>
              </div>
              <p className="text-slate-400 text-xs ml-11 mb-6">Price charged per hour · billed monthly</p>

              <div className="space-y-3">
                {visibleHourly.map(({ name, icon }) => (
                  <PricingRow
                    key={name}
                    name={name}
                    icon={icon}
                    placeholder="₹ per hour"
                    suffix="/hr"
                    value={pricing[name] || ""}
                    onChange={val => handleChange(name, val)}
                    onSave={() => savePricing(name, "HOURLY_MONTHLY")}
                    saving={saving[name]}
                    saved={saved[name]}
                    error={error[name]}
                    formatService={formatService}
                  />
                ))}
              </div>
            </div>
          )}

          {/* FLAT SERVICES */}
          {visibleFlat.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Fixed Rate Services</h3>
              </div>
              <p className="text-slate-400 text-xs ml-11 mb-6">Flat monthly rate · no hourly tracking</p>

              <div className="space-y-3">
                {visibleFlat.map(({ name, icon }) => (
                  <PricingRow
                    key={name}
                    name={name}
                    icon={icon}
                    placeholder="₹ per month"
                    suffix="/mo"
                    value={pricing[name] || ""}
                    onChange={val => handleChange(name, val)}
                    onSave={() => savePricing(name, "FLAT_MONTHLY")}
                    saving={saving[name]}
                    saved={saved[name]}
                    error={error[name]}
                    formatService={formatService}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function PricingRow({ name, icon, placeholder, suffix, value, onChange, onSave, saving, saved, error, formatService }) {
  const hasPrice = value > 0;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border-2 transition-all
      ${saved ? "border-emerald-100 bg-emerald-50/20" : hasPrice ? "border-blue-100 bg-blue-50/10" : "border-slate-100 bg-slate-50/50"}`}>

      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border-2
          ${saved ? "border-emerald-200 bg-emerald-50" : hasPrice ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">{formatService(name)}</p>
          {error && (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
              <AlertCircle size={9} /> {error}
            </p>
          )}
          {saved && (
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={9} /> Saved!
            </p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all
          ${error ? "border-red-200 bg-red-50" : "border-slate-100 bg-white focus-within:border-blue-500"}`}>
          <IndianRupee size={13} className="text-slate-400 flex-shrink-0" />
          <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder.replace("₹ ", "")}
            className="w-24 text-sm font-bold text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
          />
          <span className="text-[10px] font-black text-slate-400 uppercase">{suffix}</span>
        </div>

        <button
          onClick={onSave}
          disabled={saving || saved}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all
            ${saved
              ? "bg-emerald-500 text-white cursor-default"
              : saving
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : !value
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 active:scale-95"
            }`}
        >
          {saved ? <Check size={12} strokeWidth={4} /> : saving ? "..." : <Check size={12} strokeWidth={4} />}
          {saved ? "Saved" : saving ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}