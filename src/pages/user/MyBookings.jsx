import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

function MyBookings() {

  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ACTIVE");

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/bookings/user")
      .then(res => {
        setBookings(res.data);
        setError("");
      })
      .catch(() => {
        setError("No bookings available");
      });
  }, []);

  const filteredBookings = bookings.filter((b) => {

    if (filter === "ACTIVE") {
      return b.status === "PENDING" || b.status === "CONFIRMED";
    }

    if (filter === "COMPLETED") {
      return b.status === "COMPLETED";
    }

    if (filter === "CANCELLED") {
      return b.status === "REJECTED";
    }

    return true;
  });

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${suffix}`;
  };

  return (
    <Container>

      {/* 🔥 HEADER */}
      <div className="mb-8">

        <h2 className="
          text-3xl font-bold
          bg-brand-gradient bg-clip-text text-transparent
        ">
          My Bookings 📋
        </h2>

        <p className="text-textSub mt-2">
          Manage and track your services
        </p>

      </div>

      {/* 🔥 FILTER TABS */}
      <div className="flex gap-3 mb-8">

        {["ACTIVE", "COMPLETED", "CANCELLED"].map((f) => (

          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-all

              ${filter === f
                ? "bg-brand-gradient text-white shadow-glow scale-[1.05]"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {f}
          </button>

        ))}

      </div>

      {/* ERROR */}
      {error && bookings.length === 0 && (
        <p className="text-red-500">{error}</p>
      )}

      {/* EMPTY */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-20">

          <p className="text-lg font-medium text-textMain">
            No bookings found 😔
          </p>

          <p className="text-textSub mt-2">
            Book a service to get started
          </p>

        </div>
      )}

      {/* BOOKINGS */}
      <div className="space-y-5">

        {filteredBookings.map((b, index) => (

          <Card
            key={b.id}
            className="hover:shadow-xl transition-all duration-300"
          >

            {/* 🔥 TOP ROW */}
            <div className="flex justify-between items-start">

              <div>

                <h3 className="font-semibold text-lg text-textMain">
                  {b.services?.length > 0
                    ? b.services.map(s => s.replace("_", " ")).join(", ")
                    : "No Service"}
                </h3>

                <p className="text-sm text-textSub">
                  {b.provider.user.email}
                </p>

              </div>

              <span
                className={`
                  px-3 py-1 text-xs font-semibold rounded-full
                  ${statusStyles[b.status]}
                `}
              >
                {b.status}
              </span>

            </div>

            {/* 🔥 DATE + TIME */}
            <div className="mt-3 flex gap-6 text-sm text-textSub">

              <div>
                <p className="text-xs opacity-70">Date</p>
                <p className="font-medium">
                  {b.availability.date}
                </p>
              </div>

              <div>
                <p className="text-xs opacity-70">Time</p>
                <p className="font-medium">
                  {formatTime(b.availability.startTime)} - {formatTime(b.availability.endTime)}
                </p>
              </div>

            </div>

            {/* 🔥 CTA */}
            <div className="mt-5 flex justify-end">

              <button
                onClick={() => navigate(`/user/bookings/${b.id}`, { state: b })}
                className="
                  text-sm font-medium
                  bg-brand-gradient bg-clip-text text-transparent
                  hover:opacity-80 transition
                "
              >
                View Details →
              </button>

            </div>

          </Card>

        ))}

      </div>

    </Container>
  );
}

export default MyBookings;