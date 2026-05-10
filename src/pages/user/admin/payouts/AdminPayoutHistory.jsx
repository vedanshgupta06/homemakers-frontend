// import { useEffect, useState } from "react";
// import { getPayoutHistory } from "../../../../api/adminPayoutApi";

// import Container from "../../../../components/ui/Container";
// import Card from "../../../../components/ui/Card";
// import Button from "../../../../components/ui/Button";

// export default function AdminPayoutHistory() {
//   const [payouts, setPayouts] = useState([]);
//   const [filtered, setFiltered] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [selectedServices, setSelectedServices] = useState(null);

//   useEffect(() => {
//     loadHistory();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [search, statusFilter, payouts]);

//   const loadHistory = async () => {
//     try {
//       const res = await getPayoutHistory();
//       const data = Array.isArray(res.data) ? res.data : [];
//       setPayouts(data);
//       setFiltered(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let data = [...payouts];

//     if (search) {
//       data = data.filter((p) =>
//         p.providerEmail.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (statusFilter !== "ALL") {
//       data = data.filter((p) => p.status === statusFilter);
//     }

//     setFiltered(data);
//   };

//   const formatCurrency = (num = 0) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(num);

//   const statusStyle = (status) => {
//     const map = {
//       PAID: "bg-green-100 text-green-700",
//       PENDING: "bg-yellow-100 text-yellow-700",
//       FAILED: "bg-red-100 text-red-600",
//     };
//     return map[status] || "bg-gray-100 text-gray-600";
//   };

//   return (
//     <Container>
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* HEADER */}
//         <div>
//           <h2 className="text-2xl font-semibold">Payout History</h2>
//           <p className="text-gray-500 text-sm">
//             Track and filter payouts
//           </p>
//         </div>

//         {/* FILTERS */}
//         <Card className="p-4 flex flex-col md:flex-row gap-3 md:justify-between">

//           <input
//             type="text"
//             placeholder="Search provider email..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded-lg px-3 py-2 text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500"
//           />

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="border rounded-lg px-3 py-2 text-sm w-full md:w-48 focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="ALL">All Status</option>
//             <option value="PAID">Paid</option>
//             <option value="PENDING">Pending</option>
//             <option value="FAILED">Failed</option>
//           </select>

//         </Card>

//         {/* TABLE */}
//         <Card className="p-4 overflow-x-auto">

//           {loading ? (
//             <p>Loading...</p>
//           ) : filtered.length === 0 ? (
//             <p className="text-gray-400">No payouts found</p>
//           ) : (

//             <table className="min-w-full text-sm">

//               <thead className="text-gray-500 border-b">
//                 <tr>
//                   <th className="py-2 text-left">ID</th>
//                   <th className="py-2 text-left">Provider</th>
//                   <th className="py-2 text-left">Services</th>
//                   <th className="py-2 text-left">Booking</th>
//                   <th className="py-2 text-left">Amount</th>
//                   <th className="py-2 text-left">Date</th>
//                   <th className="py-2 text-left">Status</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y">

//                 {filtered.map((p) => (

//                   <tr key={p.id} className="hover:bg-gray-50">

//                     <td className="py-3">{p.id}</td>

//                     <td className="py-3 font-medium">
//                       {p.providerEmail}
//                     </td>

//                     {/* 🔥 VIEW SERVICES BUTTON */}
//                     <td className="py-3">
//                       <Button
//                         size="sm"
//                         onClick={() =>
//                           setSelectedServices(p.services || [])
//                         }
//                       >
//                         View Services
//                       </Button>
//                     </td>

//                     {/* ✅ BOOKING ID FIXED */}
//                     <td className="py-3">
//                       #{p.bookingId}
//                     </td>

//                     <td className="py-3 font-medium">
//                       {formatCurrency(p.amount)}
//                     </td>

//                     <td className="py-3 text-gray-500">
//                       {new Date(p.createdAt).toLocaleDateString()}
//                     </td>

//                     <td className="py-3">
//                       <span
//                         className={`
//                           px-3 py-1 rounded-full text-xs font-medium
//                           ${statusStyle(p.status)}
//                         `}
//                       >
//                         {p.status}
//                       </span>
//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           )}

//         </Card>

//         {/* 🔥 MODAL */}
//         {selectedServices && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//             <div className="bg-white rounded-xl p-6 w-96 shadow-xl">

//               <h3 className="text-lg font-semibold mb-4">
//                 Services
//               </h3>

//               {selectedServices.length === 0 ? (
//                 <p className="text-gray-400 text-sm">
//                   No services found
//                 </p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {selectedServices.map((s, i) => (
//                     <span
//                       key={i}
//                       className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
//                     >
//                       {s.replace("_", " ")}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               <div className="mt-5 text-right">
//                 <Button onClick={() => setSelectedServices(null)}>
//                   Close
//                 </Button>
//               </div>

//             </div>

//           </div>
//         )}

//       </div>
//     </Container>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPayoutHistory } from "../../../../api/adminPayoutApi";
import {
  Search, IndianRupee, CheckCircle2, Clock,
  XCircle, SearchX, ArrowLeft, User, Briefcase,
  Filter, X, TrendingUp
} from "lucide-react";

