import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

// ✅ NEW IMPORTS
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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
        navigate("/user/success", {
          state: {
            providerName: preview.providerName,
            slot: `${preview.slotStart} - ${preview.slotEnd}`
          }
        });
      })
      .catch(err => {
        console.error("Booking failed", err);
      });

  };

  // ✅ LOADING STATE (UPGRADED)
  if (!preview) {
    return (
      <Container>
        <div className="text-gray-400">Loading preview...</div>
      </Container>
    );
  }

  return (

    <Container>

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-primary mb-6">
        Booking Preview
      </h2>

      <Card className="space-y-4">

        {/* PROVIDER */}
        <div>
          <p className="text-sm text-gray-500">Provider</p>
          <p className="font-medium">{preview.providerName}</p>
        </div>

        {/* SLOT */}
        <div>
          <p className="text-sm text-gray-500">Time Slot</p>
          <p>{preview.slotStart} - {preview.slotEnd}</p>
        </div>

        {/* SERVICES */}
        <div>
          <p className="text-sm text-gray-500">Services</p>
          <p>{Object.keys(preview.serviceWisePrice).join(", ")}</p>
        </div>

        {/* HOUSE SIZE */}
        <div>
          <p className="text-sm text-gray-500">House Size</p>
          <p>{preview.houseSize}</p>
        </div>

        {/* MEMBERS */}
        <div>
          <p className="text-sm text-gray-500">Members</p>
          <p>{preview.members}</p>
        </div>

        {/* PRICE */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">Total Monthly Price</p>
          <p className="text-xl font-semibold text-primary">
            ₹{preview.totalMonthlyPrice}
          </p>
        </div>

        {/* CTA BUTTON */}
        <Button
          onClick={confirmBooking}
          className="w-full mt-4"
        >
          Confirm Booking
        </Button>

      </Card>

    </Container>

  );

}

export default BookingPreview;