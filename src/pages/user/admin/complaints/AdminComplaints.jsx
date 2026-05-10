import { useEffect, useState } from "react";
import api from "../../../../api/axios";
import { CheckCircle2, XCircle, Clock, AlertTriangle, ChevronDown } from "lucide-react";

const STATUS_TABS = ["ALL", "PENDING", "VALIDATED", "REJECTED"];

const SEV_COLOR = {
  HIGH:   "text-red-600 bg-red-50 border-red-200",
  MEDIUM: "text-orange-600 bg-orange-50 border-orange-200",
  LOW:    "text-yellow-600 bg-yellow-50 border-yellow-200",
};

const STATUS_COLOR = {
  PENDING:   "text-yellow-600 bg-yellow-50 border-yellow-200",
  VALIDATED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  REJECTED:  "text-red-600 bg-red-50 border-red-200",
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter]         = useState("PENDING");
  const [loading, setLoading]       = useState(true);
  const [actionId, setActionId]     = useState(null); // which complaint has open note input
  const [noteMap, setNoteMap]       = useState({});   // complaintId → adminNote text

  useEffect(() => {
    api.get("/api/complaints/admin/all")
      .then(res => { setComplaints(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = complaints.filter(c =>
    filter === "ALL" ? true : c.status === filter
  );

  const handleAction = async (id, action) => {
    const note = noteMap[id] || "";
    try {
      const res = await api.post(`/api/complaints/admin/${id}/${action}`, { adminNote: note });
      setComplaints(prev => prev.map(c => c.id === id ? res.data : c));
      setActionId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const counts = {
    ALL:       complaints.length,
    PENDING:   complaints.filter(c => c.status === "PENDING").length,
    VALIDATED: complaints.filter(c => c.status === "VALIDATED").length,
    REJECTED:  complaints.filter(c => c.status === "REJECTED").length,
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 rounded-full px-3 py-1 mb-3">
          <AlertTriangle size={12} className="text-orange-500" />
          <span className="text-orange-600 text-xs font-bold uppercase tracking-widest">Complaints</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Complaint Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">Review and action user complaints against providers.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2
              ${filter === tab
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200"
              }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-black
                ${filter === tab ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <CheckCircle2 size={28} className="text-slate-400" />
          </div>
          <p className="text-sm font-black text-slate-700 uppercase tracking-tight">No Complaints</p>
          <p className="text-xs text-slate-400 mt-1">No {filter.toLowerCase()} complaints found.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border-2 border-slate-100 p-5 flex flex-col gap-3 hover:border-slate-200 transition-colors">

              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-900">Booking #{c.booking?.id}</p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {c.user?.name || c.user?.email} · {formatDate(c.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${SEV_COLOR[c.severity]}`}>
                    {c.severity}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full border ${STATUS_COLOR[c.status]}`}>
                    {c.status}
                  </span>
                </div>
              </div>

              {/* Provider */}
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Provider</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  {c.provider?.user?.name || c.provider?.user?.email}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

              {/* Admin note (resolved) */}
              {c.adminNote && c.status !== "PENDING" && (
                <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Admin Note</p>
                  <p className="text-xs text-blue-700 mt-0.5">{c.adminNote}</p>
                </div>
              )}

              {/* Actions — only for PENDING */}
              {c.status === "PENDING" && (
                <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
                  {actionId === c.id ? (
                    <>
                      <textarea
                        value={noteMap[c.id] || ""}
                        onChange={e => setNoteMap(prev => ({ ...prev, [c.id]: e.target.value }))}
                        placeholder="Add an admin note (optional)..."
                        rows={2}
                        className="w-full border-2 border-slate-100 rounded-xl p-2.5 text-xs resize-none focus:outline-none focus:border-blue-200 text-slate-800 placeholder:text-slate-300"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(c.id, "validate")}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                        >
                          <CheckCircle2 size={12} />
                          Validate & Deduct
                        </button>
                        <button
                          onClick={() => handleAction(c.id, "reject")}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                        >
                          <XCircle size={12} />
                          Reject
                        </button>
                        <button
                          onClick={() => setActionId(null)}
                          className="px-3 py-2 rounded-xl border-2 border-slate-100 text-slate-400 text-xs font-black hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setActionId(c.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider hover:bg-slate-50 hover:border-slate-200 transition-all"
                    >
                      <Clock size={12} />
                      Review this complaint
                      <ChevronDown size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}