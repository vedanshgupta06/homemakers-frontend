// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import Container from "../../components/ui/Container";
// import Card from "../../components/ui/Card";

// function PaymentHistory() {

//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/api/payments/history")
//       .then(res => setHistory(res.data))
//       .catch(err => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "SUCCESS":
//         return "bg-green-100 text-green-700";
//       case "FAILED":
//         return "bg-red-100 text-red-600";
//       case "PENDING":
//         return "bg-yellow-100 text-yellow-700";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   const totalSpent = history
//     .filter(txn => txn.status === "SUCCESS")
//     .reduce((sum, txn) => sum + txn.amount, 0);

//   const successCount = history.filter(txn => txn.status === "SUCCESS").length;

//   return (
//     <Container>

//       {/* 🔥 HEADER + STATS */}
//       <div className="mb-8 space-y-6">

//         {/* HEADER */}
//         <div>
//          <h2 className="
//           text-3xl font-bold
//           bg-brand-gradient bg-clip-text text-transparent
//         ">
//             Payment History 
//           </h2>

//           <p className="text-gray-500 mt-1">
//             Track all your transactions
//           </p>
//         </div>

//         {/* 🔥 STATS */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

//           <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10">
//             <p className="text-sm text-gray-500">Total Spent</p>
//             <p className="text-xl font-semibold">₹ {totalSpent}</p>
//           </div>

//           <div className="p-4 rounded-xl bg-green-100/60">
//             <p className="text-sm text-green-700">Successful</p>
//             <p className="text-xl font-semibold text-green-800">
//               {successCount}
//             </p>
//           </div>

//           <div className="p-4 rounded-xl bg-gray-100/60">
//             <p className="text-sm text-gray-600">Total Transactions</p>
//             <p className="text-xl font-semibold text-gray-800">
//               {history.length}
//             </p>
//           </div>

//         </div>

//       </div>

//       {/* LOADING */}
//       {loading && (
//         <p className="text-gray-500">Loading transactions...</p>
//       )}

//       {/* EMPTY */}
//       {!loading && history.length === 0 && (
//         <div className="text-center py-20">

//           <p className="text-lg font-medium">
//             No transactions yet 💸
//           </p>

//           <p className="text-gray-400 mt-2">
//             Your payments will appear here
//           </p>

//         </div>
//       )}

//       {/* LIST */}
//       <div className="space-y-5">

