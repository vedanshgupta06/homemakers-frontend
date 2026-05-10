import { useEffect, useState } from "react";
import { getMyEarnings } from "../../api/providerEarningsApi";
import { getMyPayouts, getWalletSummary } from "../../api/providerPayoutApi";
import {
  ArrowLeft, SearchX, AlertCircle, CheckCircle2,
  CalendarDays, TrendingDown, Clock, Wallet,
  IndianRupee, ChevronDown, ChevronUp, XOctagon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Helpers ────────────────────────────────────────────────────────── */

const format = (v) => `₹${Number(v || 0).toFixed(0)}`;

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const payoutStatusConfig = {
  INITIATED: {
    label: "Processing",
    badge: "bg-yellow-100 text-yellow-700",
    iconBg: "bg-yellow-500",
    icon: Clock,
  },
  PAID: {
    label: "Paid",
    badge: "bg-emerald-100 text-emerald-700",
    iconBg: "bg-emerald-500",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    badge: "bg-red-100 text-red-600",
    iconBg: "bg-red-400",
    icon: XOctagon,
  },
};

/* ─── Component ──────────────────────────────────────────────────────── */

export default function ProviderDeductions() {
  const navigate = useNavigate();

  const [penalties, setPenalties] = useState([]);
  const [payouts, setPayouts]     = useState([]);
  const [wallet, setWallet]       = useState({});
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [showPayouts, setShowPayouts] = useState(false);

  useEffect(() => {
    Promise.all([
      getMyEarnings(),
      getMyPayouts(),
      getWalletSummary(),
    ])
      .then(([earningsRes, payRes, walRes]) => {
        const allEarnings = earningsRes.data || [];
        // Only penalty entries
        const penaltyEntries = allEarnings.filter(
          (e) => e.status === "PENALTY" || Number(e.amount) < 0
        );
        setPenalties(penaltyEntries);
        setPayouts(payRes.data || []);
        setWallet(walRes.data  || {});
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived stats ── */
  const totalDeducted = penalties.reduce((s, e) => s + Math.abs(Number(e.amount || 0)), 0);
  const available = wallet?.available || 0;
  const paid      = wallet?.paid      || 0;
  const requested = wallet?.requested || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-red-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-orange-400/5 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-xs font-bold uppercase tracking-widest">Deductions</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            My <span className="text-red-400">Deductions</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">
            Penalty deductions applied to your earnings.
          </p>

          {!loading && totalDeducted > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5">
                <TrendingDown size={12} className="text-red-300" />
                <span className="text-red-200 text-xs font-bold">{format(totalDeducted)} deducted</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-500/20 border border-slate-500/30 rounded-full px-4 py-1.5">
                <AlertCircle size={12} className="text-slate-300" />
                <span className="text-slate-200 text-xs font-bold">{penalties.length} penalties</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────── */}
      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 space-y-5">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl border bg-red-50 border-red-100">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm font-bold text-red-600">{error}</p>
            </div>
          )}

          {/* ── STATS ROW ── */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Total Deducted", value: totalDeducted, iconBg: "bg-red-500",    icon: TrendingDown },
                { label: "Available",      value: available,     iconBg: "bg-blue-600",   icon: Wallet       },
                { label: "Total Paid Out", value: paid,          iconBg: "bg-emerald-500",icon: CheckCircle2 },
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

          {/* ── WALLET SNAPSHOT + PAYOUT RECAP ── */}
          {!loading && (
            <div className="bg-[#1E293B] rounded-[2rem] p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Wallet size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Wallet Snapshot</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Available",  value: available, color: "text-blue-300"    },
                  { label: "Processing", value: requested, color: "text-yellow-300"  },
                  { label: "Paid Out",   value: paid,      color: "text-emerald-300" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">{label}</p>
                    <p className={`text-lg font-black ${color}`}>{format(value)}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowPayouts((p) => !p)}
                className="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs font-black hover:bg-white/10 transition-all"
              >
                <span className="flex items-center gap-2">
                  <IndianRupee size={12} />
                  Recent Payout Requests
                </span>
                {showPayouts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showPayouts && (
                <div className="mt-3 space-y-2">
                  {payouts.length === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-4">No payouts yet</p>
                  ) : (
                    payouts.slice(0, 5).map((p) => {
                      const key = (p.status || "").toUpperCase();
                      const cfg = payoutStatusConfig[key] || payoutStatusConfig.INITIATED;
                      const Icon = cfg.icon;
                      return (
                        <div key={p.id}
                          className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-7 h-7 rounded-lg ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                              <Icon size={12} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-white">{format(p.amount)}</p>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <CalendarDays size={8} /> {formatDate(p.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── PENALTIES LIST ── */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center">
                <TrendingDown size={14} className="text-white" />
              </div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Penalty History</h3>
            </div>
            <p className="text-slate-400 text-xs ml-11 mb-8">All penalty deductions from your earnings</p>

            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            )}

            {!loading && penalties.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                </div>
                <p className="text-sm font-black text-slate-700">No penalties</p>
                <p className="text-xs text-slate-400 mt-1">You're all clear — no deductions on record.</p>
              </div>
            )}

            {!loading && penalties.length > 0 && (
              <div className="space-y-3">
                {penalties.map((e, idx) => (
                  <div key={idx}
                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 rounded-2xl border-2 border-red-100 bg-red-50/30">

                    {/* LEFT */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                        <TrendingDown size={16} className="text-white" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-black text-red-600">
                          -{format(Math.abs(e.amount))}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <CalendarDays size={10} /> {formatDate(e.workDate)}
                        </p>
                        {e.reason && (
                          <p className="text-xs text-red-500 font-medium mt-0.5 leading-relaxed">
                            {e.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-600">
                      Penalty
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}