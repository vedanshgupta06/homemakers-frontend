import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

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

  const formattedDate = date
    ? new Date(date).toISOString().split("T")[0]
    : null;

  // 🔥 normalize function (fixes timezone issues)
  const normalize = (d) => d?.split("T")[0];

  useEffect(() => {

    if (!services || services.length === 0) return;

    api.post("/api/bookings/provider-options", {
      services: services.map(s => ({
        serviceType: s,
        hours: hoursPerDay
      })),
      houseSize,
      members,
      startDate: date  
    })
    .then(res => {

      const providerOptions = res.data;

      const promises = providerOptions.map(p =>
        api.get(`/api/provider/availability/${p.providerId}`)
          .then(slotRes => ({
            ...p,
            slots: slotRes.data
          }))
      );

      Promise.all(promises).then(setProviders);

    })
    .catch(err => {
      console.error("Error fetching providers:", err);
    });

  }, [services]);

  const selectSlot = (providerId, slotId) => {

    navigate("/user/preview", {
      state: {
        providerId,
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

    <div>

      <h2>Choose Provider & Slot</h2>

      <p>Date: {date}</p>

      {providers.length === 0 && <p>Loading providers...</p>}

      {providers
        // 🔥 ONLY providers with valid slots
        .filter(provider => {

          const validSlots = provider.slots.filter(slot =>
            normalize(slot.date) === normalize(formattedDate) &&
            slot.active === true
          );

          return validSlots.length > 0;
        })
        // 💰 cheapest first
        .sort((a, b) => a.price - b.price)
        .map(provider => {

          const filteredSlots = provider.slots.filter(slot =>
            normalize(slot.date) === normalize(formattedDate) &&
            slot.active === true
          );

          return (

            <div
              key={provider.providerId}
              style={{
                border: "1px solid gray",
                padding: 15,
                margin: 10,
                display: "flex",
                gap: "15px",
                alignItems: "flex-start"
              }}
            >

              {/* 🧑 PHOTO */}
              <img
                src={
                  provider.profilePhotoUrl
                    ? `http://localhost:8080${provider.profilePhotoUrl}`
                    : "/default-user.png"
                }
                alt="provider"
                width="80"
                height="80"
                style={{ borderRadius: "50%" }}
              />

              {/* 📄 INFO */}
              <div style={{ flex: 1 }}>

                <h3>{provider.name}</h3>

                <p>⭐ {provider.rating} | {provider.experience} yrs exp</p>

                <h4>💰 ₹{provider.price}</h4>

                {/* 🔍 BREAKDOWN */}
                <div>
                  {Object.entries(provider.breakdown).map(([s, p]) => (
                    <p key={s}>{s} → ₹{p}</p>
                  ))}
                </div>

                {/* ⏱ SLOTS */}
                <h4>Available Slots</h4>

                {filteredSlots.map(slot => (

                  <div key={slot.id} style={{ marginBottom: "5px" }}>

                    {slot.startTime} - {slot.endTime}

                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => selectSlot(provider.providerId, slot.id)}
                    >
                      Select
                    </button>

                  </div>

                ))}

              </div>

            </div>

          );

        })}

    </div>

  );
}

export default AvailableSlots;