//         {history
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .map(txn => (

//           <Card
//             key={txn.id}
//             className="flex justify-between items-center"
//           >

//             {/* LEFT */}
//             <div className="flex items-center gap-4">

//               {/* ICON STYLE CIRCLE */}
//               <div className="
//                 w-10 h-10 rounded-full flex items-center justify-center
//                 bg-gradient-to-r from-pink-500 to-indigo-500 text-white
//                 font-bold
//               ">
//                 ₹
//               </div>

//               <div>
//                 <p className="font-semibold text-gray-800">
//                   ₹{txn.amount}
//                 </p>

//                 <p className="text-sm text-gray-500">
//                   {txn.description || "Service Payment"}
//                 </p>
//               </div>

//             </div>

//             {/* RIGHT */}
//             <div className="text-right">

//               <span className={`
//                 px-3 py-1 rounded-full text-xs font-medium
//                 ${getStatusStyle(txn.status)}
//               `}>
//                 {txn.status}
//               </span>

//               <p className="text-xs text-gray-400 mt-1">
//                 {new Date(txn.createdAt).toLocaleString()}
//               </p>

//               <p className="text-xs text-gray-400">
//                 {txn.method}
//               </p>

//             </div>

//           </Card>

//         ))}

//       </div>

//     </Container>
//   );
// }

// export default PaymentHistory;

// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { useNavigate } from "react-router-dom";
// import { IndianRupee, CheckCircle2, XCircle, Clock, Receipt, SearchX, TrendingUp, ArrowLeft } from "lucide-react";

// function PaymentHistory() {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/api/payments/history")
//       .then(res => setHistory(res.data))
//       .catch(err => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   const totalSpent = history
//     .filter(t => t.status === "SUCCESS")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const successCount = history.filter(t => t.status === "SUCCESS").length;
//   const failedCount = history.filter(t => t.status === "FAILED").length;

//   const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   const statusConfig = {
//     SUCCESS: {
//       icon: CheckCircle2,
//       iconBg: "bg-emerald-500",
//       badge: "bg-emerald-100 text-emerald-700",
//       border: "border-emerald-100 bg-emerald-50/20",
//       label: "Success",
//     },
//     FAILED: {
//       icon: XCircle,
//       iconBg: "bg-red-400",
//       badge: "bg-red-100 text-red-600",
//       border: "border-red-100 bg-red-50/20",
//       label: "Failed",
//     },
//     PENDING: {
//       icon: Clock,
//       iconBg: "bg-yellow-500",
//       badge: "bg-yellow-100 text-yellow-700",
//       border: "border-yellow-100 bg-yellow-50/20",
//       label: "Pending",
//     },
//   };
//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">

//       {/* HERO */}
//       <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
//         <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

//         <div className="max-w-7xl mx-auto relative">
//           <button
//           onClick={() => navigate(-1)}
//           className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
//         >
//           <ArrowLeft 
//             size={18} 
//             strokeWidth={2.5} 
//             className="text-slate-900 transition-transform group-hover:-translate-x-0.5" 
//           />
//         </button>
//           <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
//             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
//             <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Transactions</span>
//           </div>

//           <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
//             Payment <span className="text-blue-400">History</span>
//           </h2>
//           <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl">
//             Track all your transactions in one place.
//           </p>

//           {/* STAT PILLS */}
//           {!loading && (
//             <div className="mt-5 flex flex-wrap gap-3">
//               <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
//                 <TrendingUp size={12} className="text-slate-300" />
//                 <span className="text-white text-xs font-bold">₹{totalSpent} Spent</span>
//               </div>
//               <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
//                 <Receipt size={12} className="text-slate-300" />
//                 <span className="text-white text-xs font-bold">{history.length} Transactions</span>
//               </div>
//               {successCount > 0 && (
//                 <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
//                   <CheckCircle2 size={12} className="text-emerald-300" />
//                   <span className="text-emerald-200 text-xs font-bold">{successCount} Successful</span>
//                 </div>
//               )}
//               {failedCount > 0 && (
//                 <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5">
//                   <XCircle size={12} className="text-red-300" />
//                   <span className="text-red-200 text-xs font-bold">{failedCount} Failed</span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN CARD */}
//       <div className="px-[5%] pb-16">
//         <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

//           {/* SECTION HEADER */}
//           <div className="flex items-center gap-3 mb-1">
//             <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
//               <Receipt size={14} className="text-white" />
//             </div>
//             <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">All Transactions</h3>
//           </div>
//           <p className="text-slate-400 text-xs ml-11 mb-8">Most recent transactions first</p>

//           {/* LOADING */}
//           {loading && (
//             <div className="space-y-4">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
//               ))}
//             </div>
//           )}

//           {/* EMPTY */}
//           {!loading && history.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20 text-center">
//               <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
//                 <SearchX size={28} className="text-slate-400" />
//               </div>
//               <p className="text-base font-black text-slate-800 uppercase tracking-tight">No Transactions Yet</p>
//               <p className="text-sm text-slate-400 mt-2">Your payment history will appear here.</p>
//             </div>
//           )}

//           {/* LIST */}
//           {!loading && sorted.length > 0 && (
//             <div className="space-y-3">
//               {sorted.map((txn) => {
//                 const config = statusConfig[txn.status] || statusConfig.PENDING;
//                 const Icon = config.icon;

//                 return (
//                   <div
//                     key={txn.id}
//                     className={`flex items-center justify-between gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${config.border}`}
//                   >
//                     {/* LEFT */}
//                     <div className="flex items-center gap-4 min-w-0">
//                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
//                         <Icon size={16} className="text-white" />
//                       </div>
//                       <div className="min-w-0">
//                         <p className="text-sm font-black text-slate-900">₹{txn.amount}</p>
//                         <p className="text-xs text-slate-400 font-medium truncate">
//                           {txn.description || "Service Payment"}
//                         </p>
//                       </div>
//                     </div>

//                     {/* RIGHT */}
//                     <div className="flex flex-col items-end gap-1 flex-shrink-0">
//                       <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
//                         {config.label}
//                       </span>
//                       <p className="text-[10px] text-slate-400 font-medium">
//                         {new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//                       </p>
//                       {txn.method && (
//                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{txn.method}</p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// export default PaymentHistory;


import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  Receipt,
  SearchX,
  TrendingUp,
  ArrowLeft,
  RotateCcw,
  Wallet,
  CreditCard,
  AlertCircle,
  ArrowDownLeft,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── entry configs ───────────────────────────────────────────────────────────

const ENTRY_CONFIG = {
  // Stripe payment statuses
  SUCCESS: {
    label: "Paid",
    icon: CheckCircle2,
    iconBg: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-100",
    bg: "bg-emerald-50/40",
    amountColor: "text-slate-800",
    amountPrefix: "−₹",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    iconBg: "bg-red-400",
    badge: "bg-red-100 text-red-600",
    border: "border-red-100",
    bg: "bg-red-50/30",
    amountColor: "text-red-500",
    amountPrefix: "₹",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    iconBg: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
    border: "border-amber-100",
    bg: "bg-amber-50/30",
    amountColor: "text-slate-800",
    amountPrefix: "₹",
  },
  // Wallet transaction types
  REFUND: {
    label: "Refunded",
    icon: ArrowDownLeft,
    iconBg: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
    bg: "bg-blue-50/40",
    amountColor: "text-blue-600",
    amountPrefix: "+₹",
  },
  RESERVE: {
    label: "Reserved",
    icon: Clock,
    iconBg: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600",
    border: "border-slate-100",
    bg: "bg-slate-50/40",
    amountColor: "text-slate-500",
    amountPrefix: "₹",
  },
  RELEASE: {
    label: "Released",
    icon: RotateCcw,
    iconBg: "bg-violet-400",
    badge: "bg-violet-100 text-violet-700",
    border: "border-violet-100",
    bg: "bg-violet-50/30",
    amountColor: "text-violet-600",
    amountPrefix: "+₹",
  },
  DEBIT: {
    label: "Wallet Debit",
    icon: Wallet,
    iconBg: "bg-orange-400",
    badge: "bg-orange-100 text-orange-700",
    border: "border-orange-100",
    bg: "bg-orange-50/30",
    amountColor: "text-orange-600",
    amountPrefix: "−₹",
  },
};

// ─── single transaction row ──────────────────────────────────────────────────

function TxnRow({ entry }) {
  const [expanded, setExpanded] = useState(false);

  const key = entry.source === "wallet" ? entry.type : entry.status;
  const cfg = ENTRY_CONFIG[key] || ENTRY_CONFIG.PENDING;
  const Icon = cfg.icon;

  const SourcePill =
    entry.source === "wallet" ? (
      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
        <Wallet size={9} /> Wallet
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
        <CreditCard size={9} /> {entry.method || "Stripe"}
      </span>
    );

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${cfg.border} ${cfg.bg}`}
    >
      {/* Main row */}
      <button
        onClick={() => entry.description && setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${cfg.iconBg}`}
          >
            <Icon size={16} className="text-white" />
          </div>

          <div className="min-w-0">
            {/* title */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.badge}`}
              >
                {cfg.label}
              </span>
              {SourcePill}
            </div>

            {/* description preview */}
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-[220px] md:max-w-sm">
              {entry.description || "Service Payment"}
            </p>

            {/* booking tag */}
            {entry.bookingId && (
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                Booking #{entry.bookingId}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <p className={`text-base font-black ${cfg.amountColor}`}>
            {cfg.amountPrefix}
            {Math.abs(entry.amount).toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            {fmtDate(entry.createdAt)}
          </p>
          <p className="text-[10px] text-slate-300">{fmtTime(entry.createdAt)}</p>
          {entry.description && (
            <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
              {expanded ? "▲ less" : "▼ more"}
            </span>
          )}
        </div>
      </button>

      {/* Expanded reason panel */}
      {expanded && entry.description && (
        <div className="mx-4 mb-4 px-4 py-3 rounded-xl bg-white/70 border border-slate-100 flex items-start gap-2">
          <AlertCircle size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">{entry.description}</p>
        </div>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

function PaymentHistory() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/api/payments/history"),
      api.get("/api/user/wallet/transactions"),
    ])
      .then(([paymentsRes, walletRes]) => {
        // Normalize Stripe payment transactions
        const payments = (paymentsRes.data || []).map((t) => ({
          id: `pay-${t.id}`,
          source: "stripe",
          amount: t.amount,
          status: t.status,
          method: t.method,
          description: t.description || null,
          bookingId: t.bookingId || null,
          createdAt: t.createdAt,
        }));

        // Normalize wallet transactions — only show REFUND, RELEASE, DEBIT
        // Skip RESERVE (too noisy; user sees it as part of the booking flow)
        const wallet = (walletRes.data || [])
          .filter((t) => ["REFUND", "RELEASE", "DEBIT"].includes(t.type))
          .map((t) => ({
            id: `wal-${t.id}`,
            source: "wallet",
            amount: t.amount,
            type: t.type,
            description: t.description || null,
            bookingId: t.bookingId || null,
            createdAt: t.createdAt,
          }));

        // Merge and sort newest first
        const merged = [...payments, ...wallet].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setEntries(merged);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load transactions.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Stats ──
  const totalSpent = entries
    .filter((e) => e.source === "stripe" && e.status === "SUCCESS")
    .reduce((s, e) => s + e.amount, 0);

  const totalRefunded = entries
    .filter((e) => e.type === "REFUND")
    .reduce((s, e) => s + Math.abs(e.amount), 0);

  const refundCount = entries.filter((e) => e.type === "REFUND").length;
  const failedCount = entries.filter(
    (e) => e.source === "stripe" && e.status === "FAILED"
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft
              size={18}
              strokeWidth={2.5}
              className="text-slate-900 transition-transform group-hover:-translate-x-0.5"
            />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">
              Transactions
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Payment <span className="text-blue-400">History</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl">
            All payments, refunds and wallet activity in one place.
          </p>

          {/* STAT PILLS */}
          {!loading && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <TrendingUp size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">
                  ₹{totalSpent.toLocaleString("en-IN")} Spent
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <Receipt size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">
                  {entries.length} Entries
                </span>
              </div>

              {refundCount > 0 && (
                <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5">
                  <ArrowDownLeft size={12} className="text-blue-300" />
                  <span className="text-blue-200 text-xs font-bold">
                    ₹{totalRefunded.toLocaleString("en-IN")} Refunded
                  </span>
                </div>
              )}

              {failedCount > 0 && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5">
                  <XCircle size={12} className="text-red-300" />
                  <span className="text-red-200 text-xs font-bold">
                    {failedCount} Failed
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          {/* SECTION HEADER */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Receipt size={14} className="text-white" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">
              All Transactions
            </h3>
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-2">
            Most recent first · Tap any row to see full reason
          </p>

          {/* LEGEND */}
          <div className="ml-11 mb-8 flex flex-wrap gap-2">
            {[
              { key: "REFUND", label: "Refund" },
              { key: "SUCCESS", label: "Paid" },
              { key: "RELEASE", label: "Released" },
              { key: "DEBIT", label: "Wallet Debit" },
              { key: "FAILED", label: "Failed" },
            ].map(({ key, label }) => {
              const c = ENTRY_CONFIG[key];
              return (
                <span
                  key={key}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${c.badge}`}
                >
                  {label}
                </span>
              );
            })}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
              <XCircle size={18} className="text-red-400" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <SearchX size={28} className="text-slate-400" />
              </div>
              <p className="text-base font-black text-slate-800 uppercase tracking-tight">
                No Transactions Yet
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Your payment history will appear here.
              </p>
            </div>
          )}

          {/* LIST */}
          {!loading && !error && entries.length > 0 && (
            <div className="space-y-3">
              {entries.map((entry) => (
                <TxnRow key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;