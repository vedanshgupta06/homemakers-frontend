// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Container from "../../components/ui/Container";
// import Card from "../../components/ui/Card";

// function SelectServices() {

//   const navigate = useNavigate();

//   const [services, setServices] = useState([]);
//   const [hoursPerDay, setHoursPerDay] = useState(2);

//   const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];
//   const FLAT_SERVICES = ["DISH_WASHING", "CLEANING", "DUSTING", "LAUNDRY"];

//   const format = (s) =>
//     s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

//   const toggleService = (service) => {
//     setServices(prev =>
//       prev.includes(service)
//         ? prev.filter(s => s !== service)
//         : [...prev, service]
//     );
//   };

//   const next = () => {
//     if (services.length === 0) return;

//     navigate("/user/requirements", {
//       state: {
//         services,
//         hoursPerDay: Number(hoursPerDay)
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
//           Choose Services 🧹
//         </h2>

//         <p className="text-textSub mt-2">
//           Select what you need for your home
//         </p>

//       </div>

//       {/* 🔥 HOURLY */}
//       <div className="mb-10">

//         <h3 className="text-lg font-semibold mb-4 text-textMain">
//           Hourly Services
//         </h3>

//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

//           {HOURLY_SERVICES.map(service => {
//             const selected = services.includes(service);

//             return (
//               <Card
//                 key={service}
//                 onClick={() => toggleService(service)}
//                 className={`group overflow-hidden
//                   ${selected && "shadow-glow scale-[1.05] text-white"}
//                 `}
//               >

//                 {/* GRADIENT */}
//                 {selected && (
//                   <div className="absolute inset-0 bg-brand-gradient" />
//                 )}

//                 <div className="relative">

//                   <p className="font-medium text-sm">
//                     {format(service)}
//                   </p>

//                   {/* underline */}
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

//         {/* 🔥 HOURS PICKER */}
//         <div className="mt-6">

//           <p className="text-sm text-textSub mb-2">
//             Hours per day
//           </p>

//           <div className="flex gap-3">

//             {[1,2,3,4,5,6].map(h => (
//               <button
//                 key={h}
//                 onClick={() => setHoursPerDay(h)}
//                 className={`
//                   px-4 py-2 rounded-lg text-sm font-medium

//                   transition-all duration-300

//                   ${hoursPerDay === h
//                     ? "bg-brand-gradient text-white shadow-glow scale-105"
//                     : "bg-white border border-borderLight hover:shadow"
//                   }
//                 `}
//               >
//                 {h}h
//               </button>
//             ))}

//           </div>

//         </div>

//       </div>

//       {/* 🔥 MONTHLY */}
//       <div className="mb-24">

//         <h3 className="text-lg font-semibold mb-4 text-textMain">
//           Monthly Services
//         </h3>

//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

//           {FLAT_SERVICES.map(service => {
//             const selected = services.includes(service);

//             return (
//               <Card
//                 key={service}
//                 onClick={() => toggleService(service)}
//                 className={`group overflow-hidden
//                   ${selected && "shadow-glow scale-[1.05] text-white"}
//                 `}
//               >

//                 {selected && (
//                   <div className="absolute inset-0 bg-brand-gradient" />
//                 )}

//                 <div className="relative">

//                   <p className="font-medium text-sm">
//                     {format(service)}
//                   </p>

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

//       {/* 🔥 CTA */}
//       <div className="
//         fixed bottom-0 left-0 w-full
//         bg-white/80 backdrop-blur-md
//         border-t border-borderLight
//         p-4 flex justify-center shadow-soft
//       ">

//         <button
//           onClick={next}
//           disabled={services.length === 0}
//           className={`
//             w-full max-w-md py-3 rounded-xl text-white font-medium
//             transition-all duration-300

//             ${services.length === 0
//               ? "bg-gray-300 cursor-not-allowed"
//               : "bg-brand-gradient hover:scale-[1.03] active:scale-[0.97] shadow-glow"
//             }
//           `}
//         >
//           Continue →
//         </button>

//       </div>

//     </Container>
//   );
// }

