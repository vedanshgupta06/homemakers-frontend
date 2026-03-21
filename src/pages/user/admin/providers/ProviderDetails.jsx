import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../../api/axios";

function ProviderDetails() {

  const { providerId } = useParams();

  const [provider, setProvider] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [pricePreview, setPricePreview] = useState(null);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [error, setError] = useState("");
  const [subscription, setSubscription] = useState(false);

  /* ===============================
     LOAD PROVIDER
  =============================== */

  useEffect(() => {

    api
      .get(`/api/providers/${providerId}`)
      .then((res) => setProvider(res.data))
      .catch(() => setError("Failed to load provider"));

  }, [providerId]);

  /* ===============================
     LOAD AVAILABILITY
  =============================== */

  const loadAvailability = () => {

    api
      .get(`/api/provider/availability/${providerId}`)
      .then((res) => setSlots(res.data.filter((s) => s.active)))
      .catch(() => setError("Failed to load availability"));

  };

  useEffect(() => {
    loadAvailability();
  }, [providerId]);

  /* ===============================
     SERVICE SELECTION
  =============================== */

  const toggleService = (service) => {

    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );

  };

  /* ===============================
     PRICE PREVIEW
  =============================== */

  useEffect(() => {

    if (!provider) return;

    if (selectedServices.length === 0) {
      setPricePreview(null);
      return;
    }

    const requiresHours = provider?.pricing?.some(
      (p) =>
        selectedServices.includes(p.service) &&
        p.pricingType === "HOURLY_MONTHLY"
    );

    if (requiresHours && (!hoursPerDay || Number(hoursPerDay) <= 0)) {
      setPricePreview(null);
      return;
    }

    api
      .post("/api/bookings/preview", {
        providerId: Number(providerId),
        services: selectedServices,
        hoursPerDay: hoursPerDay ? Number(hoursPerDay) : null,
      })
      .then((res) => setPricePreview(res.data))
      .catch(() => setPricePreview(null));

  }, [selectedServices, hoursPerDay, providerId, provider]);

  /* ===============================
     PLATFORM FEE LOGIC
  =============================== */

  const totalPrice = pricePreview?.totalMonthlyPrice || 0;

  const isSubscriptionAllowed = totalPrice >= 5000;

  const platformFee =
    totalPrice === 0
      ? 0
      : isSubscriptionAllowed && subscription
      ? totalPrice * 0.1
      : 199;

  const finalAmount = totalPrice + platformFee;

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
      setSubscription(false);

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

    <div style={{ padding: 20 }}>

      {provider && (

        <div style={{ marginBottom: 20 }}>

          <h2>{provider.user?.name || provider.user?.email}</h2>

          <p><b>City:</b> {provider.city}</p>

          <p><b>Experience:</b> {provider.experienceYears} years</p>

          <p><b>Rating:</b> ⭐ {provider.rating}</p>

          {provider.profilePhotoUrl && (
            <img
              src={`http://localhost:8080${provider.profilePhotoUrl}`}
              alt="provider"
              width="140"
              style={{ borderRadius: 10, marginTop: 10 }}
            />
          )}

        </div>

      )}

      {/* SERVICE SELECTION */}

      {provider && (

        <>

          <h3>Select Services</h3>

          {provider.services?.map((service) => (

            <label key={service} style={{ display: "block", marginBottom: 6 }}>

              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
              />

              {" "}
              {service.replaceAll("_", " ")}

            </label>

          ))}

          <div style={{ marginTop: 10 }}>

            <label>Hours per day:</label>

            <input
              type="number"
              min="1"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              style={{ marginLeft: 10 }}
            />

          </div>

        </>

      )}

      {/* PRICE PREVIEW */}

      {pricePreview && (

        <div
          style={{
            border: "1px solid #ccc",
            padding: 14,
            margin: "16px 0",
            borderRadius: 8,
          }}
        >

          <h4>Monthly Price Preview</h4>

          {Object.entries(pricePreview.serviceWisePrice || {}).map(
            ([service, price]) => (
              <div key={service}>
                {service.replaceAll("_", " ")} : ₹{price}
              </div>
            )
          )}

          <hr />

          <p><b>Service Price:</b> ₹{totalPrice}</p>

          {/* SUBSCRIPTION */}

          <div
            style={{
              marginTop: 12,
              padding: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
            }}
          >

            <label>

              <input
                type="checkbox"
                disabled={!isSubscriptionAllowed}
                checked={subscription}
                onChange={(e) => setSubscription(e.target.checked)}
              />

              {" "}
              Enable Homemakers Subscription (10%)

            </label>

            {!isSubscriptionAllowed && (

              <p style={{ color: "red", fontSize: 12 }}>
                Subscription available only for services ₹5000 or above
              </p>

            )}

          </div>

          <hr />

          <p><b>Platform Fee:</b> ₹{platformFee}</p>

          <p style={{ fontSize: 18 }}>
            <b>Total Payable:</b> ₹{finalAmount}
          </p>

        </div>

      )}

      {/* AVAILABILITY */}

      <h2>Available Slots</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {slots.length === 0 && <p>No available slots</p>}

      {slots.map((slot) => (

        <div
          key={slot.id}
          style={{
            border: "1px solid #e5e7eb",
            padding: 12,
            marginBottom: 12,
            borderRadius: 6,
          }}
        >

          <div>
            <b>Date:</b> {slot.date}
          </div>

          <div>
            <b>Time:</b> {slot.startTime} - {slot.endTime}
          </div>

          <button
            onClick={() => bookSlot(slot.id)}
            disabled={bookingSlotId === slot.id}
            style={{
              marginTop: 8,
              padding: "6px 12px",
              background: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: 6,
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