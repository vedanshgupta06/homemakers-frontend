import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

function SelectServices() {

  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState(2);

  const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];
  const FLAT_SERVICES = ["DISH_WASHING", "CLEANING", "DUSTING", "LAUNDRY"];

  const format = (s) =>
    s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  const toggleService = (service) => {
    setServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const next = () => {
    if (services.length === 0) return;

    navigate("/user/requirements", {
      state: {
        services,
        hoursPerDay: Number(hoursPerDay)
      }
    });
  };

  return (
    <Container>

      {/* 🔥 HEADER */}
      <div className="mb-8 animate-fadeIn">

        <h2 className="
          text-3xl font-bold
          bg-brand-gradient bg-clip-text text-transparent
        ">
          Choose Services 🧹
        </h2>

        <p className="text-textSub mt-2">
          Select what you need for your home
        </p>

      </div>

      {/* 🔥 HOURLY */}
      <div className="mb-10">

        <h3 className="text-lg font-semibold mb-4 text-textMain">
          Hourly Services
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

          {HOURLY_SERVICES.map(service => {
            const selected = services.includes(service);

            return (
              <Card
                key={service}
                onClick={() => toggleService(service)}
                className={`group overflow-hidden
                  ${selected && "shadow-glow scale-[1.05] text-white"}
                `}
              >

                {/* GRADIENT */}
                {selected && (
                  <div className="absolute inset-0 bg-brand-gradient" />
                )}

                <div className="relative">

                  <p className="font-medium text-sm">
                    {format(service)}
                  </p>

                  {/* underline */}
                  <div className="
                    mt-2 h-[2px] w-0
                    bg-brand-gradient
                    transition-all duration-300
                    group-hover:w-full
                  " />

                </div>

              </Card>
            );
          })}

        </div>

        {/* 🔥 HOURS PICKER */}
        <div className="mt-6">

          <p className="text-sm text-textSub mb-2">
            Hours per day
          </p>

          <div className="flex gap-3">

            {[1,2,3,4,5,6].map(h => (
              <button
                key={h}
                onClick={() => setHoursPerDay(h)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium

                  transition-all duration-300

                  ${hoursPerDay === h
                    ? "bg-brand-gradient text-white shadow-glow scale-105"
                    : "bg-white border border-borderLight hover:shadow"
                  }
                `}
              >
                {h}h
              </button>
            ))}

          </div>

        </div>

      </div>

      {/* 🔥 MONTHLY */}
      <div className="mb-24">

        <h3 className="text-lg font-semibold mb-4 text-textMain">
          Monthly Services
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

          {FLAT_SERVICES.map(service => {
            const selected = services.includes(service);

            return (
              <Card
                key={service}
                onClick={() => toggleService(service)}
                className={`group overflow-hidden
                  ${selected && "shadow-glow scale-[1.05] text-white"}
                `}
              >

                {selected && (
                  <div className="absolute inset-0 bg-brand-gradient" />
                )}

                <div className="relative">

                  <p className="font-medium text-sm">
                    {format(service)}
                  </p>

                  <div className="
                    mt-2 h-[2px] w-0
                    bg-brand-gradient
                    transition-all duration-300
                    group-hover:w-full
                  " />

                </div>

              </Card>
            );
          })}

        </div>

      </div>

      {/* 🔥 CTA */}
      <div className="
        fixed bottom-0 left-0 w-full
        bg-white/80 backdrop-blur-md
        border-t border-borderLight
        p-4 flex justify-center shadow-soft
      ">

        <button
          onClick={next}
          disabled={services.length === 0}
          className={`
            w-full max-w-md py-3 rounded-xl text-white font-medium
            transition-all duration-300

            ${services.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-brand-gradient hover:scale-[1.03] active:scale-[0.97] shadow-glow"
            }
          `}
        >
          Continue →
        </button>

      </div>

    </Container>
  );
}

export default SelectServices;