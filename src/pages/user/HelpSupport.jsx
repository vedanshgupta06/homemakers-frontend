import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  ArrowLeft, AlertTriangle, CheckCircle2, Clock,
  ChevronDown, Send, XCircle 
} from "lucide-react";

const SEVERITY_OPTIONS = [
  { value: "LOW",    label: "Low",    desc: "Minor issue, not urgent",         color: "text-yellow-600 bg-yellow-50 border-yellow-200"  },
  { value: "MEDIUM", label: "Medium", desc: "Affected service quality",         color: "text-orange-600 bg-orange-50 border-orange-200"  },
  { value: "HIGH",   label: "High",   desc: "Serious misconduct or no-show",    color: "text-red-600 bg-red-50 border-red-200"           },
];

const STATUS_CONFIG = {
  PENDING:   { label: "Pending",   icon: Clock,        color: "text-yellow-600 bg-yellow-50 border-yellow-200"  },
  VALIDATED: { label: "Validated", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  REJECTED:  { label: "Rejected",  icon: XCircle,      color: "text-red-600 bg-red-50 border-red-200"           },
};

export default function HelpSupport() {
  const navigate = useNavigate();

  // Form state
  const [bookings, setBookings]     = useState([]);
  const [bookingId, setBookingId]   = useState("");
  const [severity, setSeverity]     = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");

  // My complaints
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  useEffect(() => {
    // Load completed bookings for dropdown
    api.get("/api/bookings/user")
      .then(res => setBookings(res.data.filter(b => b.status === "COMPLETED")))
      .catch(console.error);

    // Load existing complaints
    api.get("/api/complaints/my")
      .then(res => { setComplaints(res.data); setLoadingComplaints(false); })
      .catch(() => setLoadingComplaints(false));
  }, []);

  const handleSubmit = async () => {
    if (!bookingId || !description.trim()) {
      setError("Please select a booking and describe the issue.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/api/complaints", { bookingId: parseInt(bookingId), severity, description });
      setComplaints(prev => [res.data, ...prev]);
      setSuccess(true);
      setBookingId(""); setSeverity("MEDIUM"); setDescription("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const formatServices = (services) => {
    if (!services?.length) return "Service";
    return services.map(s => s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())).join(", ");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-500/30 rounded-full px-3 py-1 mb-4">
            <AlertTriangle size={12} className="text-orange-300" />
            <span className="text-orange-300 text-xs font-bold uppercase tracking-widest">Help & Support</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Report an <span className="text-orange-400">Issue</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl">
            Had a problem with a provider? Submit a complaint and our team will review it.
          </p>
        </div>
      </div>

      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6">

            {/* LEFT — Submit form */}
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-8">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-6">
                Submit a Complaint
              </h3>

              {/* Booking selector */}
              <div className="mb-5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                  Select Booking
                </label>
                <div className="relative">
                  <select
                    value={bookingId}
                    onChange={e => setBookingId(e.target.value)}
                    className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-800 appearance-none focus:outline-none focus:border-blue-200 bg-white"
                  >
                    <option value="">— Choose a completed booking —</option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>
                        #{b.id} · {formatServices(b.services)} · {formatDate(b.availability?.date)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                </div>
                {bookings.length === 0 && (
                  <p className="text-xs text-slate-400 mt-1.5">No completed bookings found.</p>
                )}
              </div>

              {/* Severity */}
              <div className="mb-5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                  Issue Severity
                </label>
                <div className="flex flex-col gap-2">
                  {SEVERITY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSeverity(opt.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all
                        ${severity === opt.value ? opt.color + " border-current" : "border-slate-100 hover:border-slate-200 bg-slate-50"}`}
                    >
                      <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${severity === opt.value ? "border-current bg-current" : "border-slate-300"}`} />
                      <div>
                        <p className={`text-xs font-black uppercase tracking-wider ${severity === opt.value ? "" : "text-slate-600"}`}>{opt.label}</p>
                        <p className={`text-[11px] font-medium ${severity === opt.value ? "opacity-80" : "text-slate-400"}`}>{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                  Describe the Issue
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What went wrong? Be as specific as possible — this helps our team investigate fairly..."
                  rows={5}
                  className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-blue-200 transition-colors text-slate-800 placeholder:text-slate-300"
                />
                <p className="text-[11px] text-slate-400 mt-1">{description.length} / 2000</p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 mb-4">
                  <XCircle size={14} className="text-red-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 mb-4">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-emerald-600">Complaint submitted! Our team will review it shortly.</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || !bookingId || !description.trim()}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95
                  ${submitting || !bookingId || !description.trim()
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                  }`}
              >
                <Send size={13} />
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>

            {/* RIGHT — My complaints history */}
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-8">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-6">
                My Complaints
              </h3>

              {loadingComplaints ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : complaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-black text-slate-700 uppercase tracking-tight">No Complaints</p>
                  <p className="text-xs text-slate-400 mt-1">You haven't submitted any complaints yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                  {complaints.map(c => {
                    const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.PENDING;
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={c.id} className="rounded-xl border-2 border-slate-100 p-4 flex flex-col gap-2 hover:border-slate-200 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-black text-slate-800">Booking #{c.booking?.id}</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{formatDate(c.createdAt)}</p>
                          </div>
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${cfg.color}`}>
                            <StatusIcon size={10} />
                            {cfg.label}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{c.description}</p>

                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border
                            ${c.severity === "HIGH" ? "text-red-600 bg-red-50 border-red-200" :
                              c.severity === "MEDIUM" ? "text-orange-600 bg-orange-50 border-orange-200" :
                              "text-yellow-600 bg-yellow-50 border-yellow-200"}`}>
                            {c.severity} severity
                          </span>
                          {c.adminNote && (
                            <p className="text-[11px] text-slate-400 italic max-w-[60%] truncate">
                              Admin: {c.adminNote}
                            </p>
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
    </div>
  );
}