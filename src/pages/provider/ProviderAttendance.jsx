import { useEffect, useState } from "react";
import { getTodayAttendance, markPresent } from "../../api/attendanceApi";

export default function ProviderAttendance() {

  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    try {
      const res = await getTodayAttendance();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleMarkPresent = async (id) => {
    try {
      await markPresent(id);
      loadLogs(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Today's Attendance</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.bookingId}</td>
              <td>{log.customerName}</td>
              <td>{log.workDate}</td>
              <td>{log.status}</td>

              <td>
                {log.status === "PENDING" && (
                  <button onClick={() => handleMarkPresent(log.id)}>
                    Mark Present
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}