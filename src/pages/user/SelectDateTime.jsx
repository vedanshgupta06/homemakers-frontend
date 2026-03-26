import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

function SelectDateTime() {

  const location = useLocation();
  const navigate = useNavigate();

  const { services, hoursPerDay, houseSize, members } = location.state || {};

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customMode, setCustomMode] = useState(false);

  const getNextDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const formatted = d.toISOString().split("T")[0];

      let label = d.toLocaleDateString("en-IN", { weekday: "short" });
      if (i === 0) label = "Today";
      if (i === 1) label = "Tomorrow";

      days.push({
        label,
        day: d.getDate(),
        value: formatted
      });
    }

    return days;
  };

  const TIME_SLOTS = [
    "07:00", "09:00", "11:00",
    "13:00", "15:00", "17:00", "19:00"
  ];

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${suffix}`;
  };

  const next = () => {
    if (!date || !time) return;

    navigate("/user/slots", {
      state: {
        services,
        hoursPerDay,
        houseSize,
        members,
        date,
        preferredStartTime: time
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
          Schedule Service ⏰
        </h2>

        <p className="text-textSub mt-2">
          Choose your preferred date & time
        </p>

      </div>

      {/* 🔥 DATE */}
      <div className="mb-10">

        <h3 className="text-lg font-semibold mb-4 text-textMain">
          Select Date
        </h3>

        <div className="flex gap-4 overflow-x-auto pb-2">

          {getNextDays().map(d => {
            const selected = date === d.value;

            return (
              <Card
                key={d.value}
                onClick={() => setDate(d.value)}
                className={`min-w-[90px] text-center group
                  ${selected && "text-white scale-[1.1] shadow-glow"}
                `}
              >

                {selected && (
                  <div className="absolute inset-0 bg-brand-gradient" />
                )}

                <div className="relative">
                  <p className="text-xs opacity-80">{d.label}</p>
                  <p className="text-xl font-bold">{d.day}</p>

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

      {/* 🔥 TIME HEADER */}
      <div className="flex items-center justify-between mb-4">

        <h3 className="text-lg font-semibold text-textMain">
          Preferred Start Time
        </h3>

        <button
          onClick={() => {
            setCustomMode(!customMode);
            setTime("");
          }}
          className="
            text-sm font-medium
            bg-brand-gradient bg-clip-text text-transparent
            hover:opacity-80 transition
          "
        >
          {customMode ? "Quick Slots" : "Custom Time"}
        </button>

      </div>

      {/* 🔥 TIME */}
      <div className="mb-24">

        {!customMode ? (

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">

            {TIME_SLOTS.map(slot => {
              const selected = time === slot;

              return (
                <Card
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`text-center font-medium group
                    ${selected && "text-white scale-[1.05] shadow-glow"}
                  `}
                >

                  {selected && (
                    <div className="absolute inset-0 bg-brand-gradient" />
                  )}

                  <div className="relative">
                    {formatTime(slot)}

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

        ) : (

          <div className="max-w-sm">

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="
                w-full px-4 py-3 rounded-xl
                border border-borderLight
                focus:outline-none
                focus:ring-2 focus:ring-pink-400
                transition
              "
            />

            <p className="text-xs text-textSub mt-2">
              Select your exact preferred time
            </p>

          </div>

        )}

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
          disabled={!date || !time}
          className={`
            w-full max-w-md py-3 rounded-xl text-white font-medium
            transition-all duration-300

            ${(!date || !time)
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-brand-gradient hover:scale-[1.03] active:scale-[0.97] shadow-glow"
            }
          `}
        >
          Find Available Providers →
        </button>

      </div>

    </Container>
  );
}

export default SelectDateTime;