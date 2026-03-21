import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function BookingPreview() {

  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  const [preview, setPreview] = useState(null);

  const hourlyServices = ["BABYSITTING", "COOKING"];

  useEffect(() => {

    if (!bookingData) {
      navigate("/user/services");
      return;
    }

    const requestBody = {
      providerId: bookingData.providerId,
      availabilityId: bookingData.availabilityId,
      houseSize: bookingData.houseSize,
      members: bookingData.members,
      startDate: bookingData.startDate,
      preferredStartTime: bookingData.preferredStartTime,
      services: bookingData.services.map(service =>
        hourlyServices.includes(service)
          ? { serviceType: service, hours: bookingData.hoursPerDay }
          : { serviceType: service }
      )
    };

    console.log("Preview Request:", requestBody);

    api.post("/api/bookings/preview", requestBody)
      .then(res => {
        setPreview(res.data);
      })
      .catch(err => {
        console.error("Preview failed", err);
      });

  }, [bookingData, navigate]);

  const confirmBooking = () => {

    const requestBody = {
      providerId: bookingData.providerId,
      availabilityId: bookingData.availabilityId,
      houseSize: bookingData.houseSize,
      members: bookingData.members,
      startDate: bookingData.startDate,
      preferredStartTime: bookingData.preferredStartTime,
      services: bookingData.services.map(service =>
        hourlyServices.includes(service)
          ? { serviceType: service, hours: bookingData.hoursPerDay }
          : { serviceType: service }
      )
    };

    api.post("/api/bookings", requestBody)
      .then(() => {

        alert("Booking created!");
        navigate("/user/my-bookings");

      })
      .catch(err => {
        console.error("Booking failed", err);
      });

  };

  if (!preview) {
    return <p>Loading preview...</p>;
  }

  return (

    <div>

      <h2>Booking Preview</h2>

      <p>
        <b>Provider:</b> {preview.providerName}
      </p>

      <p>
        <b>Slot:</b> {preview.slotStart} - {preview.slotEnd}
      </p>

      <p>
        <b>Services:</b> {Object.keys(preview.serviceWisePrice).join(", ")}
      </p>

      <p>
        <b>House Size:</b> {preview.houseSize}
      </p>

      <p>
        <b>Members:</b> {preview.members}
      </p>

      <h3>
        Total Monthly Price: ₹{preview.totalMonthlyPrice}
      </h3>

      <button onClick={confirmBooking}>
        Confirm Booking
      </button>

    </div>

  );

}

export default BookingPreview;