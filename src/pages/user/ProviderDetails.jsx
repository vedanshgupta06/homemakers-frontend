import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function ProviderDetails() {
  const { providerId } = useParams();

  const [provider, setProvider] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [pricePreview, setPricePreview] = useState(null);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [error, setError] = useState("");

  /* ===============================
     LOAD PROVIDER
  =============================== */
  useEffect(() => {
    api.get(`/api/providers/${providerId}`)
      .then(res => setProvider(res.data))
      .catch(() => setError("Failed to load provider"));
  }, [providerId]);

  /* ===============================
     LOAD AVAILABILITY
  =============================== */
  const loadAvailability = () => {
    api.get(`/api/provider/availability/${providerId}`)
      .then(res => {
        setSlots(res.data.filter(s => s.active));
      })
      .catch(() => setError("Failed to load availability"));
  };

  useEffect(() => {
    loadAvailability();
  }, [providerId]);

  /* ===============================
     SERVICE SELECTION
  =============================== */
  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  /* ===============================
     PRICE PREVIEW (RESTORED)
  =============================== */
  useEffect(() => {
    if (selectedServices.length === 0) {
      setPricePreview(null);
      return;
    }

    api.post("/api/bookings/preview", {
      providerId: Number(providerId),
      services: selectedServices,
      hoursPerDay: hoursPerDay ? Number(hoursPerDay) : null
    })
      .then(res => setPricePreview(res.data))
      .catch(() => setPricePreview(null));
  }, [selectedServices, hoursPerDay, providerId]);

  /* ===============================
     BOOK SLOT
  =============================== */
  const bookSlot = async (slotId) => {
    if (!pricePreview) {
      alert("Please select services to calculate price");
      return;
    }

    try {
      setBookingSlotId(slotId);

      await api.post("/api/bookings", {
        availabilityId: slotId,
        services: selectedServices,
        hoursPerDay: hoursPerDay ? Number(hoursPerDay) : null
      });

      alert("Booking successful");

      setSelectedServices([]);
      setHoursPerDay("");
      setPricePreview(null);
      loadAvailability();

    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingSlotId(null);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div>
      {provider && (
        <>
          <h3>Select Services</h3>

          {provider.services.map(service => (
            <label key={service} style={{ display: "block", marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
              />{" "}
              {service.replaceAll("_", " ")}
            </label>
          ))}

          <div style={{ marginTop: 10 }}>
            <label>Hours per day:</label>
            <input
              type="number"
              min="1"
              value={hoursPerDay}
              onChange={e => setHoursPerDay(e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </div>
        </>
      )}

      {/* PRICE PREVIEW */}
      {pricePreview && (
        <div style={{
          border: "1px solid #ccc",
          padding: 12,
          margin: "16px 0"
        }}>
          <h4>Monthly Price Preview</h4>

          {Object.entries(pricePreview.serviceWisePrice).map(
            ([service, price]) => (
              <div key={service}>
                {service.replaceAll("_", " ")} : ₹{price}
              </div>
            )
          )}

          <hr />
          <strong>Total: ₹{pricePreview.totalMonthlyPrice}</strong>
          <p style={{ fontSize: 12 }}>Includes 3 paid leaves</p>
        </div>
      )}

      <h2>Available Slots</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {slots.map(slot => (
        <div
          key={slot.id}
          style={{
            border: "1px solid #e5e7eb",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6
          }}
        >
          <div><b>Date:</b> {slot.date}</div>
          <div><b>Time:</b> {slot.startTime} - {slot.endTime}</div>

          <button
            onClick={() => bookSlot(slot.id)}
            disabled={bookingSlotId === slot.id}
            style={{
              marginTop: 8,
              padding: "6px 12px",
              background: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: 6
            }}
          >
            {bookingSlotId === slot.id ? "Booking..." : "Book this slot"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProviderDetails;
