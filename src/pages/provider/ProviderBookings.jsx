import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
} from "../../api/providerBookingApi";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];

export default function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getProviderBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status) => {
    const s = (status || "").toUpperCase().trim();
    if (s === "ONGOING") return "SERVICE_IN_PROGRESS";
    return s;
  };

  const handleAccept = async (id) => {
    await acceptBooking(id);
    loadBookings();
  };

  const handleReject = async (id) => {
    await rejectBooking(id);
    loadBookings();
  };

  const handleStartWork = async (id) => {
    try {
      await api.put(`/api/bookings/${id}/start`);
      loadBookings();
    } catch {
      alert("Failed to start work");
    }
  };

  const handleTerminate = async (id) => {
    const confirm = window.confirm("Terminate this service?");
    if (!confirm) return;

    try {
      await api.put(`/api/bookings/${id}/terminate`);
      loadBookings();
    } catch {
      alert("Failed to terminate");
    }
  };

  const filters = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "In Progress", value: "SERVICE_IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const filteredBookings =
    filter === "ALL"
      ? bookings
      : bookings.filter(
          (b) =>
            normalizeStatus(b.status) === normalizeStatus(filter)
        );

  if (loading) {
    return (
      <Container>
        <div className="max-w-5xl mx-auto py-10">
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      </Container>
    );
  }

  if (!bookings.length) {
    return (
      <Container>
        <div className="max-w-5xl mx-auto py-10">
          <p className="text-gray-500">No bookings available</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">

        {/* 🔥 HEADER (FIXED LAYERING) */}
        <div className="relative">
          <div className="
            absolute -top-16 -left-10 w-72 h-72 
            bg-pink-400/20 blur-3xl rounded-full
            pointer-events-none z-0
          "></div>

          <div className="relative z-10">
            <h2 className="
              text-3xl font-bold 
              bg-brand-gradient bg-clip-text text-transparent
            ">
              My Bookings 📋
            </h2>

            <p className="text-textSub mt-2">
              Manage your assigned work and services
            </p>
          </div>
        </div>

        {/* 🔥 FILTERS (CLICK FIXED) */}
        <div className="relative z-20 flex flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium
                border transition-all duration-300

                ${
                  filter === f.value
                    ? "bg-brand-gradient text-white border-transparent shadow-glow"
                    : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                }
              `}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 📋 BOOKINGS */}
        {filteredBookings.map((booking) => {
          const hasHourlyService = booking.services?.some((s) =>
            HOURLY_SERVICES.includes(s)
          );

          const hours =
            booking.startTime && booking.endTime
              ? (
                  (new Date(`1970-01-01T${booking.endTime}`) -
                    new Date(`1970-01-01T${booking.startTime}`)) /
                  (1000 * 60 * 60)
                ).toFixed(1)
              : null;

          return (
            <Card
              key={booking.bookingId}
              className="
                p-6
                bg-white/80 backdrop-blur-md
                border border-gray-200
                rounded-2xl
                hover:shadow-xl hover:scale-[1.01]
                transition-all duration-300
              "
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-500">Service Date</p>
                <StatusBadge status={booking.status} />
              </div>

              <h3 className="font-semibold text-lg">
                {booking.serviceDate || "-"}
              </h3>

              <p className="text-sm text-gray-500">
                {booking.startTime || "--"} - {booking.endTime || "Ongoing"}
              </p>

              <p className="mt-2">
                <span className="font-medium">Customer:</span>{" "}
                {booking.customerName || "N/A"}
              </p>

              <div className="mt-4">
                <p className="font-medium mb-2">Services</p>

                {booking.services?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {booking.services.map((service, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    No services selected
                  </p>
                )}
              </div>

              <div className="border-t my-4"></div>

              {hasHourlyService && hours && (
                <p className="text-sm">
                  <span className="font-medium">Daily Hours:</span> {hours} hrs
                </p>
              )}

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Days</p>
                  <p className="font-semibold">{booking.totalDays}</p>
                </div>
                <div>
                  <p className="text-gray-500">Chargeable</p>
                  <p className="font-semibold">{booking.chargeableDays}</p>
                </div>
                <div>
                  <p className="text-gray-500">Holidays</p>
                  <p className="font-semibold">{booking.holidays}</p>
                </div>
              </div>

              <div className="mt-5 flex gap-3 flex-wrap">

                {normalizeStatus(booking.status) === "PENDING" && (
                  <>
                    <Button onClick={() => handleAccept(booking.bookingId)}>
                      Accept
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => handleReject(booking.bookingId)}
                    >
                      Reject
                    </Button>
                  </>
                )}

                {normalizeStatus(booking.status) === "CONFIRMED" && (
                  <Button onClick={() => handleStartWork(booking.bookingId)}>
                    Start Work
                  </Button>
                )}

                {normalizeStatus(booking.status) === "SERVICE_IN_PROGRESS" && (
                  <Button
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleTerminate(booking.bookingId)}
                  >
                    Terminate
                  </Button>
                )}

              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}

/* 🎯 STATUS BADGE */
const StatusBadge = ({ status }) => {
  const normalizeStatus = (s) => (s || "").toUpperCase().trim();

  const styles = {
    PENDING: "bg-gray-100 text-gray-600 border border-gray-200",
    CONFIRMED: "bg-blue-100 text-blue-600 border border-blue-200",
    SERVICE_IN_PROGRESS: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    COMPLETED: "bg-green-100 text-green-700 border border-green-200",
    CANCELLED: "bg-red-100 text-red-600 border border-red-200",
  };

  const key = normalizeStatus(status);

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-medium border
        ${styles[key] || "bg-gray-100 text-gray-600"}
      `}
    >
      {key}
    </span>
  );
};