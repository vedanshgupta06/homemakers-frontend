import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Requirements() {

  const location = useLocation();
  const navigate = useNavigate();

  const { services, hoursPerDay } = location.state || {};

  const [houseSize, setHouseSize] = useState("1BHK");
  const [members, setMembers] = useState(4);

  const next = () => {

    if (!houseSize || members <= 0) {
      alert("Please enter valid requirements");
      return;
    }

    navigate("/user/date", {
      state: {
        services,
        hoursPerDay,
        houseSize,
        members
      }
    });

  };

  return (
    <div>

      <h2>House Requirements</h2>

      <div>
        <p>House Size</p>

        <select
          value={houseSize}
          onChange={(e) => setHouseSize(e.target.value)}
        >
          <option value="1RK">1RK</option>
          <option value="1BHK">1BHK</option>
          <option value="2BHK">2BHK</option>
          <option value="3BHK">3BHK</option>
          <option value="4BHK_PLUS">4BHK+</option>
        </select>

      </div>

      <div style={{marginTop:"20px"}}>

        <p>Number of Members</p>

        <input
          type="number"
          min="1"
          value={members}
          onChange={(e) => setMembers(Number(e.target.value))}
        />

      </div>

      <br/>

      <button onClick={next}>
        Continue
      </button>

    </div>
  );
}

export default Requirements;