// export default SelectServices;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Check, Clock, Sparkles, ArrowLeft, Plus, Minus, X, Info } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Pricing shown here is ILLUSTRATIVE only.
// Actual price = calculated on backend via BookingCalculationService
// based on the provider selected in the next step.
//
// Hourly services:  pricePerHour × hoursPerDay  (monthly billing)
//   e.g. ₹150/hr × 2 hrs/day = ₹300/day → billed monthly by provider
//
// Dish Washing / Laundry: monthlyRate × memberMultiplier
//   ≤4 members → 1.0x  |  ≤6 → 1.25x  |  ≤8 → 1.5x  |  8+ → 1.75x
//
// Cleaning / Dusting: monthlyRate × houseMultiplier
//   1BHK → 1.0x  |  2BHK → 1.3x  |  3BHK → 1.6x  |  4BHK+ → 2.0x
// ─────────────────────────────────────────────────────────────────────────────

const HOURLY_SERVICES = [
  {
    id: "BABYSITTING",
    label: "Babysitting",
    desc: "Trusted care for your little ones",
    img: "/images/babysitting.png",
    pricingType: "HOURLY_MONTHLY",
    rateLabel: "Priced per hour / month",
    details: {
      about:
        "Our trained babysitters provide safe, engaging, and nurturing care for children of all ages — infants to school-age kids.",
      includes: [
        "Age-appropriate activities & play",
        "Meal preparation for the child",
        "Nap-time supervision",
        "Homework help (school-age kids)",
        "Safety-certified caregivers",
      ],
      pricingNote:
        "Final price = Provider's hourly rate × hours per day you select. Billed monthly. Rates vary by provider.",
      pricingRows: [
        { label: "How it's calculated", value: "Rate/hr(monthly) × hrs/day " },
        { label: "Example (₹1500/hr × 2 hrs)", value: "₹3000 / month" },
        { label: "Billing cycle", value: "Monthly" },
      ],
      note: "Exact rate depends on the provider you choose in the next step.",
    },
  },
  {
    id: "ELDER_CARE",
    label: "Elder Care",
    desc: "Compassionate senior assistance",
    img: "/images/eldercare.png",
    pricingType: "HOURLY_MONTHLY",
    rateLabel: "Priced per hour / month",
    details: {
      about:
        "Dedicated caregivers assist elderly family members with daily activities, medication reminders, companionship, and mobility support.",
      includes: [
        "Personal hygiene assistance",
        "Medication reminders",
        "Meal preparation & feeding support",
        "Light mobility & exercise",
        "Companionship & emotional support",
      ],
      pricingNote:
        "Final price = Provider's hourly rate × hours per day you select. Billed monthly.",
      pricingRows: [
        { label: "How it's calculated", value: "Rate/hr(monthly) × hrs/day " },
        { label: "Example (₹1500/hr × 2 hrs)", value: "₹3000 / month" },
        { label: "Billing cycle", value: "Monthly" },
      ],
      note: "Exact rate depends on the provider you choose in the next step.",
    },
  },
  {
    id: "COOKING",
    label: "Cooking",
    desc: "Home-cooked meals, every day",
    img: "/images/cooking.png",
    pricingType: "HOURLY_MONTHLY",
    rateLabel: "Priced per hour / month",
    details: {
      about:
        "Skilled home cooks prepare fresh, hygienic, home-style meals tailored to your family's dietary preferences.",
      includes: [
        "Breakfast, lunch & dinner options",
        "Custom dietary plans (veg / non-veg / jain)",
        "Kitchen cleaning after cooking",
        "Grocery list assistance",
        "Festival & special occasion menus",
      ],
      pricingNote:
        "Final price = Provider's hourly rate × hours per day you select. Billed monthly.",
      pricingRows: [
        { label: "How it's calculated", value: "Rate/hr(monthly) × hrs/day "},
        { label: "Example (₹1500/hr × 2 hrs)", value: "₹3000 / month" },
        { label: "Billing cycle", value: "Monthly" },
      ],
      note: "Ingredients not included. Cook uses your kitchen supplies.",
    },
  },
];

