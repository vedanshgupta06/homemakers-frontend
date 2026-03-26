import { useEffect, useState } from "react";
import api from "../../api/axios";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function ProviderAvailability() {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("UPCOMING");

  const loadAvailability = async () => {
    try {
      const res = await api.get("/api/provider/availability/my");
      setSlots(res.data);
    } catch (err) {
      setError("Failed to load availability");
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const addSlot = async () => {
    if (!date || !startTime || !endTime) {
      setError("Please fill all fields");
      return;
    }

    try {
      await api.post("/api/provider/availability", {
        date,
        startTime,
        endTime,
      });

      setDate("");
      setStartTime("");
      setEndTime("");
      setError("");
      loadAvailability();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add slot");
    }
  };

  // ✅ DATE FILTER LOGIC
  const today = new Date().toISOString().split("T")[0];

  const filteredSlots =
    tab === "UPCOMING"
      ? slots.filter((s) => s.date >= today)
      : slots.filter((s) => s.date < today);

  return (
    <Container>
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">

        {/* 🔥 HEADER */}
        <div className="relative">
          <div className="
            absolute -top-16 -left-10 w-72 h-72 
            bg-pink-400/20 blur-3xl rounded-full
            pointer-events-none
          "></div>

          <div className="relative z-10">
            <h2 className="
              text-3xl font-bold 
              bg-brand-gradient bg-clip-text text-transparent
            ">
              My Availability 🗓️
            </h2>

            <p className="text-textSub mt-2">
              Manage your working slots and schedule
            </p>
          </div>
        </div>

        {/* ➕ ADD SLOT */}
        <Card>
          <h3 className="font-semibold mb-4">Add New Slot</h3>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400"
            />

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400"
            />

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400"
            />

          </div>

          <Button className="mt-4" onClick={addSlot}>
            Add Slot
          </Button>
        </Card>

        {/* 🔥 TABS */}
        <div className="flex gap-3">
          {["UPCOMING", "PAST"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium border transition

                ${
                  tab === t
                    ? "bg-brand-gradient text-white border-transparent shadow-glow"
                    : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 📋 SLOTS */}
        <Card>
          <h3 className="font-semibold mb-4">
            {tab === "UPCOMING" ? "Upcoming Slots" : "Past Slots"}
          </h3>

          {filteredSlots.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No slots available
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">

              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="
                    p-4 rounded-xl border
                    hover:shadow-md hover:scale-[1.02]
                    transition-all duration-300
                  "
                >
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{slot.date}</p>

                  <p className="text-sm text-gray-500 mt-2">Time</p>
                  <p className="font-semibold">
                    {slot.startTime} - {slot.endTime}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">Status</p>

                  <span
                    className={`
                      inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium
                      ${
                        slot.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }
                    `}
                  >
                    {slot.active ? "Available" : "Booked"}
                  </span>
                </div>
              ))}

            </div>
          )}
        </Card>

      </div>
    </Container>
  );
}

export default ProviderAvailability;