const statusConfig = {
  PAID:      { label: "Paid",     badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-100 bg-emerald-50/20", iconBg: "bg-emerald-500", icon: CheckCircle2 },
  PENDING:   { label: "Pending",  badge: "bg-yellow-100 text-yellow-700",   border: "border-yellow-200 bg-yellow-50/20",   iconBg: "bg-yellow-500",  icon: Clock        },
  INITIATED: { label: "Initiated",  badge: "bg-yellow-100 text-yellow-700",   border: "border-yellow-200 bg-yellow-50/20",   iconBg: "bg-yellow-500",  icon: Clock        },
  FAILED:    { label: "Failed",   badge: "bg-red-100 text-red-600",         border: "border-red-100 bg-red-50/20",         iconBg: "bg-red-400",     icon: XCircle      },
};

const STATUS_FILTERS = ["ALL", "PAID", "PENDING", "FAILED"];

export default function AdminPayoutHistory() {
  const [payouts, setPayouts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedServices, setSelectedServices] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { loadHistory(); }, []);
  useEffect(() => { applyFilters(); }, [search, statusFilter, payouts]);

  const loadHistory = async () => {
    try {
      const res = await getPayoutHistory();
      const data = Array.isArray(res.data) ? res.data : [];
      setPayouts(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...payouts];
    if (search) {
      const kw = search.toLowerCase();
      data = data.filter(p =>
        (p.providerEmail || "").toLowerCase().includes(kw) ||
        (p.providerName || "").toLowerCase().includes(kw)
      );
    }
    if (statusFilter !== "ALL") {
      data = data.filter(p => p.status === statusFilter);
    }
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFiltered(data);
  };

  const formatCurrency = (num = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(num);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const formatService = (s) =>
    s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  const totalPaid = payouts
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const counts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f] = f === "ALL" ? payouts.length : payouts.filter(p => p.status === f).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-16 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-wider mb-6"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Back
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Admin</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Payout <span className="text-blue-400">History</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">Track and filter all provider payouts.</p>

          {!loading && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <TrendingUp size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">{payouts.length} total payouts</span>
              </div>
              {totalPaid > 0 && (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
                  <CheckCircle2 size={12} className="text-emerald-300" />
                  <span className="text-emerald-200 text-xs font-bold">{formatCurrency(totalPaid)} paid out</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 space-y-5">

          {/* STATS */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total",   value: payouts.length,                                          iconBg: "bg-blue-600",    icon: IndianRupee  },
                { label: "Paid",    value: counts.PAID || 0,                                        iconBg: "bg-emerald-500", icon: CheckCircle2 },
                { label: "Pending", value: (counts.PENDING || 0) + (counts.INITIATED || 0),         iconBg: "bg-yellow-500",  icon: Clock        },
                { label: "Failed",  value: counts.FAILED || 0,                                      iconBg: "bg-red-400",     icon: XCircle      },
              ].map(({ label, value, iconBg, icon: Icon }) => (
                <div key={label} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-black text-slate-900 leading-none mt-1">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SEARCH + FILTER */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Search size={15} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search provider name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-sm font-medium text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={14} className="text-slate-400 flex-shrink-0" />
                {STATUS_FILTERS.map(f => (
                  <button key={f} onClick={() => setStatusFilter(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-1
                      ${statusFilter === f
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
                      }`}>
                    {f}
                    {counts[f] > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black
                        ${statusFilter === f ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                        {counts[f]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <IndianRupee size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Payout Records</h3>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">{filtered.length}</span>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-8">Complete history of all provider payouts</p>

            {loading && (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <SearchX size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-black text-slate-700">No payouts found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter.</p>
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="space-y-3">
                {filtered.map(p => {
                  const key = (p.status || "").toUpperCase();
                  const config = statusConfig[key] || statusConfig.PENDING;
                  const Icon = config.icon;

                  return (
                    <div key={p.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all ${config.border}`}>

                      {/* LEFT */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-black text-slate-900">
                              {p.providerName || p.providerEmail?.split("@")[0] || "Provider"}
                            </p>
                            <span className="text-[10px] font-bold text-slate-400">#{p.id}</span>
                            {p.bookingId && (
                              <span className="text-[10px] font-bold text-slate-400">Booking #{p.bookingId}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            {p.providerEmail && (
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                <User size={10} /> {p.providerEmail}
                              </span>
                            )}
                            <span className="text-xs text-slate-400 font-medium">{formatDate(p.createdAt)}</span>
                            {p.paidAt && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-xs text-emerald-600 font-bold">Paid: {formatDate(p.paidAt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-lg font-black text-slate-900">{formatCurrency(p.amount)}</p>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
                          {config.label}
                        </span>

                        {p.services?.length > 0 && (
                          <button
                            onClick={() => setSelectedServices(p.services)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-blue-200 text-xs font-black text-slate-600 transition-all"
                          >
                            <Briefcase size={11} /> Services
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* SERVICES MODAL */}
      {selectedServices && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedServices(null)}
        >
          <div
            className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Briefcase size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Services</h3>
              </div>
              <button
                onClick={() => setSelectedServices(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            {selectedServices.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No services found</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-xs font-black text-blue-700 uppercase tracking-wider">
                    {formatService(s)}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => setSelectedServices(null)}
              className="mt-6 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}