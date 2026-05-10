// import { useEffect, useState } from "react";
// import {
//   getPayoutRequests,
//   markPayoutPaid
// } from "../../../../api/adminPayoutApi";

// import Container from "../../../../components/ui/Container";
// import Card from "../../../../components/ui/Card";
// import Button from "../../../../components/ui/Button";

// export default function AdminPayouts() {

//   const [payouts, setPayouts] = useState([]);
//   const [filtered, setFiltered] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     loadPayouts();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [search, payouts]);

//   const loadPayouts = async () => {
//     try {
//       const res = await getPayoutRequests();
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
//       const keyword = search.toLowerCase();

//       data = data.filter((p) => {
//         const name = (p.providerName || "").toLowerCase();
//         const email = (p.providerEmail || "").toLowerCase();

//         return name.includes(keyword) || email.includes(keyword);
//       });
//     }

//     setFiltered(data);
//   };

//   const approvePayout = async (id) => {
//     const confirm = window.confirm("Approve and mark payout as PAID?");
//     if (!confirm) return;

//     try {
//       await markPayoutPaid(id);
//       loadPayouts();
//     } catch (err) {
//       alert("Failed to mark payout");
//     }
//   };

//   const formatCurrency = (num = 0) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(num);

//   const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

//   return (
//     <Container>
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* HEADER */}
//         <div>
//           <h2 className="text-2xl font-semibold">
//             Payout Requests
//           </h2>
//           <p className="text-gray-500 text-sm">
//             Manage provider payout approvals
//           </p>
//         </div>

//         {/* SUMMARY */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           <Card className="p-5">
//             <p className="text-gray-500 text-sm">Total Requested</p>
//             <h2 className="text-xl font-semibold mt-1">
//               {formatCurrency(totalAmount)}
//             </h2>
//           </Card>

//           <Card className="p-5">
//             <p className="text-gray-500 text-sm">Pending Requests</p>
//             <h2 className="text-xl font-semibold mt-1">
//               {payouts.filter(p => p.status === "REQUESTED").length}
//             </h2>
//           </Card>

//         </div>

//         {/* SEARCH */}
//         <Card className="p-4">
//           <input
//             type="text"
//             placeholder="Search provider name or email..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full md:w-72 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//           />
//         </Card>

//         {/* TABLE */}
//         <Card className="p-4 overflow-x-auto">

//           {loading ? (
//             <p>Loading payouts...</p>
//           ) : filtered.length === 0 ? (
//             <p className="text-gray-400">No payouts found</p>
//           ) : (

//             <table className="min-w-full text-sm">

//               <thead className="text-gray-500 border-b">
//                 <tr>
//                   <th className="py-2 text-left">ID</th>
//                   <th className="py-2 text-left">Provider</th>
//                   <th className="py-2 text-left">Service</th>
//                   <th className="py-2 text-left">Booking</th>
//                   <th className="py-2 text-left">Amount</th>
//                   <th className="py-2 text-left">Date</th>
//                   <th className="py-2 text-left">Status</th>
//                   <th className="py-2 text-left">Action</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y">

//                 {filtered.map((p) => (

//                   <tr key={p.id} className="hover:bg-gray-50">

//                     <td className="py-3">{p.id}</td>

//                     <td className="py-3">
//                       <div className="font-medium">
//                         {p.providerName || "—"}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {p.providerEmail}
//                       </div>
//                     </td>

//                     <td className="py-3">
//                       {p.serviceName || "-"}
//                     </td>

//                     <td className="py-3">
//                       {p.bookingId ? `#${p.bookingId}` : "-"}
//                     </td>

//                     <td className="py-3 font-medium">
//                       {formatCurrency(p.amount)}
//                     </td>

//                     <td className="py-3 text-gray-500">
//                       {new Date(p.createdAt).toLocaleDateString()}
//                     </td>

//                     <td className="py-3">
//                       <StatusBadge status={p.status} />
//                     </td>

//                     <td className="py-3">
//                       {p.status === "INITIATED" && (
//                         <Button
//                           size="sm"
//                           onClick={() => approvePayout(p.id)}
//                         >
//                           Approve
//                         </Button>
//                       )}
//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           )}

//         </Card>

//       </div>
//     </Container>
//   );
// }

// /* STATUS BADGE */
// const StatusBadge = ({ status }) => {
//   const styles = {
//     REQUESTED: "bg-yellow-100 text-yellow-700",
//     PAID: "bg-green-100 text-green-700",
//     REJECTED: "bg-red-100 text-red-600",
//   };

