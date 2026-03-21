import { useEffect, useState } from "react";
import {
  getCustomerAttendance,
  confirmAttendance,
  rejectAttendance
} from "../../api/attendanceApi";

export default function AttendanceApproval() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      const res = await getCustomerAttendance();
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await confirmAttendance(id);
      loadLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectAttendance(id);
      loadLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PRESENT":
        return { color: "#1e88e5", fontWeight: "bold" };
      case "CONFIRMED_PRESENT":
        return { color: "green", fontWeight: "bold" };
      case "REJECTED":
        return { color: "red", fontWeight: "bold" };
      default:
        return { color: "gray" };
    }
  };

  return (
    <div style={{ padding: "30px" }}>

      <h2 style={{ marginBottom: "20px" }}>
        Service Attendance Verification
      </h2>

      {loading ? (
        <p>Loading attendance...</p>
      ) : logs.length === 0 ? (
        <p>No attendance records today.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={th}>Provider</th>
              <th style={th}>Booking</th>
              <th style={th}>Date</th>
              <th style={th}>Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>

                <td style={td}>{log.providerName}</td>

                <td style={td}>#{log.bookingId}</td>

                <td style={td}>{log.workDate}</td>

                <td style={{ ...td, ...getStatusStyle(log.status) }}>
                  {log.status}
                </td>

                <td style={td}>
                  {log.status === "PRESENT" && (
                    <>
                      <button
                        onClick={() => handleConfirm(log.id)}
                        style={confirmBtn}
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() => handleReject(log.id)}
                        style={rejectBtn}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {log.status === "CONFIRMED_PRESENT" && (
                    <span style={{ color: "green" }}>✔ Confirmed</span>
                  )}

                  {log.status === "REJECTED" && (
                    <span style={{ color: "red" }}>✖ Rejected</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}

const th = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #ddd"
};

const td = {
  padding: "12px"
};

const confirmBtn = {
  background: "#2e7d32",
  color: "white",
  border: "none",
  padding: "6px 12px",
  marginRight: "10px",
  cursor: "pointer",
  borderRadius: "4px"
};

const rejectBtn = {
  background: "#c62828",
  color: "white",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer",
  borderRadius: "4px"
};