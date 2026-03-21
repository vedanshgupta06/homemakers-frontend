import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectServices() {

  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState(2);

  const HOURLY_SERVICES = [
    "BABYSITTING",
    "ELDER_CARE",
    "COOKING"
  ];

  const FLAT_SERVICES = [
    "DISH_WASHING",
    "CLEANING",
    "DUSTING",
    "LAUNDRY"
  ];

  const toggleService = (service) => {

    if (services.includes(service)) {
      setServices(services.filter(s => s !== service));
    } else {
      setServices([...services, service]);
    }

  };

  const next = () => {

    if (services.length === 0) {
      alert("Please select at least one service");
      return;
    }

    navigate("/user/requirements", {
      state: {
        services,
        hoursPerDay: Number(hoursPerDay)
      }
    });

  };

  return (
    <div>

      <h2>Select Services</h2>

      {/* Hourly Services */}
      <h3>Hourly Monthly Services</h3>

      {HOURLY_SERVICES.map(service => (
        <label key={service} style={{display:"block"}}>
          <input
            type="checkbox"
            onChange={() => toggleService(service)}
          />
          {service.replace("_"," ")}
        </label>
      ))}

      <div style={{marginTop:"10px"}}>
        <p>Hours Per Day</p>

        <input
          type="number"
          min="1"
          max="12"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(e.target.value)}
        />
      </div>

      {/* Flat Services */}
      <h3 style={{marginTop:"20px"}}>Flat Monthly Services</h3>

      {FLAT_SERVICES.map(service => (
        <label key={service} style={{display:"block"}}>
          <input
            type="checkbox"
            onChange={() => toggleService(service)}
          />
          {service.replace("_"," ")}
        </label>
      ))}

      <br/>

      <button onClick={next}>
        Continue
      </button>

    </div>
  );
}

export default SelectServices;