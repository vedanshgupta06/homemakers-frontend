import { useLocation, useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function BookingSuccess() {

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  return (
    <Container>

      <div className="flex justify-center items-center min-h-[60vh]">

        <Card className="text-center space-y-4 max-w-md w-full">

          {/* ICON */}
          <div className="text-5xl">✅</div>

          {/* TITLE */}
          <h2 className="text-2xl font-semibold text-primary">
            Booking Confirmed!
          </h2>

          {/* MESSAGE */}
          <p className="text-gray-500">
            Your service has been successfully booked.
          </p>

          {/* DETAILS */}
          {data && (
            <div className="text-sm text-gray-600 space-y-1">
              <p><b>Provider:</b> {data.providerName}</p>
              <p><b>Slot:</b> {data.slot}</p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 justify-center pt-4">

            <Button onClick={() => navigate("/user/my-bookings")}>
              View Bookings
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>

          </div>

        </Card>

      </div>

    </Container>
  );
}

export default BookingSuccess;