const FLAT_SERVICES = [
  {
    id: "DISH_WASHING",
    label: "Dish Washing",
    img: "/images/dishwashing.png",
    pricingType: "FLAT_MEMBER_BASED",
    rateLabel: "Monthly · varies by family size",
    details: {
      about:
        "Quick and thorough dish cleaning after every meal, every day of the month.",
      includes: [
        "All utensils, plates & cookware",
        "Sink scrubbing & cleaning",
        "Drying & stacking",
      ],
      pricingNote:
        "Monthly rate set by your chosen provider × member multiplier based on family size.",
      pricingRows: [
        { label: "Up to 4 members",  value: "Base rate × 1.0" },
        { label: "5–6 members",      value: "Base rate × 1.25" },
        { label: "7–8 members",      value: "Base rate × 1.5" },
        { label: "9+ members",       value: "Base rate × 1.75" },
      ],
      note: "You'll enter your family size in the next step. Final price shown after provider selection.",
    },
  },
  {
    id: "CLEANING",
    label: "Cleaning",
    img: "/images/cleaning.png",
    pricingType: "FLAT_HOUSE_BASED",
    rateLabel: "Monthly · varies by house size",
    details: {
      about:
        "Full home cleaning covering all rooms, surfaces, and common areas — every day of the month.",
      includes: [
        "Sweeping & mopping all floors",
        "Bathroom & toilet cleaning",
        "Kitchen surface wiping",
        "Trash collection & disposal",
        "Window sill & ceiling fan dusting",
      ],
      pricingNote:
        "Monthly rate set by your chosen provider × house size multiplier.",
      pricingRows: [
        { label: "1 BHK",   value: "Base rate × 1.0" },
        { label: "2 BHK",   value: "Base rate × 1.3" },
        { label: "3 BHK",   value: "Base rate × 1.6" },
        { label: "4 BHK+",  value: "Base rate × 2.0" },
      ],
      note: "You'll enter your house size in the next step. Final price shown after provider selection.",
    },
  },
  {
    id: "DUSTING",
    label: "Dusting",
    img: "/images/dusting.png",
    pricingType: "FLAT_HOUSE_BASED",
    rateLabel: "Monthly · varies by house size",
    details: {
      about:
        "Detailed daily dusting of furniture, shelves, electronics, and décor items.",
      includes: [
        "Furniture & shelf dusting",
        "TV, appliances & electronics",
        "Ceiling fans & light fixtures",
        "Décor items & photo frames",
      ],
      pricingNote:
        "Monthly rate set by your chosen provider × house size multiplier.",
      pricingRows: [
        { label: "1 BHK",  value: "Base rate × 1.0" },
        { label: "2 BHK",  value: "Base rate × 1.3" },
        { label: "3 BHK",  value: "Base rate × 1.6" },
        { label: "4 BHK+", value: "Base rate × 2.0" },
      ],
      note: "Microfibre cloths used. Final price shown after provider selection.",
    },
  },
  {
    id: "LAUNDRY",
    label: "Laundry",
    img: "/images/laundry.png",
    pricingType: "FLAT_MEMBER_BASED",
    rateLabel: "Monthly · varies by family size",
    details: {
      about:
        "Complete daily laundry — washing, drying, folding, and neatly stacking your clothes.",
      includes: [
        "Machine wash or hand wash as needed",
        "Drying & folding",
        "Wardrobe stacking",
        "Delicate fabric care",
      ],
      pricingNote:
        "Monthly rate set by your chosen provider × member multiplier based on family size.",
      pricingRows: [
        { label: "Up to 4 members", value: "Base rate × 1.0" },
        { label: "5–6 members",     value: "Base rate × 1.25" },
        { label: "7–8 members",     value: "Base rate × 1.5" },
        { label: "9+ members",      value: "Base rate × 1.75" },
      ],
      note: "Detergent provided by helper. Final price shown after provider selection.",
    },
  },
];

// ─── Pricing type badge colours ───────────────────────────────────────────────
const PRICING_TYPE_META = {
  HOURLY_MONTHLY:    { label: "Hourly / Month", bg: "bg-blue-600" },
  FLAT_MEMBER_BASED: { label: "By Family Size", bg: "bg-emerald-600" },
  FLAT_HOUSE_BASED:  { label: "By House Size",  bg: "bg-amber-500" },
};

