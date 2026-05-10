// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import Container from "../../components/ui/Container";
// import Card from "../../components/ui/Card";

// function SelectDateTime() {

//   const location = useLocation();
//   const navigate = useNavigate();

//   const { services, hoursPerDay, houseSize, members } = location.state || {};

//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [customMode, setCustomMode] = useState(false);

//   const getNextDays = () => {
//     const days = [];
//     const today = new Date();

//     for (let i = 0; i < 7; i++) {
//       const d = new Date();
//       d.setDate(today.getDate() + i);

//       const formatted = d.toISOString().split("T")[0];

//       let label = d.toLocaleDateString("en-IN", { weekday: "short" });
//       if (i === 0) label = "Today";
//       if (i === 1) label = "Tomorrow";

//       days.push({
//         label,
//         day: d.getDate(),
//         value: formatted
//       });
//     }

//     return days;
//   };

//   const TIME_SLOTS = [
//     "07:00", "09:00", "11:00",
//     "13:00", "15:00", "17:00", "19:00"
//   ];

//   const formatTime = (t) => {
//     const [h, m] = t.split(":");
//     const hour = parseInt(h);
//     const suffix = hour >= 12 ? "PM" : "AM";
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:${m} ${suffix}`;
//   };

//   const next = () => {
//     if (!date || !time) return;

//     navigate("/user/slots", {
//       state: {
//         services,
//         hoursPerDay,
//         houseSize,
//         members,
//         date,
//         preferredStartTime: time
//       }
//     });
//   };

//   return (
//     <Container>

//       {/* 🔥 HEADER */}
//       <div className="mb-8 animate-fadeIn">

//         <h2 className="
//           text-3xl font-bold
//           bg-brand-gradient bg-clip-text text-transparent
//         ">
//           Schedule Service ⏰
//         </h2>

//         <p className="text-textSub mt-2">
//           Choose your preferred date & time
//         </p>

//       </div>

//       {/* 🔥 DATE */}
//       <div className="mb-10">

//         <h3 className="text-lg font-semibold mb-4 text-textMain">
//           Select Date
//         </h3>

//         <div className="flex gap-4 overflow-x-auto pb-2">

//           {getNextDays().map(d => {
//             const selected = date === d.value;

//             return (
//               <Card
//                 key={d.value}
//                 onClick={() => setDate(d.value)}
//                 className={`min-w-[90px] text-center group
//                   ${selected && "text-white scale-[1.1] shadow-glow"}
//                 `}
//               >

//                 {selected && (
//                   <div className="absolute inset-0 bg-brand-gradient" />
//                 )}

//                 <div className="relative">
//                   <p className="text-xs opacity-80">{d.label}</p>
//                   <p className="text-xl font-bold">{d.day}</p>

//                   <div className="
//                     mt-2 h-[2px] w-0
//                     bg-brand-gradient
//                     transition-all duration-300
//                     group-hover:w-full
//                   " />
//                 </div>

//               </Card>
//             );
//           })}

//         </div>

//       </div>

//       {/* 🔥 TIME HEADER */}
//       <div className="flex items-center justify-between mb-4">

//         <h3 className="text-lg font-semibold text-textMain">
//           Preferred Start Time
//         </h3>

//         <button
//           onClick={() => {
//             setCustomMode(!customMode);
//             setTime("");
//           }}
//           className="
//             text-sm font-medium
//             bg-brand-gradient bg-clip-text text-transparent
//             hover:opacity-80 transition
//           "
//         >
//           {customMode ? "Quick Slots" : "Custom Time"}
//         </button>

//       </div>

//       {/* 🔥 TIME */}
//       <div className="mb-24">

//         {!customMode ? (

//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">

//             {TIME_SLOTS.map(slot => {
//               const selected = time === slot;

//               return (
//                 <Card
//                   key={slot}
//                   onClick={() => setTime(slot)}
//                   className={`text-center font-medium group
//                     ${selected && "text-white scale-[1.05] shadow-glow"}
//                   `}
//                 >

//                   {selected && (
//                     <div className="absolute inset-0 bg-brand-gradient" />
//                   )}

//                   <div className="relative">
//                     {formatTime(slot)}

//                     <div className="
//                       mt-2 h-[2px] w-0
//                       bg-brand-gradient
//                       transition-all duration-300
//                       group-hover:w-full
//                     " />
//                   </div>