//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
//       {status}
//     </span>
//   );
// };

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPayoutRequests, markPayoutPaid } from "../../../../api/adminPayoutApi";
import {
  Search, IndianRupee, CheckCircle2, Clock,
  XCircle, SearchX, ArrowLeft, User, Briefcase, Check
} from "lucide-react";

const statusConfig = {
  INITIATED: { label: "Pending",  badge: "bg-yellow-100 text-yellow-700",  border: "border-yellow-200 bg-yellow-50/20",   iconBg: "bg-yellow-500",  icon: Clock        },
  REQUESTED: { label: "Pending",  badge: "bg-yellow-100 text-yellow-700",  border: "border-yellow-200 bg-yellow-50/20",   iconBg: "bg-yellow-500",  icon: Clock        },
  PAID:      { label: "Paid",     badge: "bg-emerald-100 text-emerald-700",border: "border-emerald-100 bg-emerald-50/20", iconBg: "bg-emerald-500", icon: CheckCircle2 },
  REJECTED:  { label: "Rejected", badge: "bg-red-100 text-red-600",        border: "border-red-100 bg-red-50/20",         iconBg: "bg-red-400",     icon: XCircle      },
};

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { loadPayouts(); }, []);

  useEffect(() => { applyFilters(); }, [search, payouts]);

  const loadPayouts = async () => {
    try {
      const res = await getPayoutRequests();
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
        (p.providerName || "").toLowerCase().includes(kw) ||
        (p.providerEmail || "").toLowerCase().includes(kw)
      );
    }
    setFiltered(data);
  };

  const approvePayout = async (id) => {
    setApprovingId(id);
    try {
      await markPayoutPaid(id);
      loadPayouts();
    } catch (err) {
      console.error("Failed to mark payout", err);
    } finally {
      setApprovingId(null);
      setConfirmId(null);
    }
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

  const totalAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingCount = payouts.filter(p => p.status === "INITIATED" || p.status === "REQUESTED").length;

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
            Payout <span className="text-blue-400">Requests</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">Manage and approve provider payout requests.</p>

          {!loading && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <IndianRupee size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">{formatCurrency(totalAmount)} total requested</span>
              </div>
              {pendingCount > 0 && (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
                  <Clock size={12} className="text-yellow-300" />
                  <span className="text-yellow-200 text-xs font-bold">{pendingCount} pending approval</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <IndianRupee size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Requested</p>
                  <p className="text-2xl font-black text-slate-900 leading-none mt-1">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending Requests</p>
                  <p className="text-2xl font-black text-slate-900 leading-none mt-1">{pendingCount}</p>
                </div>
              </div>
            </div>
          )}

          {/* SEARCH */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Search size={15} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search provider name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm font-medium text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* LIST */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <IndianRupee size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">All Requests</h3>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{filtered.length}</span>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-8">Review and approve pending provider payouts</p>

            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <SearchX size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-black text-slate-700">No payouts found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search.</p>
              </div>
            )}

            {/* Payout rows */}
            {!loading && filtered.length > 0 && (
              <div className="space-y-3">
                {filtered.map(p => {
                  const key = (p.status || "").toUpperCase();
                  const config = statusConfig[key] || statusConfig.REQUESTED;
                  const Icon = config.icon;
                  const isApproving = approvingId === p.id;
                  const isConfirming = confirmId === p.id;
                  const isPending = key === "INITIATED" || key === "REQUESTED";

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
                            <p className="text-sm font-black text-slate-900">{p.providerName || "Provider"}</p>
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
                            {p.serviceName && (
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                <Briefcase size={10} /> {p.serviceName}
                              </span>
                            )}
                            <span className="text-xs text-slate-400 font-medium">{formatDate(p.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-lg font-black text-slate-900">{formatCurrency(p.amount)}</p>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
                          {config.label}
                        </span>

                        {isPending && !isConfirming && (
                          <button
                            onClick={() => setConfirmId(p.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-emerald-200"
                          >
                            <Check size={11} strokeWidth={4} /> Approve
                          </button>
                        )}

                        {isPending && isConfirming && (
                          <div className="flex flex-col gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <p className="text-xs font-black text-emerald-700">Mark as paid?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => approvePayout(p.id)}
                                disabled={isApproving}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-black"
                              >
                                {isApproving ? "..." : "Yes, Approve"}
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-black"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
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
    </div>
  );
}