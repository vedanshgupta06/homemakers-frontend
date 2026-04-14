// import { useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../../api/axios";

// import Container from "../../components/ui/Container";
// import ProviderCard from "../../components/booking/ProviderCard";
// import SkeletonCard from "../../components/ui/SkeletonCard";

// function AvailableSlots() {

//   const location = useLocation();

//   const {
//     services,
//     hoursPerDay,
//     houseSize,
//     members,
//     date,
//     preferredStartTime
//   } = location.state || {};

//   const [providers, setProviders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const formattedDate = date
//     ? new Date(date).toISOString().split("T")[0]
//     : null;

//   const normalize = (d) => d?.split("T")[0];

//   useEffect(() => {

//     if (!services || services.length === 0) return;

//     setLoading(true);

//     api.post("/api/bookings/provider-options", {
//       services: services.map(s => ({
//         serviceType: s,
//         hours: hoursPerDay
//       })),
//       houseSize,
//       members,
//       startDate: date
//     })
//     .then(res => {

//       const providerOptions = res.data;

//       const promises = providerOptions.map(p =>
//         api.get(`/api/provider/availability/${p.providerId}`)
//           .then(slotRes => ({
//             ...p,
//             slots: slotRes.data
//           }))
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

//   // 🔥 FILTERED PROVIDERS
//   const validProviders = providers
//     .filter(provider => {
//       const validSlots = provider.slots.filter(slot =>
//         normalize(slot.date) === normalize(formattedDate) &&
//         slot.active === true
//       );
//       return validSlots.length > 0;
//     })
//     .sort((a, b) => a.price - b.price);

//   return (
//     <Container>

//       {/* 🔥 HEADER */}
//       <div className="mb-8 animate-fadeIn">

//         <h2 className="
//           text-3xl font-bold
//           bg-brand-gradient bg-clip-text text-transparent
//         ">
//           Choose Your Professional 👩‍🔧
//         </h2>

//         <p className="text-textSub mt-2">
//           Available on {date}
//         </p>

//       </div>

//       {/* 🔥 LOADING */}
//       {loading && (
//         <div className="space-y-4">
//           {[1,2,3].map(i => <SkeletonCard key={i} />)}
//         </div>
//       )}

//       {/* ❌ EMPTY STATE */}
//       {!loading && validProviders.length === 0 && (
//         <div className="text-center py-20 animate-fadeIn">

//           <p className="text-lg font-medium text-textMain">
//             No providers available 😔
//           </p>

//           <p className="text-sm text-textSub mt-2">
//             Try changing date or time
//           </p>

//         </div>
//       )}

//       {/* 🔥 PROVIDER LIST */}
//       <div className="space-y-6">

//         {!loading && validProviders.map((provider, index) => (

//           <div
//             key={provider.providerId}
//             className="animate-fadeIn"
//           >

//             {/* 🏆 BEST CHOICE TAG */}
//             {index === 0 && (
//               <div className="
//                 inline-block mb-2 px-3 py-1 text-xs font-medium
//                 bg-brand-gradient text-white rounded-full shadow-glow
//               ">
//                 ⭐ Best Price
//               </div>
//             )}

//             <ProviderCard
//               provider={provider}
//               index={index}
//               date={date}
//               services={services}
//               hoursPerDay={hoursPerDay}
//               houseSize={houseSize}
//               members={members}
//               preferredStartTime={preferredStartTime}
//             />

//           </div>

//         ))}

//       </div>

//     </Container>
//   );
// }

// export default AvailableSlots;

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import ProviderCard from "../../components/booking/ProviderCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import { Users, Trophy, CalendarCheck, SearchX, ArrowLeft } from "lucide-react";

// ✅ FIXED: all hourly services must be listed here
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
    preferredStartTime
  } = location.state || {};

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: don't use new Date(date).toISOString() — it shifts date by UTC offset
  // date is already "YYYY-MM-DD" from SelectDateTime's local date fix, use it directly
  const normalizedDate = date || null; // already "2026-04-15" format

  const displayDate = date
    ? (() => {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
          weekday: "long", month: "long", day: "numeric"
        });
      })()
    : "";

  useEffect(() => {
    if (!services || services.length === 0) return;
    setLoading(true);

    api.post("/api/bookings/provider-options", {
      // ✅ FIXED: pass hours only for hourly services, null for flat-rate
      services: services.map(s => ({
        serviceType: s,
        hours: HOURLY_SERVICES.includes(s) ? hoursPerDay : null
      })),
      houseSize,
      members,
      startDate: date  // already correct "YYYY-MM-DD" format
    })
    .then(res => {
      const providerOptions = res.data;
      const promises = providerOptions.map(p =>
        api.get(`/api/provider/availability/${p.providerId}`)
          .then(slotRes => ({ ...p, slots: slotRes.data }))
      );
      Promise.all(promises)
        .then(setProviders)
        .finally(() => setLoading(false));
    })
    .catch(err => {
      console.error("Error fetching providers:", err);
      setLoading(false);
    });
  }, [services]);

  const validProviders = providers
    .filter(provider => {
      const validSlots = provider.slots.filter(slot =>
        // ✅ FIXED: compare slot.date directly with normalizedDate (both "YYYY-MM-DD")
        slot.date === normalizedDate && slot.active === true
      );
      return validSlots.length > 0;
    })
    .sort((a, b) => a.price - b.price);

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
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Step 4 of 4</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Choose Your <span className="text-blue-400">Professional</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl leading-relaxed">
            Available providers for {displayDate}
          </p>

          {!loading && validProviders.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 rounded-full px-4 py-1.5">
              <Users size={12} className="text-white" />
              <span className="text-white text-xs font-bold">
                {validProviders.length} provider{validProviders.length > 1 ? "s" : ""} available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <CalendarCheck size={14} className="text-white" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Available Providers</h3>
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-8">
            Sorted by best price · all verified professionals
          </p>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && validProviders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <SearchX size={28} className="text-slate-400" />
              </div>
              <p className="text-base font-black text-slate-800 uppercase tracking-tight">
                No Providers Available
              </p>
              <p className="text-sm text-slate-400 mt-2 max-w-xs">
                No one is available on this date. Try going back and selecting a different date or time.
              </p>
            </div>
          )}

          {!loading && validProviders.length > 0 && (
            <div className="space-y-5">
              {validProviders.map((provider, index) => (
                <div key={provider.providerId}>

                  {index === 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="inline-flex items-center gap-1.5 bg-[#1E293B] rounded-full px-3 py-1.5">
                        <Trophy size={11} className="text-yellow-400" />
                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Best Price</span>
                      </div>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>
                  )}

                  {index === 1 && validProviders.length > 1 && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Other Options</span>
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
          )}

        </div>
      </div>
    </div>
  );
}

export default AvailableSlots;