//                 </Card>
//               );
//             })}

//           </div>

//         ) : (

//           <div className="max-w-sm">

//             <input
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               className="
//                 w-full px-4 py-3 rounded-xl
//                 border border-borderLight
//                 focus:outline-none
//                 focus:ring-2 focus:ring-pink-400
//                 transition
//               "
//             />

//             <p className="text-xs text-textSub mt-2">
//               Select your exact preferred time
//             </p>

//           </div>

//         )}

//       </div>

//       {/* 🔥 CTA */}
//       <div className="
//         fixed bottom-0 left-0 w-full
//         bg-white/80 backdrop-blur-md
//         border-t border-borderLight
//         p-4 flex justify-center shadow-soft
//       ">

//         <button
//           onClick={next}
//           disabled={!date || !time}
//           className={`
//             w-full max-w-md py-3 rounded-xl text-white font-medium
//             transition-all duration-300

//             ${(!date || !time)
//               ? "bg-gray-300 cursor-not-allowed"
//               : "bg-brand-gradient hover:scale-[1.03] active:scale-[0.97] shadow-glow"
//             }
//           `}
//         >
//           Find Available Providers →
//         </button>

//       </div>

//     </Container>
//   );
// }

// export default SelectDateTime;

// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import Card from "../../components/ui/Card";
// import Button from "../../components/ui/Button";
// import { Check, Calendar, Clock, ChevronRight,ArrowLeft } from "lucide-react";

// function SelectDateTime() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { services, hoursPerDay, houseSize, members } = location.state || {};

//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [customMode, setCustomMode] = useState(false);

//   const getNextDays = () => {
//     const days = [];
//     const today = new Date();
//     for (let i = 0; i < 7; i++) {
//       const d = new Date();
//       d.setDate(today.getDate() + i);
//       const formatted = d.toISOString().split("T")[0];
//       let label = d.toLocaleDateString("en-IN", { weekday: "short" });
//       if (i === 0) label = "Today";
//       if (i === 1) label = "Tmrw";
//       days.push({ label, day: d.getDate(), month: d.toLocaleDateString("en-IN", { month: "short" }), value: formatted });
//     }
//     return days;
//   };

//   const TIME_SLOTS = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

//   const formatTime = (t) => {
//     const [h, m] = t.split(":");
//     const hour = parseInt(h);
//     const suffix = hour >= 12 ? "PM" : "AM";
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:${m} ${suffix}`;
//   };

//   const next = () => {
//     if (!date || !time) return;
//     navigate("/user/slots", {
//       state: { services, hoursPerDay, houseSize, members, date, preferredStartTime: time }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">

//       {/* HERO */}
//       <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
//         <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

//         <div className="max-w-7xl mx-auto relative">
//           <button
//           onClick={() => navigate(-1)}
//           className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
//         >
//           <ArrowLeft 
//             size={18} 
//             strokeWidth={2.5} 
//             className="text-slate-900 transition-transform group-hover:-translate-x-0.5" 
//           />
//         </button>
//           <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
//             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
//             <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Step 3 of 4</span>
//           </div>

//           <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
//             Schedule Your <span className="text-blue-400">Service</span>
//           </h2>
//           <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl leading-relaxed">
//             Pick a date and time that works for you.
//           </p>

//           {date && time && (
//             <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 rounded-full px-4 py-1.5">
//               <Check size={12} className="text-white" strokeWidth={3} />
//               <span className="text-white text-xs font-bold">
//                 {new Date(date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} · {formatTime(time)}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN CARD */}
//       <div className="px-[5%] pb-28">
//         <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

//           {/* DATE SECTION */}
//           <div className="mb-10">
//             <div className="flex items-center gap-3 mb-1">
//               <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
//                 <Calendar size={14} className="text-white" />
//               </div>
//               <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Select Date</h3>
//             </div>
//             <p className="text-slate-400 text-xs ml-11 mb-6">Choose from the next 7 available days</p>

//             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
//               {getNextDays().map((d) => {
//                 const selected = date === d.value;
//                 return (
//                   <button
//                     key={d.value}
//                     onClick={() => setDate(d.value)}
//                     className={`
//                       min-w-[72px] flex flex-col items-center py-4 px-3 rounded-2xl border-2 transition-all duration-200 flex-shrink-0
//                       ${selected
//                         ? "border-blue-600 bg-blue-600 shadow-lg shadow-blue-200"
//                         : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white hover:shadow-md"
//                       }
//                     `}
//                   >
//                     <span className={`text-[10px] font-black uppercase tracking-wider mb-1 ${selected ? "text-blue-200" : "text-slate-400"}`}>
//                       {d.label}
//                     </span>
//                     <span className={`text-2xl font-black leading-none ${selected ? "text-white" : "text-slate-800"}`}>
//                       {d.day}
//                     </span>
//                     <span className={`text-[10px] font-bold mt-1 ${selected ? "text-blue-200" : "text-slate-400"}`}>
//                       {d.month}
//                     </span>
//                     {selected && (
//                       <div className="mt-2 w-1.5 h-1.5 rounded-full bg-white/60" />
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* DIVIDER */}
//           <div className="flex items-center gap-4 mb-10">
//             <div className="flex-1 h-px bg-slate-100" />
//             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Then pick a time</span>
//             <div className="flex-1 h-px bg-slate-100" />
//           </div>

