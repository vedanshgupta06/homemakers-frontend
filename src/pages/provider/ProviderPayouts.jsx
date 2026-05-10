
import { useEffect, useState } from "react";
import {
  getMyPayouts, requestPayout, getWalletSummary,
} from "../../api/providerPayoutApi";
import { getMyEarnings } from "../../api/providerEarningsApi"; // ✅ ADD THIS API CALL
import {
  Wallet, ArrowUpRight, CheckCircle2, Clock,
  XCircle, IndianRupee, TrendingUp, SearchX,
  AlertCircle, CalendarDays, ArrowLeft,
  TrendingDown, Gift, Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProviderPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [earnings, setEarnings] = useState([]); // ✅ NEW
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [payoutRes, walletRes, earningsRes] = await Promise.all([
        getMyPayouts(),
        getWalletSummary(),
        getMyEarnings() // ✅ NEW
      ]);
      setPayouts(payoutRes.data || []);
      setWallet(walletRes.data || {});
      setEarnings(earningsRes.data || []); // ✅ NEW
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    setWithdrawing(true);
    setErrorMsg("");
    try {
      await requestPayout();
      setSuccessMsg("Withdrawal requested successfully!");
      setShowConfirm(false);
      loadData();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to request withdrawal");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setWithdrawing(false);
    }
  };

  const format = (v) => `₹${Number(v || 0).toFixed(0)}`;

  const available = wallet?.available || 0;
  const requested = wallet?.requested || 0;
  const paid = wallet?.paid || 0;
  const canWithdraw = wallet?.canWithdraw ?? false;
  const nextEligible = wallet?.nextEligibleWithdrawalDate;

  const statusConfig = {
    INITIATED: { label: "Processing", badge: "bg-yellow-100 text-yellow-700",   border: "border-yellow-100 bg-yellow-50/20",   iconBg: "bg-yellow-500",  icon: Clock        },
    PAID:      { label: "Paid",       badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-100 bg-emerald-50/20", iconBg: "bg-emerald-500", icon: CheckCircle2 },
    REJECTED:  { label: "Rejected",   badge: "bg-red-100 text-red-600",         border: "border-red-100 bg-red-50/20",         iconBg: "bg-red-400",     icon: XCircle      },
  };

  // ✅ Earning type config
  const earningConfig = {
    AVAILABLE: { label: "Available", badge: "bg-blue-100 text-blue-700",        iconBg: "bg-blue-500",    icon: Briefcase  },
    PAID:      { label: "Paid",      badge: "bg-emerald-100 text-emerald-700",  iconBg: "bg-emerald-500", icon: CheckCircle2 },
    PENALTY:   { label: "Penalty",   badge: "bg-red-100 text-red-600",          iconBg: "bg-red-500",     icon: TrendingDown },
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const navigate = useNavigate();

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
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Payouts</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Withdraw <span className="text-blue-400">Earnings</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">Track your income and manage withdrawals.</p>

          {!loading && (
            <div className="mt-5 flex flex-wrap gap-3">
              {available > 0 && (
                <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-1.5">
                  <Wallet size={12} className="text-blue-300" />
                  <span className="text-blue-200 text-xs font-bold">{format(available)} available</span>
                </div>
              )}
              {paid > 0 && (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
                  <CheckCircle2 size={12} className="text-emerald-300" />
                  <span className="text-emerald-200 text-xs font-bold">{format(paid)} paid out</span>
                </div>
              )}
              {requested > 0 && (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
                  <Clock size={12} className="text-yellow-300" />
                  <span className="text-yellow-200 text-xs font-bold">{format(requested)} processing</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 space-y-5">

          {/* FEEDBACK */}
          {(successMsg || errorMsg) && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl border
              ${successMsg ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
              {successMsg
                ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
              <p className={`text-sm font-bold ${successMsg ? "text-emerald-700" : "text-red-600"}`}>
                {successMsg || errorMsg}
              </p>
            </div>
          )}

          {/* STATS ROW */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Available",  value: available, iconBg: "bg-blue-600",    icon: Wallet     },
                { label: "Total Paid", value: paid,      iconBg: "bg-emerald-500", icon: TrendingUp },
                { label: "Processing", value: requested, iconBg: "bg-yellow-500",  icon: Clock      },
              ].map(({ label, value, iconBg, icon: Icon }) => (
                <div key={label} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-black text-slate-900 leading-none mt-1">{format(value)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WITHDRAW CARD */}
          {!loading && (
            <div className={`rounded-[2rem] p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5
              ${canWithdraw && available > 0 ? "bg-blue-600 shadow-blue-200" : "bg-[#1E293B]"}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <Wallet size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Available Balance</p>
                  <p className="text-3xl font-black text-white leading-none mt-1">{format(available)}</p>
                  {!canWithdraw && nextEligible && (
                    <p className="text-slate-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <CalendarDays size={10} /> Next eligible: {formatDate(nextEligible)}
                    </p>
                  )}
                  {!canWithdraw && !nextEligible && (
                    <p className="text-slate-400 text-xs mt-1.5 font-medium">Withdrawal locked</p>
                  )}
                </div>
              </div>

              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={!canWithdraw || available <= 0}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-lg flex-shrink-0
                    ${!canWithdraw || available <= 0
                      ? "bg-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50"}`}
                >
                  <ArrowUpRight size={14} strokeWidth={3} />
                  {available <= 0 ? "No Balance" : !canWithdraw ? "Locked" : "Request Withdrawal"}
                </button>
              ) : (
                <div className="flex flex-col gap-2 bg-white/10 border border-white/20 rounded-2xl p-4 flex-shrink-0">
                  <p className="text-white text-xs font-black">Withdraw {format(available)}?</p>
                  <div className="flex gap-2">
                    <button onClick={handleRequest} disabled={withdrawing}
                      className="px-4 py-2 rounded-xl bg-white text-blue-600 text-xs font-black hover:bg-blue-50 transition-all">
                      {withdrawing ? "Processing..." : "Yes, Withdraw"}
                    </button>
                    <button onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-black hover:bg-white/20 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ✅ EARNINGS HISTORY — NEW SECTION */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
                <TrendingUp size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Earnings History</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-8">Daily earnings, bonuses and penalty deductions</p>

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            )}

            {!loading && earnings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <SearchX size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-black text-slate-700">No earnings yet</p>
                <p className="text-xs text-slate-400 mt-1">Your daily earnings will appear here.</p>
              </div>
            )}

            {!loading && earnings.length > 0 && (
              <div className="space-y-3">
                {earnings.map((e, idx) => {
                  const isPenalty = e.status === "PENALTY" || e.amount < 0;
                  const config = earningConfig[e.status] || earningConfig.AVAILABLE;
                  const Icon = isPenalty ? TrendingDown : e.amount > 50 ? Gift : Briefcase;

                  return (
                    <div key={idx}
                      className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 rounded-2xl border-2 transition-all
                        ${isPenalty
                          ? "border-red-100 bg-red-50/30"
                          : "border-slate-100 bg-slate-50/30"}`}>

                      {/* LEFT */}
                      <div className="flex items-start gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          {/* Amount */}
                          <p className={`text-sm font-black ${isPenalty ? "text-red-600" : "text-emerald-600"}`}>
                            {isPenalty ? "-" : "+"}{format(Math.abs(e.amount))}
                          </p>
                          {/* Date */}
                          <p className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <CalendarDays size={10} /> {formatDate(e.workDate)}
                          </p>
                          {/* ✅ Reason — shows penalty explanation clearly */}
                          {e.reason && (
                            <p className={`text-xs font-medium mt-1 ${isPenalty ? "text-red-500" : "text-slate-500"}`}>
                              {e.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT — status badge */}
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
                        {config.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* WITHDRAWAL HISTORY */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <IndianRupee size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Withdrawal History</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-8">All your payout requests and their status</p>

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            )}

            {!loading && payouts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <SearchX size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-black text-slate-700">No withdrawals yet</p>
                <p className="text-xs text-slate-400 mt-1">Your withdrawal history will appear here.</p>
              </div>
            )}

            {!loading && payouts.length > 0 && (
              <div className="space-y-3">
                {payouts.map(p => {
                  const key = (p.status || "").toUpperCase();
                  const config = statusConfig[key] || statusConfig.INITIATED;
                  const Icon = config.icon;

                  return (
                    <div key={p.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all ${config.border}`}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-black text-slate-900">{format(p.amount)}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                              <CalendarDays size={10} /> Requested: {formatDate(p.createdAt)}
                            </span>
                            {p.paidAt && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                                  <CheckCircle2 size={10} /> Paid: {formatDate(p.paidAt)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
                        {config.label}
                      </span>
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