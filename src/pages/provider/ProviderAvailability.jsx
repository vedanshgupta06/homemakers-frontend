import { useEffect, useState } from "react";
import api from "../../api/axios";

function ProviderAvailability() {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const loadAvailability = async () => {
    try {
      const res = await api.get("/api/provider/availability/my");
      setSlots(res.data);
    } catch (err) {
      setError("Failed to load availability");
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const addSlot = async () => {
    try {
      await api.post("/api/provider/availability", {
        date,
        startTime,
        endTime
      });

      setDate("");
      setStartTime("");
      setEndTime("");
      loadAvailability();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add slot");
    }
  };

  return (
    <div>
      <h2>My Availability</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Add New Slot</h3>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <br />
      <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
      <br />
      <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
      <br />
      <button onClick={addSlot}>Add Slot</button>

      <hr />

      <h3>Existing Slots</h3>

      {slots.length === 0 && <p>No slots added yet</p>}

      <ul>
        {slots.map(slot => (
          <li key={slot.id}>
            <b>Date:</b> {slot.date} <br />
            <b>Time:</b> {slot.startTime} - {slot.endTime} <br />
            <b>Status:</b>{" "}
            {slot.active ? "Available" : "Booked"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProviderAvailability;
