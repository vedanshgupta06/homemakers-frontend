// import { useLocation, useNavigate } from "react-router-dom";
// import Container from "../../components/ui/Container";
// import Card from "../../components/ui/Card";
// import Button from "../../components/ui/Button";

// function BookingSuccess() {

//   const location = useLocation();
//   const navigate = useNavigate();

//   const data = location.state;

//   return (
//     <Container>

//       <div className="flex justify-center items-center min-h-[60vh]">

//         <Card className="text-center space-y-4 max-w-md w-full">

//           {/* ICON */}
//           <div className="text-5xl">✅</div>

//           {/* TITLE */}
//           <h2 className="text-2xl font-semibold text-primary">
//             Booking Confirmed!
//           </h2>

//           {/* MESSAGE */}
//           <p className="text-gray-500">
//             Your service has been successfully booked.
//           </p>

//           {/* DETAILS */}
//           {data && (
//             <div className="text-sm text-gray-600 space-y-1">
//               <p><b>Provider:</b> {data.providerName}</p>
//               <p><b>Slot:</b> {data.slot}</p>
//             </div>
//           )}

//           {/* ACTIONS */}
//           <div className="flex gap-3 justify-center pt-4">

//             <Button onClick={() => navigate("/user/my-bookings")}>
//               View Bookings
//             </Button>

//             <Button
//               variant="secondary"
//               onClick={() => navigate("/")}
//             >
//               Go Home
//             </Button>

//           </div>

//         </Card>

//       </div>

//     </Container>
//   );
// }

// export default BookingSuccess;

import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { CheckCircle2, User, Clock, CalendarCheck, Wallet, ArrowRight,ArrowLeft } from "lucide-react";

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const steps = [
    {
      icon: CheckCircle2,
      iconBg: "bg-blue-600",
      title: "Request Generated",
      desc: "Your service request has been successfully submitted.",
      done: true,
    },
    {
      icon: User,
      iconBg: "bg-slate-300",
      title: "Provider Accepts",
      desc: "The provider will review and accept your booking request.",
      done: false,
    },
    {
      icon: Wallet,
      iconBg: "bg-slate-300",
      title: "Payment Completed",
      desc: "Complete the payment once the provider accepts.",
      done: false,
    },
    {
      icon: CalendarCheck,
      iconBg: "bg-slate-300",
      title: "Service Confirmed",
      desc: "Your service will be confirmed and scheduled.",
      done: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-16 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
       <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none hidden md:block" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Request Submitted</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Request <span className="text-blue-400">Generated!</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl">
            Your service request is in — here's what happens next.
          </p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-[5%] pb-16">
        <div className="max-w-xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          {/* SUCCESS BADGE */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-xl shadow-blue-200">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Booking Request Sent</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs">
              Your service request has been generated. The service will be confirmed once the provider accepts and payment is completed.
            </p>
          </div>

          {/* BOOKING DETAILS */}
          {data && (
            <>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Provider</p>
                  <p className="text-sm font-bold text-slate-800">{data.providerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Clock size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Time Slot</p>
                  <p className="text-sm font-bold text-slate-800">{data.slot}</p>
                </div>
              </div>
            </>
          )}

          {/* DIVIDER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">What's Next</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* STEPS */}
          <div className="space-y-3 mb-8">
            {steps.map(({ icon: Icon, iconBg, title, desc, done }, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all
                ${done ? "border-blue-100 bg-blue-50/30" : "border-slate-100 bg-slate-50/50"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}>
                  <Icon size={15} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-black ${done ? "text-blue-700" : "text-slate-500"}`}>{title}</p>
                    {done && (
                      <span className="text-[10px] font-black text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Done</span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${done ? "text-blue-400" : "text-slate-400"}`}>{desc}</p>
                </div>
                <span className={`text-xs font-black mt-1 flex-shrink-0 ${done ? "text-blue-400" : "text-slate-300"}`}>
                  {i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/user/bookings")}
              className="flex-1 py-3.5 rounded-2xl font-black text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              View Bookings
              <ArrowRight size={14} strokeWidth={3} />
            </button>
            <button
              onClick={() => navigate("/user", { replace: true })}
              className="flex-1 py-3.5 rounded-2xl font-black text-sm tracking-wide bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            >
              Go Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;