//           {/* TIME SECTION */}
//           <div>
//             <div className="flex items-center justify-between mb-1">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
//                   <Clock size={14} className="text-white" />
//                 </div>
//                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Preferred Start Time</h3>
//               </div>
//               <button
//                 onClick={() => { setCustomMode(!customMode); setTime(""); }}
//                 className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider transition"
//               >
//                 {customMode ? "Quick Slots" : "Custom Time"}
//               </button>
//             </div>
//             <p className="text-slate-400 text-xs ml-11 mb-6">
//               {customMode ? "Enter your exact preferred time" : "Select from popular time slots"}
//             </p>

//             {!customMode ? (
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {TIME_SLOTS.map((slot) => {
//                   const selected = time === slot;
//                   const hour = parseInt(slot.split(":")[0]);
//                   const period = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
//                   return (
//                     <Card
//                       key={slot}
//                       onClick={() => setTime(slot)}
//                       className={`
//                         relative p-4 cursor-pointer transition-all duration-200 rounded-2xl border-2 group
//                         ${selected
//                           ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-50/30 shadow-lg shadow-blue-100"
//                           : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white hover:shadow-md"
//                         }
//                       `}
//                     >
//                       <p className={`text-sm font-black ${selected ? "text-blue-700" : "text-slate-800"}`}>
//                         {formatTime(slot)}
//                       </p>
//                       <p className={`text-[10px] font-bold mt-0.5 ${selected ? "text-blue-400" : "text-slate-400"}`}>
//                         {period}
//                       </p>
//                       {selected && (
//                         <div className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-lg">
//                           <Check size={10} strokeWidth={4} />
//                         </div>
//                       )}
//                     </Card>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="max-w-sm">
//                 <input
//                   type="time"
//                   value={time}
//                   onChange={(e) => setTime(e.target.value)}
//                   className="
//                     w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-800
//                     border-2 border-slate-100 bg-slate-50
//                     focus:outline-none focus:border-blue-600 focus:bg-white
//                     transition-all duration-200
//                   "
//                 />
//                 <p className="text-xs text-slate-400 mt-2 ml-1">Select your exact preferred time</p>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>

//       {/* FIXED CTA */}
//       <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 flex items-center justify-center gap-4 z-50">
//         {date && time && (
//           <span className="text-xs font-bold text-slate-400 hidden sm:block">
//             {new Date(date).toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })} · {formatTime(time)}
//           </span>
//         )}
//         <Button
//           variant="primary"
//           onClick={next}
//           disabled={!date || !time}
//           className={`w-full max-w-sm py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all ${
//             date && time
//               ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"
//               : "bg-slate-100 text-slate-400 cursor-not-allowed"
//           }`}
//         >
//           {date && time ? "FIND AVAILABLE PROVIDERS →" : "SELECT DATE & TIME"}
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default SelectDateTime;



import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Check, Calendar, Clock, ArrowLeft } from "lucide-react";

function SelectDateTime() {
  const location = useLocation();
  const navigate = useNavigate();

  const { services, hoursPerDay, houseSize, members } = location.state || {};

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customMode, setCustomMode] = useState(false);

  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      // ✅ FIXED: build date string from local date parts to avoid UTC timezone shift
      // new Date().toISOString() gives UTC, which shifts date by -5:30 in IST
      const year  = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day   = String(d.getDate()).padStart(2, "0");
      const value = `${year}-${month}-${day}`; // e.g. "2026-04-15" using local date

      let label = d.toLocaleDateString("en-IN", { weekday: "short" });
      if (i === 0) label = "Today";
      if (i === 1) label = "Tmrw";

      days.push({
        label,
        day: d.getDate(),
        month: d.toLocaleDateString("en-IN", { month: "short" }),
        value,
      });
    }
    return days;
  };

  const TIME_SLOTS = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${suffix}`;
  };

  // ✅ FIXED: format display date from local parts too (avoids "Apr 14" showing for "2026-04-15")
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day); // local date, no UTC
    return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
  };

  const next = () => {
    if (!date || !time) return;
    navigate("/user/slots", {
      state: { services, hoursPerDay, houseSize, members, date, preferredStartTime: time }
    });
  };

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
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Step 3 of 4</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Schedule Your <span className="text-blue-400">Service</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl leading-relaxed">
            Pick a date and time that works for you.
          </p>

          {date && time && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 rounded-full px-4 py-1.5">
              <Check size={12} className="text-white" strokeWidth={3} />
              <span className="text-white text-xs font-bold">
                {formatDisplayDate(date)} · {formatTime(time)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-[5%] pb-28">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          {/* DATE SECTION */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <Calendar size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Select Start Date</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-6">Choose from the next 7 available days</p>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {getNextDays().map((d) => {
                const selected = date === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setDate(d.value)}
                    className={`
                      min-w-[72px] flex flex-col items-center py-4 px-3 rounded-2xl border-2 transition-all duration-200 flex-shrink-0
                      ${selected
                        ? "border-blue-600 bg-blue-600 shadow-lg shadow-blue-200"
                        : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white hover:shadow-md"
                      }
                    `}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-wider mb-1 ${selected ? "text-blue-200" : "text-slate-400"}`}>
                      {d.label}
                    </span>
                    <span className={`text-2xl font-black leading-none ${selected ? "text-white" : "text-slate-800"}`}>
                      {d.day}
                    </span>
                    <span className={`text-[10px] font-bold mt-1 ${selected ? "text-blue-200" : "text-slate-400"}`}>
                      {d.month}
                    </span>
                    {selected && <div className="mt-2 w-1.5 h-1.5 rounded-full bg-white/60" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Then pick a time</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* TIME SECTION */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Clock size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Preferred Start Time</h3>
              </div>
              <button
                onClick={() => { setCustomMode(!customMode); setTime(""); }}
                className="text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider transition"
              >
                {customMode ? "Quick Slots" : "Custom Time"}
              </button>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-6">
              {customMode ? "Enter your exact preferred time" : "Select from popular time slots"}
            </p>

            {!customMode ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const selected = time === slot;
                  const hour = parseInt(slot.split(":")[0]);
                  const period = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
                  return (
                    <Card
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`
                        relative p-4 cursor-pointer transition-all duration-200 rounded-2xl border-2 group
                        ${selected
                          ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-50/30 shadow-lg shadow-blue-100"
                          : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white hover:shadow-md"
                        }
                      `}
                    >
                      <p className={`text-sm font-black ${selected ? "text-blue-700" : "text-slate-800"}`}>
                        {formatTime(slot)}
                      </p>
                      <p className={`text-[10px] font-bold mt-0.5 ${selected ? "text-blue-400" : "text-slate-400"}`}>
                        {period}
                      </p>
                      {selected && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-lg">
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="max-w-sm">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-800 border-2 border-slate-100 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white transition-all duration-200"
                />
                <p className="text-xs text-slate-400 mt-2 ml-1">Select your exact preferred time</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* FIXED CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 flex items-center justify-center gap-4 z-50">
        {date && time && (
          <span className="text-xs font-bold text-slate-400 hidden sm:block">
            {formatDisplayDate(date)} · {formatTime(time)}
          </span>
        )}
        <Button
          variant="primary"
          onClick={next}
          disabled={!date || !time}
          className={`w-full max-w-sm py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all ${
            date && time
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {date && time ? "FIND AVAILABLE PROVIDERS →" : "SELECT DATE & TIME"}
        </Button>
      </div>
    </div>
  );
}

export default SelectDateTime;