

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProviders, verifyProvider, rejectProvider
} from "../../../../api/adminProviderApi";
import {
  Baby, Heart, ChefHat, Waves, Wind, Shirt, SprayCan,
  ShieldCheck, ShieldX, MapPin, Briefcase, Star,
  Users, FileText, FileCheck, Search, CheckCheck,
  ArrowLeft, IndianRupee, CalendarDays, ArrowRight,
  AlertTriangle, X, Bell
} from "lucide-react";

const SERVICE_META = {
  BABYSITTING:  { icon: Baby,     label: "Babysitting"  },
  ELDER_CARE:   { icon: Heart,    label: "Elder Care"   },
  COOKING:      { icon: ChefHat,  label: "Cooking"      },
  DISH_WASHING: { icon: Waves,    label: "Dish Washing" },
  CLEANING:     { icon: SprayCan, label: "Cleaning"     },
  DUSTING:      { icon: Wind,     label: "Dusting"      },
  LAUNDRY:      { icon: Shirt,    label: "Laundry"      },
};

function ConfirmModal({ open, onClose, onConfirm, type, providerName, loading, reason, setReason }) {
  if (!open) return null;
  const isVerify = type === "verify";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full z-10">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <X size={16} className="text-slate-400" />
        </button>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto
          ${isVerify ? "bg-emerald-100" : "bg-red-100"}`}>
          {isVerify
            ? <ShieldCheck size={24} className="text-emerald-600" />
            : <ShieldX size={24} className="text-red-500" />
          }
        </div>

        <h3 className="text-lg font-black text-slate-900 text-center uppercase tracking-tight">
          {isVerify ? "Verify Provider?" : "Reject Provider?"}
        </h3>

        <div className={`flex items-start gap-2 mt-4 p-3 rounded-xl
          ${isVerify ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
          <AlertTriangle size={14} className={`flex-shrink-0 mt-0.5 ${isVerify ? "text-emerald-600" : "text-red-500"}`} />
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            {isVerify
              ? <>You are about to <strong>verify</strong> <span className="font-black text-slate-800">{providerName}</span>. They will be able to receive bookings from customers.</>
              : <>You are about to <strong>reject</strong> <span className="font-black text-slate-800">{providerName}</span>. They will be notified with your reason.</>
            }
          </p>
        </div>

        {/* ✅ Reason — only for reject */}
        {!isVerify && (
          <div className="mt-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Reason for rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Documents are unclear, ID proof missing, incomplete profile..."
              rows={3}
              className="w-full text-sm text-slate-800 border-2 border-slate-100 rounded-xl px-3 py-2.5 outline-none focus:border-red-300 resize-none placeholder:text-slate-300 transition-colors"
            />
            {!reason.trim() && (
              <p className="text-[10px] text-red-400 font-medium mt-1">
                A reason is required to notify the provider.
              </p>
            )}
          </div>
        )}

        {/* ✅ Notification info */}
        <div className="flex items-center gap-2 mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <Bell size={11} className="text-slate-400 flex-shrink-0" />
          <p className="text-[10px] text-slate-400 font-medium">
            {isVerify
              ? "Provider will be notified of their verification."
              : "Provider will receive a notification with your reason."
            }
          </p>
        </div>

        <p className="text-[11px] text-slate-400 text-center font-medium mt-3">
          This action can be reversed later.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || (!isVerify && !reason.trim())}
            className={`flex-1 px-4 py-3 rounded-xl text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg
              ${loading || (!isVerify && !reason.trim()) ? "opacity-60 cursor-not-allowed" : ""}
              ${isVerify
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                : "bg-red-500 hover:bg-red-600 shadow-red-200"
              }`}
          >
            {loading ? "Processing..." : isVerify ? "Yes, Verify" : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("ALL");
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    open: false, type: null, providerId: null, providerName: "", processing: false
  });
  const [reason, setReason] = useState("");

  useEffect(() => { loadProviders(); }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const res = await getAllProviders();
      setProviders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, provider) => {
    const name = provider.user?.name || provider.user?.email?.split("@")[0] || "this provider";
    setReason("");
    setModal({ open: true, type, providerId: provider.id, providerName: name, processing: false });
  };

  const closeModal = () => {
    if (modal.processing) return;
    setModal({ open: false, type: null, providerId: null, providerName: "", processing: false });
    setReason("");
  };

  const handleConfirm = async () => {
    setModal(prev => ({ ...prev, processing: true }));
    try {
      if (modal.type === "verify") {
        await verifyProvider(modal.providerId);
      } else {
        await rejectProvider(modal.providerId, reason);
      }
      await loadProviders();
      closeModal();
    } catch {
      alert("Action failed. Please try again.");
      setModal(prev => ({ ...prev, processing: false }));
    }
  };

  const filtered = providers.filter(p => {
    const matchesSearch =
      (p.user?.name || p.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.city || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "ALL" ||
      (filter === "VERIFIED"   && p.verified) ||
      (filter === "UNVERIFIED" && !p.verified);
    return matchesSearch && matchesFilter;
  });

  const verifiedCount   = providers.filter(p => p.verified).length;
  const unverifiedCount = providers.filter(p => !p.verified).length;

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <ConfirmModal
        open={modal.open}
        onClose={closeModal}
        onConfirm={handleConfirm}
        type={modal.type}
        providerName={modal.providerName}
        loading={modal.processing}
        reason={reason}
        setReason={setReason}
      />

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
            Manage <span className="text-blue-400">Providers</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium max-w-xl">
            Review, verify, and manage all registered service providers.
          </p>

          {!loading && (
            <div className="flex flex-wrap gap-3 mt-5">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <Users size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">{providers.length} Total</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-emerald-300 text-xs font-bold">{verifiedCount} Verified</span>
              </div>
              {unverifiedCount > 0 && (
                <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5">
                  <ShieldX size={12} className="text-red-400" />
                  <span className="text-red-300 text-xs font-bold">{unverifiedCount} Pending</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div className="px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          {/* SEARCH + FILTER */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Search size={15} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name, email or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 text-sm font-medium text-slate-800 bg-transparent outline-none placeholder:text-slate-300"
              />
            </div>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { key: "ALL",        label: "All"      },
                { key: "VERIFIED",   label: "Verified" },
                { key: "UNVERIFIED", label: "Pending"  },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 h-8 rounded-lg text-xs font-black transition-all duration-150
                    ${filter === key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Users size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-black text-slate-700">No providers found</p>
              {search && (
                <button onClick={() => setSearch("")} className="text-blue-500 text-xs font-bold underline">
                  Clear search
                </button>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid gap-4">
              {filtered.map((provider) => {
                const name = provider.user?.name || provider.user?.email?.split("@")[0] || "Unknown";
                const hasDocuments = provider.idProofUrl || provider.addressProofUrl;

                return (
                  <div
                    key={provider.id}
                    className={`rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-md
                      ${provider.verified
                        ? "border-slate-100 bg-slate-50/40"
                        : "border-yellow-200 bg-yellow-50/20"
                      }`}
                  >
                    <div className="flex flex-col md:flex-row gap-5">

                      {/* AVATAR + CORE INFO */}
                      <div className="flex gap-4 items-start flex-shrink-0">
                        <div className="relative flex-shrink-0">
                          {provider.profilePhotoUrl ? (
                            <img
                              src={`http://localhost:8080${provider.profilePhotoUrl}`}
                              alt={name}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                            />
                          ) : null}
                          <div
                            className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg"
                            style={{ display: provider.profilePhotoUrl ? "none" : "flex" }}
                          >
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 rounded-lg p-1
                            ${provider.verified ? "bg-emerald-500" : "bg-yellow-500"}`}>
                            {provider.verified
                              ? <ShieldCheck size={10} className="text-white" />
                              : <ShieldX size={10} className="text-white" />
                            }
                          </div>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900">{name}</p>
                          <p className="text-xs text-slate-400 font-medium">{provider.user?.email}</p>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {provider.city && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                <MapPin size={10} className="text-blue-400" />
                                {provider.city.charAt(0).toUpperCase() + provider.city.slice(1)}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                              <Briefcase size={10} className="text-blue-400" />
                              {provider.experienceYears} yrs exp
                            </span>
                            {provider.rating > 0 ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-600">
                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                {provider.rating.toFixed(1)} ({provider.totalRatings})
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-slate-400">No ratings</span>
                            )}
                            {provider.pricePerHour > 0 && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                                <IndianRupee size={10} className="text-blue-400" />
                                ₹{provider.pricePerHour}/hr
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* SERVICES + DOCS */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap gap-1.5">
                          {provider.services?.map(s => {
                            const meta = SERVICE_META[s];
                            const Icon = meta?.icon;
                            return (
                              <span key={s}
                                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-black bg-white border border-slate-200 rounded-xl text-slate-600 uppercase tracking-wider">
                                {Icon && <Icon size={10} className="text-blue-400" />}
                                {meta?.label || s.replaceAll("_", " ")}
                              </span>
                            );
                          })}
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                          {provider.idProofUrl ? (
                            <a href={`http://localhost:8080${provider.idProofUrl}`} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 hover:text-blue-800 transition">
                              <FileCheck size={12} /> ID Proof
                            </a>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                              <FileText size={12} /> No ID Proof
                            </span>
                          )}
                          {provider.addressProofUrl ? (
                            <a href={`http://localhost:8080${provider.addressProofUrl}`} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 hover:text-blue-800 transition">
                              <FileCheck size={12} /> Address Proof
                            </a>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
                              <FileText size={12} /> No Address Proof
                            </span>
                          )}
                          {provider.lastPayoutRequestedAt && (
                            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                              <CalendarDays size={11} />
                              Last payout: {formatDate(provider.lastPayoutRequestedAt)}
                            </span>
                          )}
                        </div>

                        {!provider.verified && !hasDocuments && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-100 rounded-xl w-fit">
                            <ShieldX size={11} className="text-yellow-500" />
                            <span className="text-[10px] font-black text-yellow-700 uppercase tracking-wider">No documents uploaded</span>
                          </div>
                        )}
                      </div>

                      {/* STATUS + ACTIONS */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 flex-shrink-0">
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black
                          ${provider.verified
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {provider.verified
                            ? <><ShieldCheck size={11} /> Verified</>
                            : <><ShieldX size={11} /> Pending</>
                          }
                        </span>

                        {/* ✅ Verify — opens modal */}
                        {!provider.verified && (
                          <button
                            onClick={() => openModal("verify", provider)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                          >
                            Verify
                          </button>
                        )}

                        {/* ✅ Revoke — opens modal */}
                        {provider.verified && (
                          <button
                            onClick={() => openModal("reject", provider)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-red-50 text-red-600 border-2 border-red-100 hover:bg-red-100 active:scale-95 transition-all"
                          >
                            <ShieldX size={12} strokeWidth={3} />
                            Revoke
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/admin/providers/${provider.id}`)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-100 bg-white hover:border-blue-200 text-xs font-black text-slate-600 transition-all"
                        >
                          View Details
                          <ArrowRight size={12} strokeWidth={3} />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}