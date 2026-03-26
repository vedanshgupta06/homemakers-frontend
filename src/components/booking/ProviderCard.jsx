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

import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useState } from "react";

export default function ProviderCard({
  provider,
  date,
  index,
  services,
  hoursPerDay,
  houseSize,
  members,
  preferredStartTime
}) {

  const navigate = useNavigate();

  const normalize = (d) => d?.split("T")[0];
  const [selectedSlot, setSelectedSlot] = useState(null);
  const filteredSlots = provider.slots.filter(slot =>
    normalize(slot.date) === normalize(date) && slot.active
  );

  const selectSlot = (slotId) => {
    navigate("/user/preview", {
      state: {
        providerId: provider.providerId,
        availabilityId: slotId,
        services,
        hoursPerDay,
        houseSize,
        members,
        startDate: date,
        preferredStartTime
      }
    });
  };

  return (
    <Card className="flex flex-col md:flex-row gap-4 hover:shadow-md transition">

      {/* PROFILE */}
      <img
        src={
          provider.profilePhotoUrl
            ? `http://localhost:8080${provider.profilePhotoUrl}`
            : "/default-user.png"
        }
        alt="provider"
        className="w-16 h-16 rounded-full object-cover"
      />

      <div className="flex-1">

        {/* NAME */}
        <h3 className="text-lg font-semibold">{provider.name}</h3>

        {/* RATING */}
        <p className="text-sm text-gray-500">
          ⭐ {provider.rating} • {provider.experience} yrs
        </p>

        {/* PRICE */}
        <p className="text-lg font-semibold mt-1">
          ₹{provider.price}
        </p>

        {/* 🔥 BADGES (FIXED POSITION) */}
        <div className="flex items-center gap-2 mt-1">

          {index === 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Best Price
            </span>
          )}

          {provider.rating >= 4.5 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Top Rated
            </span>
          )}

        </div>

        {/* BREAKDOWN */}
        <div className="text-sm text-gray-600 mt-2">
          {Object.entries(provider.breakdown).map(([s, p]) => (
            <div key={s}>{s} → ₹{p}</div>
          ))}
        </div>

        {/* SLOTS */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filteredSlots.map(slot => (
            <Button
                key={slot.id}
                variant="outline"
                onClick={() => setSelectedSlot(slot.id)}
                className={`text-sm px-4 py-1 rounded-full transition
                    ${selectedSlot === slot.id 
                    ? "bg-primary text-white" 
                    : "hover:bg-primary hover:text-white"}
                `}
                >
                {/* {slot.startTime} - {slot.endTime} */}
                Book Now
            </Button>
          ))}
        </div>
        {selectedSlot && (
        <div className="mt-4">
            <Button
            onClick={() => selectSlot(selectedSlot)}
            className="w-full md:w-auto"
            >
            Continue Booking →
            </Button>
        </div>
        )}
      </div>

    </Card>
  );
}