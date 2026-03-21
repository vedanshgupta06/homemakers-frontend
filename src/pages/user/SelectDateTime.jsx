import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function SelectDateTime() {

  const location = useLocation();
  const navigate = useNavigate();

  const { services, hoursPerDay, houseSize, members } = location.state || {};

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const next = () => {

    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

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
    <div>

      <h2>Select Date & Time</h2>

      <div>
        <p>Select Start Date</p>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div style={{marginTop:"20px"}}>

        <p>Preferred Start Time</p>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

      </div>

      <br/>

      <button onClick={next}>
        Find Available Providers
      </button>

    </div>
  );
}

export default SelectDateTime;