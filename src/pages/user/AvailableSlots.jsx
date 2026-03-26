import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import Container from "../../components/ui/Container";
import ProviderCard from "../../components/booking/ProviderCard";
import SkeletonCard from "../../components/ui/SkeletonCard";

function AvailableSlots() {

  const location = useLocation();

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

  const formattedDate = date
    ? new Date(date).toISOString().split("T")[0]
    : null;

  const normalize = (d) => d?.split("T")[0];

  useEffect(() => {

    if (!services || services.length === 0) return;

    setLoading(true);

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

      Promise.all(promises)
        .then(setProviders)
        .finally(() => setLoading(false));

    })
    .catch(err => {
      console.error("Error fetching providers:", err);
      setLoading(false);
    });

  }, [services]);

  // 🔥 FILTERED PROVIDERS
  const validProviders = providers
    .filter(provider => {
      const validSlots = provider.slots.filter(slot =>
        normalize(slot.date) === normalize(formattedDate) &&
        slot.active === true
      );
      return validSlots.length > 0;
    })
    .sort((a, b) => a.price - b.price);

  return (
    <Container>

      {/* 🔥 HEADER */}
      <div className="mb-8 animate-fadeIn">

        <h2 className="
          text-3xl font-bold
          bg-brand-gradient bg-clip-text text-transparent
        ">
          Choose Your Professional 👩‍🔧
        </h2>

        <p className="text-textSub mt-2">
          Available on {date}
        </p>

      </div>

      {/* 🔥 LOADING */}
      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ❌ EMPTY STATE */}
      {!loading && validProviders.length === 0 && (
        <div className="text-center py-20 animate-fadeIn">

          <p className="text-lg font-medium text-textMain">
            No providers available 😔
          </p>

          <p className="text-sm text-textSub mt-2">
            Try changing date or time
          </p>

        </div>
      )}

      {/* 🔥 PROVIDER LIST */}
      <div className="space-y-6">

        {!loading && validProviders.map((provider, index) => (

          <div
            key={provider.providerId}
            className="animate-fadeIn"
          >

            {/* 🏆 BEST CHOICE TAG */}
            {index === 0 && (
              <div className="
                inline-block mb-2 px-3 py-1 text-xs font-medium
                bg-brand-gradient text-white rounded-full shadow-glow
              ">
                ⭐ Best Price
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

    </Container>
  );
}

export default AvailableSlots;