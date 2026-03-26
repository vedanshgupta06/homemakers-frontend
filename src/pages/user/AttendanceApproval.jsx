import { useEffect, useState } from "react";
import {
  getCustomerAttendance,
  confirmAttendance,
  rejectAttendance
} from "../../api/attendanceApi";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

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
    await confirmAttendance(id);
    loadLogs();
  };

  const handleReject = async (id) => {
    await rejectAttendance(id);
    loadLogs();
  };

  const statusStyles = {
    PRESENT: "bg-yellow-100 text-yellow-700",
    CONFIRMED_PRESENT: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <Container>

      {/* 🔥 HEADER + STATS */}
      <div className="mb-8 space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="
            text-3xl font-bold 
            bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
            bg-clip-text text-transparent
          ">
            Attendance Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Track and verify today's attendance
          </p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-semibold">{logs.length}</p>
          </div>

          <div className="p-4 rounded-xl bg-yellow-100/60">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-xl font-semibold text-yellow-800">
              {logs.filter(l => l.status === "PRESENT").length}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-green-100/60">
            <p className="text-sm text-green-700">Confirmed</p>
            <p className="text-xl font-semibold text-green-800">
              {logs.filter(l => l.status === "CONFIRMED_PRESENT").length}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-red-100/60">
            <p className="text-sm text-red-700">Rejected</p>
            <p className="text-xl font-semibold text-red-800">
              {logs.filter(l => l.status === "REJECTED").length}
            </p>
          </div>

        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400">Loading attendance...</p>
      )}

      {/* EMPTY */}
      {!loading && logs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg font-medium">
            No attendance today 🎉
          </p>
          <p className="text-gray-400 mt-2">
            Everything is up to date
          </p>
        </div>
      )}

      {/* SINGLE ITEM NOTE */}
      {logs.length === 1 && (
        <div className="text-center text-gray-400 text-sm mb-4">
          Only one attendance today
        </div>
      )}

      {/* LIST */}
      <div className="space-y-5">

        {logs
          .sort((a, b) => {
            const order = {
              PRESENT: 0,
              PENDING: 1,
              CONFIRMED_PRESENT: 2,
              REJECTED: 3
            };
            return order[a.status] - order[b.status];
          })
          .map((log) => (

          <Card
            key={log.id}
            className="
              flex justify-between items-center
              border border-gray-200
              hover:shadow-xl
              transition-all duration-300
            "
          >

            {/* LEFT */}
            <div>

              <h3 className="font-semibold text-lg">
                {log.providerName}
              </h3>

              <p className="text-sm text-gray-500">
                Booking #{log.bookingId}
              </p>

              <p className="text-sm text-gray-500">
                📅 {log.workDate}
              </p>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

              {/* STATUS */}
              <span
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${statusStyles[log.status]}
                `}
              >
                {log.status.replace("_", " ")}
              </span>

              {/* ACTIONS */}
              {log.status === "PRESENT" && (
                <div className="flex gap-2">

                  <button
                    onClick={() => handleConfirm(log.id)}
                    className="
                      px-4 py-1 text-sm rounded-full text-white font-medium
                      bg-gradient-to-r from-green-500 to-emerald-600
                      hover:scale-[1.05] active:scale-[0.95]
                      transition-all shadow-sm
                    "
                  >
                    ✔ Confirm
                  </button>

                  <button
                    onClick={() => handleReject(log.id)}
                    className="
                      px-4 py-1 text-sm rounded-full text-white font-medium
                      bg-gradient-to-r from-red-500 to-pink-600
                      hover:scale-[1.05] active:scale-[0.95]
                      transition-all shadow-sm
                    "
                  >
                    ✖ Reject
                  </button>

                </div>
              )}

              {log.status === "PENDING" && (
                <span className="text-xs text-gray-400 italic">
                  Waiting for provider...
                </span>
              )}

              {log.status === "CONFIRMED_PRESENT" && (
                <span className="text-green-600 text-sm font-medium">
                  ✔ Confirmed
                </span>
              )}

              {log.status === "REJECTED" && (
                <span className="text-red-600 text-sm font-medium">
                  ✖ Rejected
                </span>
              )}

            </div>

          </Card>

        ))}

      </div>

    </Container>
  );
}