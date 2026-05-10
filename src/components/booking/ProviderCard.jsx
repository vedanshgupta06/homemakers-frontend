// import { useNavigate } from "react-router-dom";
// import Card from "../ui/Card";
// import Button from "../ui/Button";
// import { useState } from "react";

// export default function ProviderCard({
//   provider,
//   date,
//   index,
//   services,
//   hoursPerDay,
//   houseSize,
//   members,
//   preferredStartTime
// }) {

//   const navigate = useNavigate();

//   const normalize = (d) => d?.split("T")[0];
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const filteredSlots = provider.slots.filter(slot =>
//     normalize(slot.date) === normalize(date) && slot.active
//   );

//   const selectSlot = (slotId) => {
//     navigate("/user/preview", {
//       state: {
//         providerId: provider.providerId,
//         availabilityId: slotId,
//         services,
//         hoursPerDay,
//         houseSize,
//         members,
//         startDate: date,
//         preferredStartTime
//       }
//     });
//   };

//   return (
//     <Card className="flex flex-col md:flex-row gap-4 hover:shadow-md transition">

//       {/* PROFILE */}
//       <img
//         src={
//           provider.profilePhotoUrl
//             ? `http://localhost:8080${provider.profilePhotoUrl}`
//             : "/default-user.png"
//         }
//         alt="provider"
//         className="w-16 h-16 rounded-full object-cover"
//       />

//       <div className="flex-1">

//         {/* NAME */}
//         <h3 className="text-lg font-semibold">{provider.name}</h3>

//         {/* RATING */}
//         <p className="text-sm text-gray-500">
//           ⭐ {provider.rating} • {provider.experience} yrs
//         </p>

//         {/* PRICE */}
//         <p className="text-lg font-semibold mt-1">
//           ₹{provider.price}
//         </p>

//         {/* 🔥 BADGES (FIXED POSITION) */}
//         <div className="flex items-center gap-2 mt-1">

//           {index === 0 && (
//             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
//               Best Price
//             </span>
//           )}

//           {provider.rating >= 4.5 && (
//             <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//               Top Rated
//             </span>
//           )}

//         </div>

//         {/* BREAKDOWN */}
//         <div className="text-sm text-gray-600 mt-2">
//           {Object.entries(provider.breakdown).map(([s, p]) => (
//             <div key={s}>{s} → ₹{p}</div>
//           ))}
//         </div>

//         {/* SLOTS */}
//         <div className="mt-4 flex flex-wrap gap-2">
//           {filteredSlots.map(slot => (
//             <Button
//                 key={slot.id}
//                 variant="outline"
//                 onClick={() => setSelectedSlot(slot.id)}
//                 className={`text-sm px-4 py-1 rounded-full transition
//                     ${selectedSlot === slot.id 
//                     ? "bg-primary text-white" 
//                     : "hover:bg-primary hover:text-white"}
//                 `}
//                 >
//                 {/* {slot.startTime} - {slot.endTime} */}
//                 Book Now
//             </Button>
//           ))}
//         </div>
//         {selectedSlot && (
//         <div className="mt-4">
//             <Button
//             onClick={() => selectSlot(selectedSlot)}
//             className="w-full md:w-auto"
//             >
//             Continue Booking →
//             </Button>
//         </div>
//         )}
//       </div>

//     </Card>
//   );
// }





// import { useNavigate } from "react-router-dom";
// import { MapPin, Navigation, Clock, ChevronRight } from "lucide-react";

// const MATCH_STYLE = {
//   PINCODE_MATCH: { label: "Covers your area", bg: "bg-emerald-100", text: "text-emerald-700" },
//   RADIUS_MATCH:  { label: "Near you",          bg: "bg-blue-100",   text: "text-blue-700"   },
//   CITY_MATCH:    { label: "Same city",         bg: "bg-slate-100",  text: "text-slate-600"  },
// };

// // Format "10:00:00" → "10:00 AM"
// const formatTime = (t) => {
//   if (!t) return "";
//   const [h, m] = t.split(":").map(Number);
//   const period = h >= 12 ? "PM" : "AM";
//   const hour   = h % 12 || 12;
//   return `${hour}:${String(m).padStart(2, "0")} ${period}`;
// };

// export default function ProviderCard({
//   provider,
//   date,
//   index,
//   services,
//   hoursPerDay,
//   houseSize,
//   members,
//   preferredStartTime,
// }) {
//   const navigate = useNavigate();

//   const normalize = (d) => d?.split("T")[0];

//   const filteredSlots = provider.slots.filter(
//     (slot) => normalize(slot.date) === normalize(date) && slot.active
//   );

//   // Use the first available slot automatically
//   const bestSlot = filteredSlots[0] || null;

//   const handleBook = () => {
//     if (!bestSlot) return;
//     navigate("/user/preview", {
//       state: {
//         providerId:      provider.providerId,
//         availabilityId:  bestSlot.id,
//         services,
//         hoursPerDay,
//         houseSize,
//         members,
//         startDate:       date,
//         preferredStartTime,
//       },
//     });
//   };

//   const distanceLabel =
//     provider.distanceKm != null && provider.distanceKm >= 0
//       ? provider.distanceKm < 1
//         ? `${Math.round(provider.distanceKm * 1000)} m away`
//         : `${provider.distanceKm.toFixed(1)} km away`
//       : null;

//   const matchStyle = MATCH_STYLE[provider.matchReason] || MATCH_STYLE.CITY_MATCH;

//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-5">
//       <div className="flex gap-4">

//         {/* PHOTO */}
//         <img
//           src={
//             provider.profilePhotoUrl
//               ? `http://localhost:8080${provider.profilePhotoUrl}`
//               : "/default-user.png"
//           }
//           alt={provider.providerName}
//           className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-100"
//         />

//         <div className="flex-1 min-w-0">

//           {/* NAME + PRICE row */}
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <h3 className="text-base font-black text-slate-800 leading-tight">
//                 {provider.providerName}
//               </h3>
//               <p className="text-xs text-slate-400 mt-0.5">
//                 ⭐ {provider.rating} · {provider.experienceYears} yrs exp
//               </p>
//             </div>
//             <div className="text-right flex-shrink-0">
//               <p className="text-lg font-black text-slate-900">
//                 ₹{provider.totalPrice?.toFixed(0)}
//               </p>
//               <p className="text-[10px] text-slate-400 font-medium">total</p>
//             </div>
//           </div>

//           {/* BADGES */}
//           <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
//             {index === 0 && (
//               <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
//                 Best Match
//               </span>
//             )}
//             {provider.rating >= 4.5 && (
//               <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
//                 Top Rated
//               </span>
//             )}
//             <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${matchStyle.bg} ${matchStyle.text}`}>
//               <MapPin size={9} />
//               {matchStyle.label}
//             </span>
//             {distanceLabel && (
//               <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
//                 <Navigation size={9} />
//                 {distanceLabel}
//               </span>
//             )}
//           </div>

//           {/* PRICE BREAKDOWN */}
//           <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-0.5">
//             {Object.entries(provider.priceBreakdown || {}).map(([s, p]) => (
//               <span key={s} className="text-xs text-slate-500">
//                 <span className="capitalize">{s.replaceAll("_", " ").toLowerCase()}</span>
//                 <span className="text-slate-300 mx-1">·</span>
//                 <span className="font-bold text-slate-700">₹{p}</span>
//               </span>
//             ))}
//           </div>

//           {/* AVAILABILITY + BOOK BUTTON */}
//           <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100">
//             {bestSlot ? (
//               <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
//                 <Clock size={12} className="text-slate-400" />
//                 Available {formatTime(bestSlot.startTime)} – {formatTime(bestSlot.endTime)}
//               </span>
//             ) : (
//               <span className="text-xs text-slate-400">No slots available</span>
//             )}

//             <button
//               onClick={handleBook}
//               disabled={!bestSlot}
//               className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all
//                 ${bestSlot
//                   ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
//                   : "bg-slate-100 text-slate-400 cursor-not-allowed"
//                 }`}
//             >
//               Book Now <ChevronRight size={13} strokeWidth={3} />
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Clock, ChevronRight } from "lucide-react";

