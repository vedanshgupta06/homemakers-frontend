import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import WalletConsentModal from "./WalletConsentModal";

import {
  User, Clock, Sparkles, Home, Users,
  IndianRupee, Check, CalendarCheck, ArrowLeft, Info
} from "lucide-react";

const HOURLY_SERVICES = ["BABYSITTING", "ELDER_CARE", "COOKING"];

const SERVICE_MINUTES = {
  DISH_WASHING: 45,
  CLEANING:     60,
  DUSTING:      30,
  LAUNDRY:      40,
};

function calcBookingMinutes(services = [], hoursPerDay = 1) {
  return services.reduce((total, s) => {
    if (HOURLY_SERVICES.includes(s)) return total + hoursPerDay * 60;
    return total + (SERVICE_MINUTES[s] ?? 30);
  }, 0);
}

function addMinutes(timeStr, mins) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const total  = h * 60 + m + mins;
  const rh     = Math.floor(total / 60) % 24;
  const rm     = total % 60;
  const period = rh >= 12 ? "PM" : "AM";
  const hour   = rh % 12 || 12;
  return `${hour}:${String(rm).padStart(2, "0")} ${period}`;
}

function formatTime(timeStr) {
  if (!timeStr) return timeStr;
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function BookingPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;
  const [preview, setPreview]               = useState(null);
  const [confirming, setConfirming]         = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [showConsent, setShowConsent]       = useState(false);

  const buildRequestBody = () => ({
    providerId:         bookingData.providerId,
    availabilityId:     bookingData.availabilityId,
    houseSize:          bookingData.houseSize,
    members:            bookingData.members,
    startDate:          bookingData.startDate,
    preferredStartTime: bookingData.preferredStartTime,
    services: bookingData.services.map(service => ({
      serviceType: service,
      hours: HOURLY_SERVICES.includes(service) ? bookingData.hoursPerDay : null,
    })),
  });

  useEffect(() => {
    if (!bookingData) { navigate("/user/services"); return; }
    api.post("/api/bookings/preview", buildRequestBody())
      .then(res => setPreview(res.data))
      .catch(err => console.error("Preview failed", err));
  }, []);

  const confirmBooking = () => {
    setConfirming(true);
    api.post("/api/bookings", buildRequestBody())
      .then(res => {
        setPendingBooking(res.data);
        setShowConsent(true);
        setConfirming(false);
      })
      .catch(err => {
        console.error("Booking failed", err);
        setConfirming(false);
      });
  };

  const handleConsentDone = () => {
    setShowConsent(false);
    setPendingBooking(null);
    navigate("/user/success", {
      state: {
        providerName: preview.providerName,
        // ✅ Fixed: use actual service end time, not slot end time
        slot: `${slotStartFormatted} - ${bookingEndFormatted}`,
      },
    });
  };

  const format = (s) =>
    s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  const bookingMins         = bookingData
    ? calcBookingMinutes(bookingData.services || [], bookingData.hoursPerDay || 1)
    : 0;
  const slotStartFormatted  = preview ? formatTime(preview.slotStart) : "";
  const bookingEndFormatted = preview ? addMinutes(preview.slotStart, bookingMins) : "";

  const durationLabel = bookingMins >= 60
    ? bookingMins % 60 === 0
      ? `${bookingMins / 60} hr`
      : `${Math.floor(bookingMins / 60)} hr ${bookingMins % 60} min`
    : `${bookingMins} min`;

  // ── Loading skeleton ──────────────────────────────────────
  if (!preview) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-[#1E293B] pt-16 pb-20 md:pt-20 md:pb-24 px-[5%]">
          <div className="max-w-7xl mx-auto">
            <div className="h-4 w-32 bg-white/10 rounded-full mb-4 animate-pulse" />
            <div className="h-10 w-64 bg-white/10 rounded-2xl animate-pulse" />
          </div>
        </div>
        <div className="px-[5%]">
          <div className="max-w-2xl mx-auto -mt-8 relative z-10 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8">
            <div className="space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const details = [
    { icon: User,     iconBg: "bg-blue-600",   label: "Provider",   value: preview.providerName },
    { icon: Clock,    iconBg: "bg-emerald-500", label: "Time Slot",  value: `${slotStartFormatted} – ${bookingEndFormatted}`, sub: durationLabel },
    { icon: Sparkles, iconBg: "bg-violet-500",  label: "Services",   value: Object.keys(preview.serviceWisePrice).map(format).join(", ") },
    { icon: Home,     iconBg: "bg-orange-500",  label: "House Size", value: preview.houseSize },
    { icon: Users,    iconBg: "bg-sky-500",     label: "Members",    value: `${preview.members} ${preview.members === 1 ? "person" : "people"}` },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── HERO ── */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-blue-400/5 translate-y-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <button type="button" onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95">
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Final Step</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Booking <span className="text-blue-400">Preview</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl">
            Review your details before confirming.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 rounded-full px-4 py-1.5">
            <IndianRupee size={12} className="text-white" />
            <span className="text-white text-xs font-bold">
              ₹{preview.totalWithFee} / month
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN CARD ── */}
      <div className="px-[5%] pb-32">
        <div className="max-w-2xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          {/* Section header */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <CalendarCheck size={14} className="text-white" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Booking Summary</h3>
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-8">Please review everything before confirming</p>

          {/* Detail rows */}
          <div className="space-y-3 mb-8">
            {details.map(({ icon: Icon, iconBg, label, value, sub }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                  <Icon size={15} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800">{value}</p>
                    {sub && (
                      <span className="text-[10px] font-black text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-md">
                        {sub}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pricing</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Service-wise price breakdown */}
          <div className="space-y-2 mb-4">
            {Object.entries(preview.serviceWisePrice).map(([service, price]) => (
              <div key={service} className="flex items-center justify-between px-1">
                <span className="text-sm text-slate-500 font-medium">{format(service)}</span>
                <span className="text-sm font-bold text-slate-800">₹{price}</span>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between px-1 pb-4 border-b border-slate-100">
            <span className="text-sm text-slate-500 font-medium">Subtotal</span>
            <span className="text-sm font-bold text-slate-800">₹{preview.totalMonthlyPrice}</span>
          </div>

          {/* ✅ Platform fee line — transparent, shown clearly */}
          <div className="flex items-center justify-between px-1 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Platform Fee</span>
              <div className="group relative">
                <Info size={12} className="text-slate-300 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[10px] font-medium px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  A 5% fee charged to maintain and improve the platform.
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">5%</span>
            </div>
            <span className="text-sm font-bold text-slate-800">₹{preview.platformFee}</span>
          </div>

          {/* Total with fee */}
          <div className="flex items-center justify-between p-5 bg-[#1E293B] rounded-2xl mt-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Total Payable</p>
              <p className="text-white text-sm font-bold">Per Month · incl. platform fee</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-400 font-black text-xs">₹</span>
              <span className="text-white font-black text-2xl">{preview.totalWithFee}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── FIXED CTA ── */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 z-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="hidden sm:block flex-shrink-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total / month</p>
            <p className="text-sm font-black text-slate-800">₹{preview.totalWithFee}</p>
          </div>
          <button
            type="button"
            onClick={confirmBooking}
            disabled={confirming}
            className={`flex-1 py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2
              ${confirming
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"
              }`}
          >
            {confirming
              ? "CONFIRMING..."
              : <><Check size={14} strokeWidth={4} /> CONFIRM BOOKING</>
            }
          </button>
        </div>
      </div>

      {/* ── WALLET CONSENT MODAL ── */}
      {showConsent && pendingBooking && (
        <WalletConsentModal
          booking={pendingBooking}
          onConsentDone={handleConsentDone}
        />
      )}

    </div>
  );
}

export default BookingPreview;