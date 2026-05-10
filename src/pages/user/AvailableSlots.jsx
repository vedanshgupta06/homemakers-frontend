

// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { useNavigate } from "react-router-dom";
// import ProviderCard from "../../components/booking/ProviderCard";
// import SkeletonCard from "../../components/ui/SkeletonCard";
// import { Users, Trophy, CalendarCheck, SearchX, ArrowLeft } from "lucide-react";

// const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];

// function AvailableSlots() {
//   const location = useLocation();
//   const navigate  = useNavigate();

//   const {
//     services,
//     hoursPerDay,
//     houseSize,
//     members,
//     date,
//     preferredStartTime,
//   } = location.state || {};

//   const [providers, setProviders] = useState([]);
//   const [loading, setLoading]     = useState(true);

//   const normalizedDate = date || null;

//   const displayDate = date
//     ? (() => {
//         const [year, month, day] = date.split("-").map(Number);
//         return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
//           weekday: "long", month: "long", day: "numeric",
//         });
//       })()
//     : "";

//   useEffect(() => {
//     if (!services || services.length === 0) return;
//     setLoading(true);

//     api.post("/api/bookings/provider-options", {
//       services: services.map(s => ({
//         serviceType: s,
//         hours: HOURLY_SERVICES.includes(s) ? hoursPerDay : null,
//       })),
//       houseSize,
//       members,
//       startDate: date,
//     })
//     .then(res => {
//       const providerOptions = res.data;
//       const promises = providerOptions.map(p =>
//         api.get(`/api/provider/availability/${p.providerId}`)
//           .then(slotRes => ({ ...p, slots: slotRes.data }))
//           .catch(() => ({ ...p, slots: [] })) // ✅ don't let one failure kill all providers
//       );
//       Promise.all(promises)
//         .then(setProviders)
//         .finally(() => setLoading(false));
//     })
//     .catch(err => {
//       console.error("Error fetching providers:", err);
//       setLoading(false);
//     });
//   }, [services]);

//   // ✅ FIX: slot.date is now "yyyy-MM-dd" string (JsonFormat added to AvailabilityResponse)
//   // Previously Jackson serialized LocalDate as [2026,4,30] array which never matched
//   const validProviders = providers.filter(provider => {
//     const validSlots = (provider.slots || []).filter(slot => {
//       const slotDate = typeof slot.date === "string"
//         ? slot.date.split("T")[0]   // handles both "2026-04-30" and "2026-04-30T00:00:00"
//         : null;
//       return slotDate === normalizedDate && slot.active === true;
//     });
//     return validSlots.length > 0;
//   });

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">

//       {/* HERO */}
//       <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
//         <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

//         <div className="max-w-7xl mx-auto relative">
//           <button
//             onClick={() => navigate(-1)}
//             className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
//           >
//             <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
//           </button>

//           <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
//             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
//             <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Step 4 of 4</span>
//           </div>

//           <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
//             Choose Your <span className="text-blue-400">Professional</span>
//           </h2>
//           <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl leading-relaxed">
//             Available providers for {displayDate}
//           </p>

//           {!loading && validProviders.length > 0 && (
//             <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 rounded-full px-4 py-1.5">
//               <Users size={12} className="text-white" />
//               <span className="text-white text-xs font-bold">
//                 {validProviders.length} provider{validProviders.length > 1 ? "s" : ""} available near you
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN CARD */}
//       <div className="px-[5%] pb-16">
//         <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

//           <div className="flex items-center gap-3 mb-1">
//             <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
//               <CalendarCheck size={14} className="text-white" />
//             </div>
//             <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Available Providers</h3>
//           </div>
//           <p className="text-slate-400 text-xs ml-11 mb-8">
//             Sorted by best match · nearest providers shown first
//           </p>

//           {loading && (
//             <div className="space-y-4">
//               {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
//             </div>
//           )}

//           {!loading && validProviders.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20 text-center">
//               <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
//                 <SearchX size={28} className="text-slate-400" />
//               </div>
//               <p className="text-base font-black text-slate-800 uppercase tracking-tight">
//                 No Providers Available
//               </p>
//               <p className="text-sm text-slate-400 mt-2 max-w-xs">
//                 No one is available in your area on this date. Try a different date or update your pincode in your profile.
//               </p>
//             </div>
//           )}

//           {!loading && validProviders.length > 0 && (
//             <div className="space-y-5">
//               {validProviders.map((provider, index) => (
//                 <div key={provider.providerId}>