// ─── Details Bottom Sheet ─────────────────────────────────────────────────────
function DetailsSheet({ service, onClose }) {
  if (!service) return null;
  const { label, rateLabel, color, pricingType, details } = service;
  const meta = PRICING_TYPE_META[pricingType];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">{label}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{rateLabel}</p>
            <span className={`inline-block mt-2 text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${meta.bg}`}>
              {meta.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors mt-1"
          >
            <X size={15} className="text-slate-600" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* About */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">About</p>
            <p className="text-sm text-slate-600 leading-relaxed">{details.about}</p>
          </div>

          {/* What's included */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">What's included</p>
            <div className="space-y-2">
              {details.includes.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${color}25` }}
                  >
                    <Check size={10} strokeWidth={3} style={{ color }} />
                  </div>
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How pricing works */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">How pricing works</p>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">{details.pricingNote}</p>

            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              {details.pricingRows.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3
                    ${i !== details.pricingRows.length - 1 ? "border-b border-slate-100" : ""}
                    ${i % 2 === 0 ? "bg-slate-50/60" : "bg-white"}`}
                >
                  <p className="text-sm text-slate-500">{row.label}</p>
                  <p className="text-sm font-bold text-slate-900">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Provider note */}
          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
            <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">{details.note}</p>
          </div>

        </div>
        <div className="h-6" />
      </div>
    </>
  );
}