const MATCH_STYLE = {
  PINCODE_MATCH: { label: "Covers your area", bg: "bg-emerald-100", text: "text-emerald-700" },
  RADIUS_MATCH:  { label: "Near you",          bg: "bg-blue-100",   text: "text-blue-700"   },
  CITY_MATCH:    { label: "Same city",         bg: "bg-slate-100",  text: "text-slate-600"  },
};

// Mirror of ServiceDurationUtil.java
const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];
const SERVICE_MINUTES = {
  DISH_WASHING: 45,
  CLEANING:     60,
  DUSTING:      30,
  LAUNDRY:      40,
};

function calcBookingMinutes(services = [], hoursPerDay = 1) {
  return services.reduce((total, s) => {
    if (HOURLY_SERVICES.includes(s)) return total + hoursPerDay * 60;
    return total + (SERVICE_MINUTES[s] ?? 30);
  }, 0);
}

function addMinutes(timeStr, mins) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const total  = h * 60 + m + mins;
  const rh     = Math.floor(total / 60) % 24;
  const rm     = total % 60;
  const period = rh >= 12 ? "PM" : "AM";
  const hour   = rh % 12 || 12;
  return `${hour}:${String(rm).padStart(2, "0")} ${period}`;
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function ProviderCard({
  provider,
  date,
  index,
  services,
  hoursPerDay,
  houseSize,
  members,
  preferredStartTime,
}) {
  const navigate = useNavigate();

  const normalize     = (d) => d?.split("T")[0];
  const filteredSlots = provider.slots.filter(
    (slot) => normalize(slot.date) === normalize(date) && slot.active
  );
  const bestSlot = filteredSlots[0] || null;

  const bookingMins  = calcBookingMinutes(services, hoursPerDay || 1);
  const bookingStart = bestSlot?.startTime || null;
  const bookingEnd   = bookingStart ? addMinutes(bookingStart, bookingMins) : null;

  const durationLabel = bookingMins >= 60
    ? bookingMins % 60 === 0
      ? `${bookingMins / 60} hr`
      : `${Math.floor(bookingMins / 60)} hr ${bookingMins % 60} min`
    : `${bookingMins} min`;

  const handleBook = () => {
    if (!bestSlot) return;
    navigate("/user/preview", {
      state: {
        providerId:     provider.providerId,
        availabilityId: bestSlot.id,
        services,
        hoursPerDay,
        houseSize,
        members,
        startDate:      date,
        preferredStartTime,
      },
    });
  };

  const distanceLabel =
    provider.distanceKm != null && provider.distanceKm >= 0
      ? provider.distanceKm < 1
        ? `${Math.round(provider.distanceKm * 1000)} m away`
        : `${provider.distanceKm.toFixed(1)} km away`
      : null;

  const matchStyle = MATCH_STYLE[provider.matchReason] || MATCH_STYLE.CITY_MATCH;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-5">
      <div className="flex gap-4">

        <img
          src={
            provider.profilePhotoUrl
              ? `http://localhost:8080${provider.profilePhotoUrl}`
              : "/default-user.png"
          }
          alt={provider.providerName}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-100"
        />

        <div className="flex-1 min-w-0">

          {/* NAME + PRICE */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-800 leading-tight">
                {provider.providerName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ⭐ {provider.rating} · {provider.experienceYears} yrs exp
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-black text-slate-900">₹{provider.totalPrice?.toFixed(0)}</p>
              <p className="text-[10px] text-slate-400 font-medium">total</p>
            </div>
          </div>

          {/* BADGES */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {index === 0 && (
              <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Best Match
              </span>
            )}
            {provider.rating >= 4.5 && (
              <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                Top Rated
              </span>
            )}
            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${matchStyle.bg} ${matchStyle.text}`}>
              <MapPin size={9} />
              {matchStyle.label}
            </span>
            {distanceLabel && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
                <Navigation size={9} />
                {distanceLabel}
              </span>
            )}
          </div>

          {/* PRICE BREAKDOWN */}
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-0.5">
            {Object.entries(provider.priceBreakdown || {}).map(([s, p]) => (
              <span key={s} className="text-xs text-slate-500">
                <span className="capitalize">{s.replaceAll("_", " ").toLowerCase()}</span>
                <span className="text-slate-300 mx-1">·</span>
                <span className="font-bold text-slate-700">₹{p}</span>
              </span>
            ))}
          </div>

          {/* TIME + BOOK */}
          <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100 gap-3">
            {bestSlot && bookingEnd ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <Clock size={12} className="text-slate-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-600">
                  {formatTime(bookingStart)} – {bookingEnd}
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md font-bold">
                  {durationLabel}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">No slots available</span>
            )}

            <button
              onClick={handleBook}
              disabled={!bestSlot}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-black transition-all flex-shrink-0
                ${bestSlot
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              Book <ChevronRight size={13} strokeWidth={3} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}