//                   {index === 0 && (
//                     <div className="flex items-center gap-2 mb-3">
//                       <div className="inline-flex items-center gap-1.5 bg-[#1E293B] rounded-full px-3 py-1.5">
//                         <Trophy size={11} className="text-yellow-400" />
//                         <span className="text-white text-[10px] font-black uppercase tracking-widest">Best Match</span>
//                       </div>
//                       <div className="flex-1 h-px bg-slate-100" />
//                     </div>
//                   )}

//                   {index === 1 && validProviders.length > 1 && (
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="flex-1 h-px bg-slate-100" />
//                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Other Options</span>
//                       <div className="flex-1 h-px bg-slate-100" />
//                     </div>
//                   )}

//                   <ProviderCard
//                     provider={provider}
//                     index={index}
//                     date={date}
//                     services={services}
//                     hoursPerDay={hoursPerDay}
//                     houseSize={houseSize}
//                     members={members}
//                     preferredStartTime={preferredStartTime}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// export default AvailableSlots;
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import ProviderCard from "../../components/booking/ProviderCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import {
  Users, Trophy, CalendarCheck, SearchX, ArrowLeft,
  MapPin, Star, Sparkles, SlidersHorizontal, ChevronDown
} from "lucide-react";

const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];

function AvailableSlots() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    services,
    hoursPerDay,
    houseSize,
    members,
    date,
    preferredStartTime,
  } = location.state || {};

  const [providers, setProviders]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [sortBy, setSortBy]         = useState("best");
  const [showSort, setShowSort]     = useState(false);
  const [animateIn, setAnimateIn]   = useState(false);

  const normalizedDate = date || null;

  const displayDate = date
    ? (() => {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
          weekday: "long", month: "long", day: "numeric",
        });
      })()
    : "";

  useEffect(() => {
    if (!services || services.length === 0) return;
    setLoading(true);
    setAnimateIn(false);

    api.post("/api/bookings/provider-options", {
      services: services.map(s => ({
        serviceType: s,
        hours: HOURLY_SERVICES.includes(s) ? hoursPerDay : null,
      })),
      houseSize,
      members,
      startDate: date,
    })
    .then(res => {
      const providerOptions = res.data;
      const promises = providerOptions.map(p =>
        api.get(`/api/provider/availability/${p.providerId}`)
          .then(slotRes => ({ ...p, slots: slotRes.data }))
          .catch(() => ({ ...p, slots: [] }))
      );
      Promise.all(promises)
        .then(data => {
          setProviders(data);
          setTimeout(() => setAnimateIn(true), 50);
        })
        .finally(() => setLoading(false));
    })
    .catch(err => {
      console.error("Error fetching providers:", err);
      setLoading(false);
    });
  }, [services]);

  const validProviders = providers.filter(provider => {
    const validSlots = (provider.slots || []).filter(slot => {
      const slotDate = typeof slot.date === "string"
        ? slot.date.split("T")[0]
        : null;
      return slotDate === normalizedDate && slot.active === true;
    });
    return validSlots.length > 0;
  });

  const sortedProviders = [...validProviders].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "price")  return (a.totalPrice || 0) - (b.totalPrice || 0);
    if (sortBy === "distance") return (a.distanceKm || 99) - (b.distanceKm || 99);
    return 0; // best match — default API order
  });

  const sortOptions = [
    { key: "best",     label: "Best Match"    },
    { key: "rating",   label: "Top Rated"     },
    { key: "price",    label: "Lowest Price"  },
    { key: "distance", label: "Nearest First" },
  ];

  const serviceLabels = (services || [])
    .map(s => s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()))
    .join(" · ");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .5; transform: scale(.85); }
        }
        .provider-item {
          opacity: 0;
          animation: fadeUp .45s ease forwards;
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
        }
        .sort-dropdown {
          transition: opacity .15s ease, transform .15s ease;
        }
        .sort-dropdown.hidden-dropdown {
          opacity: 0; pointer-events: none; transform: translateY(-6px);
        }
        .sort-dropdown.visible-dropdown {
          opacity: 1; pointer-events: all; transform: translateY(0);
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="bg-[#1E293B] pt-2 pb-24 md:pt-20 md:pb-28 px-[5%] relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-400/5 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-px h-40 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto relative">

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={16} strokeWidth={2.5} className="text-white group-hover:text-slate-900 transition-colors group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Step pill */}
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" style={{ animation: "pulse-dot 2s ease infinite" }} />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Step 4 of 4</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-2">
            Choose Your
          </h1>
          <h1 className="text-4xl md:text-5xl font-black text-blue-400 uppercase tracking-tight leading-none mb-5">
            Professional
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-4 py-2">
              <CalendarCheck size={12} className="text-blue-400" />
              <span className="text-white text-xs font-semibold">{displayDate}</span>
            </div>
            {serviceLabels && (
              <div className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-4 py-2">
                <Sparkles size={12} className="text-blue-400" />
                <span className="text-white text-xs font-semibold">{serviceLabels}</span>
              </div>
            )}
            {!loading && validProviders.length > 0 && (
              <div className="flex items-center gap-2 bg-blue-600 rounded-full px-4 py-2">
                <Users size={12} className="text-white" />
                <span className="text-white text-xs font-bold">
                  {validProviders.length} provider{validProviders.length !== 1 ? "s" : ""} available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="px-[5%] pb-20">
        <div className="max-w-7xl mx-auto -mt-10 md:-mt-14 relative z-10">

          {/* ── SORT + HEADER BAR ── */}
          {!loading && sortedProviders.length > 0 && (
            <div className="flex items-center justify-between mb-5 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <MapPin size={12} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {sortedProviders.length} Available Near You
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {sortOptions.find(s => s.key === sortBy)?.label} · {displayDate}
                  </p>
                </div>
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSort(v => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border-2 border-slate-100 hover:border-blue-200 transition-all text-xs font-black text-slate-600"
                >
                  <SlidersHorizontal size={11} strokeWidth={3} />
                  Sort
                  <ChevronDown size={11} strokeWidth={3} className={`transition-transform ${showSort ? "rotate-180" : ""}`} />
                </button>

                <div className={`sort-dropdown absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden
                  ${showSort ? "visible-dropdown" : "hidden-dropdown"}`}>
                  {sortOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-black transition-colors
                        ${sortBy === opt.key
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {opt.key === sortBy && "✓ "}{opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LOADING ── */}
          {loading && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200 p-6 md:p-10 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          )}

          {/* ── EMPTY ── */}
          {!loading && sortedProviders.length === 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200 p-6 md:p-10">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
                    <SearchX size={32} className="text-slate-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 text-xs font-black">0</span>
                  </div>
                </div>
                <p className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">
                  No Providers Available
                </p>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-8">
                  No one is available in your area on this date. Try a different date or update your pincode in your profile.
                </p>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1E293B] text-white text-xs font-black hover:bg-slate-700 transition-all active:scale-95"
                >
                  <ArrowLeft size={13} strokeWidth={3} />
                  Try Another Date
                </button>
              </div>
            </div>
          )}

          {/* ── PROVIDERS LIST ── */}
          {!loading && sortedProviders.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200 p-6 md:p-10">

              {/* Section header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                    <CalendarCheck size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Available Providers</h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Verified · Background checked · Ready to work
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  {[
                    { color: "bg-yellow-400", label: "Top Rated" },
                    { color: "bg-blue-500",   label: "Nearby"   },
                    { color: "bg-emerald-500", label: "Verified" },
                  ].map(({ color, label }) => (
                    <span key={label} className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {sortedProviders.map((provider, index) => (
                  <div
                    key={provider.providerId}
                    className="provider-item"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {/* Best match banner */}
                    {index === 0 && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#1E293B] to-slate-700 rounded-full px-4 py-1.5 shadow-md">
                          <Trophy size={11} className="text-yellow-400" />
                          <span className="text-white text-[10px] font-black uppercase tracking-widest">Best Match</span>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                      </div>
                    )}

                    {/* Other options divider */}
                    {index === 1 && sortedProviders.length > 1 && (
                      <div className="flex items-center gap-3 mb-3 mt-2">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2">
                          More Options
                        </span>
                        <div className="flex-1 h-px bg-slate-100" />
                      </div>
                    )}

                    <ProviderCard
                      provider={provider}
                      index={index}
                      date={date}
                      services={services}
                      hoursPerDay={hoursPerDay}
                      houseSize={houseSize}
                      members={members}
                      preferredStartTime={preferredStartTime}
                    />
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
                <Star size={11} className="text-slate-300" />
                <p className="text-[11px] text-slate-400 font-medium text-center">
                  All providers are background-verified. Ratings based on real customer reviews.
                </p>
                <Star size={11} className="text-slate-300" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AvailableSlots;