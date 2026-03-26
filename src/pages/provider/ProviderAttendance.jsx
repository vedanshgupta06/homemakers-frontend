import { useEffect, useState } from "react";
import { getTodayAttendance, markPresent } from "../../api/attendanceApi";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function ProviderAttendance() {
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    try {
      const res = await getTodayAttendance();
      setLogs(res.data || []);
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
      loadLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const normalizeStatus = (s) => (s || "").toUpperCase().trim();

  return (
    <Container>
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">

        {/* 🔥 HEADER */}
        <div className="relative">
          <div className="
            absolute -top-16 -left-10 w-72 h-72 
            bg-pink-400/20 blur-3xl rounded-full
            pointer-events-none
          "></div>

          <div className="relative z-10">
            <h2 className="
              text-3xl font-bold 
              bg-brand-gradient bg-clip-text text-transparent
            ">
              Today's Attendance 🧾
            </h2>

            <p className="text-textSub mt-2">
              Mark your attendance for assigned bookings
            </p>
          </div>
        </div>

        {/* 📋 ATTENDANCE LIST */}
        {logs.length === 0 ? (
          <Card>
            <p className="text-gray-400 text-sm italic">
              No attendance records for today
            </p>
          </Card>
        ) : (
          logs.map((log) => {
            const status = normalizeStatus(log.status);

            return (
              <Card
                key={log.id}
                className="
                  p-6
                  bg-white/80 backdrop-blur-md
                  border border-gray-200
                  rounded-2xl
                  hover:shadow-xl hover:scale-[1.01]
                  transition-all duration-300
                "
              >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-gray-500">
                    Booking ID: {log.bookingId}
                  </p>

                  <StatusBadge status={status} />
                </div>

                {/* DETAILS */}
                <p className="font-medium">
                  Customer: {log.customerName}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Date: {log.workDate}
                </p>

                {/* ACTION */}
                {status === "PENDING" && (
                  <div className="mt-4">
                    <Button
                      onClick={() => handleMarkPresent(log.id)}
                    >
                      Mark Present
                    </Button>
                  </div>
                )}

              </Card>
            );
          })
        )}

      </div>
    </Container>
  );
}

/* 🎯 STATUS BADGE */
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    PRESENT: "bg-green-100 text-green-700 border border-green-200",
    ABSENT: "bg-red-100 text-red-600 border border-red-200",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-medium border
        ${styles[status] || "bg-gray-100 text-gray-600"}
      `}
    >
      {status}
    </span>
  );
};