// ─── Image with colour fallback ───────────────────────────────────────────────
function ServiceImage({ src, alt, color, className }) {
  return (
    <img
      src={src} alt={alt} className={className}
      onError={(e) => {
        e.target.style.display = "none";
        e.target.parentElement.style.background = color;
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SelectServices() {
  const navigate = useNavigate();
  const [hourlySelections, setHourlySelections] = useState({});
  const [flatServices, setFlatServices]         = useState([]);
  const [detailService, setDetailService]       = useState(null);

  const isHourlySelected = (id) => id in hourlySelections;
  const totalSelected    = Object.keys(hourlySelections).length + flatServices.length;

  const toggleHourly = (id) => {
    setHourlySelections((prev) => {
      if (id in prev) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: 2 };
    });
  };

  const changeHours = (id, delta, e) => {
    e.stopPropagation();
    setHourlySelections((prev) => ({
      ...prev,
      [id]: Math.min(8, Math.max(1, (prev[id] ?? 2) + delta)),
    }));
  };

  const toggleFlat = (id) =>
    setFlatServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const openDetails = (e, service) => {
    e.stopPropagation();
    setDetailService(service);
  };

  const next = () => {
    if (totalSelected === 0) return;
    navigate("/user/requirements", { state: { hourlySelections, flatServices } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <button onClick={() => navigate(-1)} className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95">
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Professional Home Services</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Book a <span className="text-blue-400">Service</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl leading-relaxed">
            Select the services you need. Mix and match — we handle the rest.
          </p>

          {totalSelected > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 rounded-full px-4 py-1.5">
              <Check size={12} className="text-white" strokeWidth={3} />
              <span className="text-white text-xs font-bold">
                {totalSelected} service{totalSelected > 1 ? "s" : ""} selected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-[5%] pb-28">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-5 md:p-10">

          {/* HOURLY SERVICES */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Clock size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Hourly Services</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-5">
              Rate/hr × hrs/day · billed monthly · final price after provider selection
            </p>

            {/* Mobile: 1 col × 3 rows  |  Desktop: 3 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOURLY_SERVICES.map((svc) => {
                const { id, label, desc, img, color, rateLabel } = svc;
                const selected = isHourlySelected(id);
                const hours    = hourlySelections[id] ?? 2;

                return (
                  <div
                    key={id}
                    onClick={() => toggleHourly(id)}
                    className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-200 group
                      ${selected ? "border-blue-600 shadow-xl shadow-blue-100" : "border-slate-100 hover:border-blue-200 hover:shadow-lg"}`}
                  >
                    {/* IMAGE */}
                    <div className="relative w-full overflow-hidden bg-slate-200" style={{ aspectRatio: "16/9" }}>
                      <ServiceImage src={img} alt={label} color={color}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${selected ? "scale-105" : "group-hover:scale-105"}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                      <div className={`absolute inset-0 transition-all duration-300 ${selected ? "bg-blue-900/25" : "bg-transparent"}`} />

                      {/* Check */}
                      <div className={`absolute top-2.5 right-2.5 bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 ${selected ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                        <Check size={10} strokeWidth={3.5} />
                      </div>

                      {/* Bottom row: label + details btn */}
                      <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 flex items-end justify-between">
                        <div>
                          <p className="text-white text-sm font-bold drop-shadow-md leading-tight">{label}</p>
                          <p className="text-white/60 text-[10px] mt-0.5">Hourly · monthly billing</p>
                        </div>
                        <button
                          onClick={(e) => openDetails(e, svc)}
                          className="flex items-center gap-1 bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all border border-white/20"
                        >
                          <Info size={10} />
                          Details
                        </button>
                      </div>
                    </div>

                    {/* DESC + STEPPER */}
                    <div className={`px-4 pt-3 pb-4 transition-colors duration-200 ${selected ? "bg-blue-50/60" : "bg-white"}`}>
                      <p className={`text-xs leading-relaxed ${selected ? "text-blue-500" : "text-slate-400"}`}>{desc}</p>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${selected ? "max-h-14 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between bg-[#1E293B] rounded-xl px-4 py-2.5">
                          <span className="text-slate-400 text-xs font-semibold">Hours / day</span>
                          <div className="flex items-center gap-4">
                            <button onClick={(e) => changeHours(id, -1, e)} disabled={hours <= 1}
                              className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-25 flex items-center justify-center transition-all active:scale-95">
                              <Minus size={12} className="text-white" />
                            </button>
                            <span className="text-white text-sm font-black w-6 text-center tabular-nums">{hours}h</span>
                            <button onClick={(e) => changeHours(id, +1, e)} disabled={hours >= 8}
                              className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-25 flex items-center justify-center transition-all active:scale-95">
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Also Available</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* FLAT RATE SERVICES */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Fixed Rate Services</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-5">
              Monthly flat rate · adjusted by family size or house size
            </p>

            {/* Mobile: 1 col × 4 rows  |  Desktop: 2 cols × 2 rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FLAT_SERVICES.map((svc) => {
                const { id, label, img, color, pricingType } = svc;
                const selected = flatServices.includes(id);
                const meta     = PRICING_TYPE_META[pricingType];

                return (
                  <div
                    key={id}
                    onClick={() => toggleFlat(id)}
                    className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-200 group
                      ${selected ? "border-blue-600 shadow-xl shadow-blue-100" : "border-slate-100 hover:border-blue-200 hover:shadow-lg"}`}
                  >
                    <div className="relative w-full overflow-hidden bg-slate-200" style={{ aspectRatio: "16/9" }}>
                      <ServiceImage src={img} alt={label} color={color}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${selected ? "scale-105" : "group-hover:scale-105"}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/5 to-transparent" />
                      <div className={`absolute inset-0 transition-all duration-300 ${selected ? "bg-blue-900/25" : "bg-transparent"}`} />

                      <div className={`absolute top-2.5 right-2.5 bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 ${selected ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                        <Check size={10} strokeWidth={3.5} />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 flex items-end justify-between">
                        <div>
                          <p className="text-white text-sm font-bold drop-shadow-md">{label}</p>
                          {/* Shows whether price depends on family size or house size */}
                          <span className={`inline-block mt-1 text-[9px] font-bold text-white px-2 py-0.5 rounded-full ${meta.bg}`}>
                            {meta.label}
                          </span>
                        </div>
                        <button
                          onClick={(e) => openDetails(e, svc)}
                          className="flex items-center gap-1 bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all border border-white/20"
                        >
                          <Info size={10} />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* FIXED CTA BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {totalSelected > 0 && (
            <div className="hidden sm:flex items-center gap-2 flex-wrap flex-1 overflow-hidden min-w-0">
              {Object.entries(hourlySelections).map(([id, hrs]) => {
                const s = HOURLY_SERVICES.find((x) => x.id === id);
                return (
                  <span key={id} className="text-xs font-semibold text-blue-600 whitespace-nowrap bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                    {s?.label} · {hrs}h/day
                  </span>
                );
              })}
              {flatServices.map((id) => {
                const s = FLAT_SERVICES.find((x) => x.id === id);
                return (
                  <span key={id} className="text-xs font-semibold text-slate-500 whitespace-nowrap bg-slate-100 px-2.5 py-1 rounded-full">
                    {s?.label}
                  </span>
                );
              })}
            </div>
          )}

          <Button
            variant="primary"
            onClick={next}
            disabled={totalSelected === 0}
            className={`w-full sm:w-auto sm:min-w-[220px] sm:ml-auto py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all
              ${totalSelected > 0 ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
          >
            {totalSelected > 0 ? "CONTINUE TO BOOKING →" : "SELECT A SERVICE"}
          </Button>
        </div>
      </div>

      {/* DETAILS SHEET */}
      <DetailsSheet service={detailService} onClose={() => setDetailService(null)} />

    </div>
  );
}