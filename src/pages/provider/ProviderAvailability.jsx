import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import {
  CalendarDays, Clock, Plus, AlertCircle,
  CheckCircle2, XCircle, Timer,
  ArrowLeft, Zap, RotateCcw, Repeat2,
  ChevronDown, Search, Trash2, Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TIME_PRESETS = [
  { label: "Morning",   start: "08:00", end: "12:00" },
  { label: "Afternoon", start: "12:00", end: "16:00" },
  { label: "Evening",   start: "16:00", end: "20:00" },
  { label: "Full Day",  start: "08:00", end: "20:00" },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getNextDates = (n = 10) => {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0];
  });
};

const PAGE_SIZE = 10;

function ProviderAvailability() {
  const [slots, setSlots]                 = useState([]);
  const [tab, setTab]                     = useState("UPCOMING");
  const [error, setError]                 = useState("");
  const [success, setSuccess]             = useState("");
  const [adding, setAdding]               = useState(false);
  const [deletingPast, setDeletingPast]   = useState(false);
  const [confirmClean, setConfirmClean]   = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState(null);
  const [confirmDeleteSlot, setConfirmDeleteSlot] = useState(null); // slot object
  const [selectedDates, setSelectedDates] = useState([]);
  const [startTime, setStartTime]         = useState("09:00");
  const [endTime, setEndTime]             = useState("13:00");
  const [presetActive, setPresetActive]   = useState(null);
  const [searchQuery, setSearchQuery]     = useState("");
  const [filterStatus, setFilterStatus]   = useState("ALL");
  const [page, setPage]                   = useState(1);
  const [showAddForm, setShowAddForm]     = useState(true);

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => { loadAvailability(); }, []);
  useEffect(() => { setPage(1); }, [tab, searchQuery, filterStatus]);

  const loadAvailability = async () => {
    try {
      const res = await api.get("/api/provider/availability/my");
      setSlots(res.data || []);
    } catch {
      setError("Failed to load availability");
    }
  };

  const applyPreset = (preset, idx) => {
    setStartTime(preset.start);
    setEndTime(preset.end);
    setPresetActive(idx);
    setError("");
  };

  const toggleDate = (date) => {
    setSelectedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
    setError("");
  };

  const selectWeekdays = () => {
    setSelectedDates(getNextDates(10).filter(d => {
      const day = new Date(d + "T00:00:00").getDay();
      return day >= 1 && day <= 5;
    }));
  };

  const selectWeekends = () => {
    setSelectedDates(getNextDates(10).filter(d => {
      const day = new Date(d + "T00:00:00").getDay();
      return day === 0 || day === 6;
    }));
  };

  // ── Core time helper ─────────────────────────────────────────────────────
  // Returns true if [aStart, aEnd) overlaps [bStart, bEnd)
  const timesOverlap = (aStart, aEnd, bStart, bEnd) =>
    !(aEnd <= bStart || aStart >= bEnd);

  // ── Booking range helpers ────────────────────────────────────────────────
  /**
   * A slot is considered "range-booked" when:
   *   - slot.active === false  (booking is active, NOT cancelled)
   *   - slot has bookingWorkStart + bookingWorkEnd (the work period of the booking)
   *
   * Every calendar date that falls within [bookingWorkStart, bookingWorkEnd]
   * AND whose time window overlaps with the selected [startTime, endTime]
   * is LOCKED — you cannot add a new slot there.
   *
   * When a booking is cancelled, slot.active flips back to true, which
   * immediately removes it from all locked ranges.
   */
  // addDays helper — converts "YYYY-MM-DD" + n days → "YYYY-MM-DD"
  const addDays = (dateStr, days) => {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  // All inactive slots that belong to an active booking.
  // If bookingWorkEnd is missing (old data pre-fix), fall back to +30 days
  // so those slots are still correctly locked in the picker.
  const activeBookedSlots = useMemo(
    () => slots
      .filter(s => !s.active && s.bookingWorkStart)
      .map(s => ({
        ...s,
        bookingWorkEnd: s.bookingWorkEnd ?? addDays(s.bookingWorkStart, 30),
      })),
    [slots]
  );

  /**
   * Is `date` locked by any active booking whose time overlaps `newStart`–`newEnd`?
   * Used when deciding whether a date-cell in the picker should be disabled.
   */
  // Lower bound = today (not bookingWorkStart) because slots before the anchor
  // date (e.g. May 1 when anchor is May 2) are also split+locked by the backend.
  // Provider can only add from today onwards so today is the correct lower bound.
  const isDateLockedForTime = (date, newStart, newEnd) =>
    activeBookedSlots.some(s =>
      date >= today &&
      date <= s.bookingWorkEnd &&
      timesOverlap(newStart, newEnd, s.startTime, s.endTime)
    );

  /**
   * Does `date` already have a FREE (active) slot whose time overlaps `newStart`–`newEnd`?
   * Prevents double-booking the same window.
   */
  const hasFreeTimeConflict = (date, newStart, newEnd) =>
    slots.some(s =>
      s.active &&
      s.date === date &&
      timesOverlap(newStart, newEnd, s.startTime, s.endTime)
    );

  // Combined: is this date blocked for the currently chosen time window?
  const isDateBlocked = (date) =>
    isDateLockedForTime(date, startTime, endTime) ||
    hasFreeTimeConflict(date, startTime, endTime);

  const conflictingDates = selectedDates.filter(isDateBlocked);

  // ── Add slots ────────────────────────────────────────────────────────────
  const addSlots = async () => {
    setError(""); setSuccess("");
    if (selectedDates.length === 0) return setError("Select at least one date");
    if (!startTime || !endTime) return setError("Set start and end time");
    if (startTime >= endTime) return setError("End time must be after start time");
    if (conflictingDates.length > 0)
      return setError(`${conflictingDates.length} date(s) conflict with existing bookings or slots`);

    setAdding(true);
    try {
      await Promise.all(
        selectedDates.map(date =>
          api.post("/api/provider/availability", { date, startTime, endTime })
        )
      );
      setSuccess(`✓ Added ${selectedDates.length} slot${selectedDates.length > 1 ? "s" : ""} successfully`);
      setSelectedDates([]);
      loadAvailability();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add slots");
    } finally {
      setAdding(false);
    }
  };

  // ── Delete past unbooked slots ───────────────────────────────────────────
  const deletePastSlots = async () => {
    setDeletingPast(true);
    setError("");
    try {
      const pastActiveSlots = slots.filter(s => s.date < today && s.active);
      let deleted = 0;
      await Promise.allSettled(
        pastActiveSlots.map(s =>
          api.delete(`/api/provider/availability/${s.id}`)
            .then(() => { deleted++; })
            .catch(() => {})
        )
      );
      setSuccess(`✓ Cleaned ${deleted} past slot${deleted !== 1 ? "s" : ""}`);
      setConfirmClean(false);
      loadAvailability();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to clean past slots");
    } finally {
      setDeletingPast(false);
    }
  };

  // ── Delete a single free upcoming slot ──────────────────────────────────
  const deleteSlot = async (slot) => {
    setDeletingSlotId(slot.id);
    setError("");
    try {
      await api.delete(`/api/provider/availability/${slot.id}`);
      setSuccess(`✓ Slot removed for ${formatDate(slot.date)}`);
      setConfirmDeleteSlot(null);
      loadAvailability();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete slot");
    } finally {
      setDeletingSlotId(null);
    }
  };
  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric"
    });
  };

  const formatDateShort = (d) => {
    const dt = new Date(d + "T00:00:00");
    return {
      day: DAY_LABELS[dt.getDay()],
      date: dt.getDate(),
      month: dt.toLocaleDateString("en-IN", { month: "short" }),
      isToday: d === today,
    };
  };

  const formatDuration = (mins) => {
    if (!mins) return "—";
    const h = Math.floor(mins / 60), m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  // ── Derived data ─────────────────────────────────────────────────────────
  const upcoming = useMemo(() =>
    slots.filter(s => s.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)),
    [slots, today]
  );

  const past = useMemo(() =>
    slots.filter(s => s.date < today)
      .sort((a, b) => b.date.localeCompare(a.date)),
    [slots, today]
  );

  const baseSlots = tab === "UPCOMING" ? upcoming : past;

  const filteredSlots = useMemo(() => {
    return baseSlots.filter(s => {
      const matchSearch = !searchQuery ||
        formatDate(s.date).toLowerCase().includes(searchQuery.toLowerCase()) ||
        formatTime(s.startTime).toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter =
        filterStatus === "ALL" ||
        (filterStatus === "AVAILABLE" && s.active) ||
        (filterStatus === "BOOKED" && !s.active);
      return matchSearch && matchFilter;
    });
  }, [baseSlots, searchQuery, filterStatus]);

  const paginatedSlots = filteredSlots.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedSlots.length < filteredSlots.length;

  const upcomingFreeCount   = upcoming.filter(s => s.active).length;
  const upcomingBookedCount = upcoming.filter(s => !s.active).length;
  const pastCleanableCount  = past.filter(s => s.active).length;
  const next10              = getNextDates(10);

  // ── Date-cell state for the picker ───────────────────────────────────────
  /**
   * For each date in the 10-day grid we compute its visual state once,
   * factoring in the currently selected time window so the grid stays
   * reactive as the user changes start/end time.
   */
  const dateCellStates = useMemo(() => {
    return next10.map(date => {
      const locked   = isDateLockedForTime(date, startTime, endTime);
      const conflict = !locked && hasFreeTimeConflict(date, startTime, endTime);
      const alreadyFree = slots.some(s => s.active && s.date === date);
      return { date, locked, conflict, alreadyFree };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots, startTime, endTime]);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(.96); }
          to   { opacity:1; transform:scale(1); }
        }
        .fade-up  { animation: fadeUp .35s ease forwards; }
        .scale-in { animation: scaleIn .25s ease forwards; }
        .slot-row { transition: all .2s ease; }
        .slot-row:hover { transform: translateX(3px); }
        .date-btn { transition: all .15s ease; }
        .date-btn:active { transform: scale(.92); }
      `}</style>

      {/* ── HERO ── */}
      <div className="bg-[#1E293B] pt-2 pb-24 md:pt-20 md:pb-28 px-[5%] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-400/5 translate-y-1/2" />
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,.06) 1px, transparent 0)",
            backgroundSize: "28px 28px"
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <button onClick={() => navigate(-1)}
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95">
            <ArrowLeft size={16} strokeWidth={2.5} className="text-white group-hover:text-slate-900 transition-colors" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Availability</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-1">
            My <span className="text-blue-400">Schedule</span>
          </h1>
          <p className="text-slate-400 text-sm mt-3 font-medium">
            Manage your working hours and date availability.
          </p>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-2xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div>
                <p className="text-white text-sm font-black leading-none">{upcomingFreeCount}</p>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">Free slots</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-2xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div>
                <p className="text-white text-sm font-black leading-none">{upcomingBookedCount}</p>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">Booked slots</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-2xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <div>
                <p className="text-white text-sm font-black leading-none">{upcoming.length}</p>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">Total upcoming</p>
              </div>
            </div>
            {pastCleanableCount > 0 && (
              <div className="flex items-center gap-2.5 bg-red-500/20 border border-red-500/30 rounded-2xl px-4 py-2.5">
                <Trash2 size={11} className="text-red-300" />
                <div>
                  <p className="text-red-200 text-sm font-black leading-none">{pastCleanableCount}</p>
                  <p className="text-red-300/70 text-[10px] font-medium mt-0.5">Past to clean</p>
                </div>
              </div>
            )}
            {activeBookedSlots.length > 0 && (
              <div className="flex items-center gap-2.5 bg-orange-500/20 border border-orange-500/30 rounded-2xl px-4 py-2.5">
                <Lock size={11} className="text-orange-300" />
                <div>
                  <p className="text-orange-200 text-sm font-black leading-none">{activeBookedSlots.length}</p>
                  <p className="text-orange-300/70 text-[10px] font-medium mt-0.5">Active bookings</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-[5%] pb-20">
        <div className="max-w-7xl mx-auto -mt-10 md:-mt-14 relative z-10 space-y-4">

          {/* ── LOCKED PERIODS (active bookings only) ── */}
          {activeBookedSlots.length > 0 && (
            <div className="fade-up bg-white rounded-[1.75rem] border-2 border-orange-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-orange-50 border-b border-orange-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <Lock size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Locked Periods</h3>
                  <p className="text-[11px] text-orange-500 font-medium mt-0.5">
                    These time windows are occupied by active bookings — they will unlock automatically on completion or cancellation
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {activeBookedSlots.map(slot => (
                  <div key={slot.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <Timer size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {formatDate(slot.bookingWorkStart)}
                          <span className="text-orange-400 mx-1.5">→</span>
                          {formatDate(slot.bookingWorkEnd)}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-slate-500 font-medium">
                            {formatTime(slot.startTime)} – {formatTime(slot.endTime)} daily
                          </span>
                          {slot.bookingCustomerName && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="text-xs text-orange-600 font-bold">{slot.bookingCustomerName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase bg-orange-100 text-orange-700 border border-orange-200">
                      Locked
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ADD AVAILABILITY ── */}
          <div className="fade-up bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden"
            style={{ animationDelay: "60ms" }}>

            <button
              onClick={() => setShowAddForm(v => !v)}
              className="w-full px-6 md:px-8 pt-5 pb-5 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
                  <Plus size={15} className="text-white" strokeWidth={3} />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Add Availability</h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {selectedDates.length > 0
                      ? `${selectedDates.length} date${selectedDates.length > 1 ? "s" : ""} selected`
                      : "Tap to expand and add slots"}
                  </p>
                </div>
              </div>
              <ChevronDown size={16} strokeWidth={2.5} className={`text-slate-400 transition-transform duration-200 ${showAddForm ? "rotate-180" : ""}`} />
            </button>

            {showAddForm && (
              <div className="px-6 md:px-8 pb-6 pt-1 space-y-6 border-t border-slate-100">

                {/* Step 1 — Time */}
                <div className="pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">1</span>
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Set Time Window</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {TIME_PRESETS.map((p, i) => (
                      <button key={i} onClick={() => applyPreset(p, i)}
                        className={`date-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border-2
                          ${presetActive === i
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                          }`}>
                        <Zap size={10} strokeWidth={3} />
                        {p.label}
                        <span className="text-[9px] font-semibold opacity-75">
                          {formatTime(p.start)}–{formatTime(p.end)}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
                      <Clock size={13} className="text-slate-400 flex-shrink-0" />
                      <input type="time" value={startTime}
                        onChange={e => { setStartTime(e.target.value); setPresetActive(null); setError(""); }}
                        className="text-sm font-black text-slate-800 bg-transparent outline-none w-24" />
                    </div>
                    <span className="text-slate-300 font-black text-lg">→</span>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all">
                      <Clock size={13} className="text-slate-400 flex-shrink-0" />
                      <input type="time" value={endTime}
                        onChange={e => { setEndTime(e.target.value); setPresetActive(null); setError(""); }}
                        className="text-sm font-black text-slate-800 bg-transparent outline-none w-24" />
                    </div>
                    {startTime && endTime && startTime < endTime && (
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                        <CheckCircle2 size={11} />
                        {formatTime(startTime)} – {formatTime(endTime)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2 — Dates (10 days) */}
                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">2</span>
                      <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
                        Pick Dates
                        {selectedDates.length > 0 && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] normal-case font-black">
                            {selectedDates.length} selected
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={selectWeekdays}
                        className="date-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
                        <Repeat2 size={10} /> Weekdays
                      </button>
                      <button onClick={selectWeekends}
                        className="date-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
                        <Repeat2 size={10} /> Weekends
                      </button>
                      {selectedDates.length > 0 && (
                        <button onClick={() => setSelectedDates([])}
                          className="date-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-[10px] font-black text-red-500 hover:bg-red-100 transition-colors">
                          <RotateCcw size={10} /> Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 10-day grid — uses pre-computed dateCellStates */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {dateCellStates.map(({ date, locked, conflict: cellConflict, alreadyFree }) => {
                      const { day, date: d, month, isToday } = formatDateShort(date);
                      const isSelected       = selectedDates.includes(date);
                      // A selected date is in conflict if the chosen time overlaps an existing booking/free slot
                      const selectedConflict = isSelected && (locked || cellConflict);

                      return (
                        <button key={date}
                          onClick={() => !locked && toggleDate(date)}
                          disabled={locked}
                          className={`date-btn relative flex flex-col items-center py-2.5 px-1 rounded-xl border-2 select-none
                            ${locked
                              ? "bg-orange-50 border-orange-200 text-orange-500 cursor-not-allowed opacity-50"
                              : selectedConflict
                                ? "bg-red-50 border-red-300 text-red-600"
                                : isSelected
                                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                                  : alreadyFree
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                            }`}>
                          <span className={`text-[8px] font-black uppercase tracking-wider mb-0.5
                            ${isSelected ? "text-blue-200" : locked ? "text-orange-400" : "text-slate-400"}`}>
                            {day}
                          </span>
                          <span className="text-[13px] font-black leading-tight">{d}</span>
                          <span className={`text-[8px] font-medium mt-0.5
                            ${isSelected ? "text-blue-200" : locked ? "text-orange-400" : "text-slate-400"}`}>
                            {month}
                          </span>
                          {isToday && (
                            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border-2
                              ${isSelected ? "bg-white border-blue-600" : "bg-blue-500 border-white"}`} />
                          )}
                          {locked && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400 border-2 border-white" />
                          )}
                          {alreadyFree && !isSelected && !locked && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
                    {[
                      { color: "bg-blue-600",   label: "Selected"     },
                      { color: "bg-emerald-500", label: "Already free" },
                      { color: "bg-orange-400",  label: "Locked (active booking)" },
                      { color: "bg-red-400",     label: "Conflict"     },
                    ].map(({ color, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                {error && (
                  <div className="scale-in flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs font-bold text-red-600">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="scale-in flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                    <p className="text-xs font-bold text-emerald-700">{success}</p>
                  </div>
                )}

                {/* Submit */}
                <button onClick={addSlots} disabled={adding || selectedDates.length === 0}
                  className={`w-full py-4 rounded-xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2
                    ${adding || selectedDates.length === 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-[#1E293B] hover:bg-slate-700 text-white shadow-lg shadow-slate-200 active:scale-[0.98]"
                    }`}>
                  {adding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding slots...
                    </>
                  ) : selectedDates.length === 0 ? (
                    <>
                      <Plus size={15} strokeWidth={3} />
                      Select dates to continue
                    </>
                  ) : selectedDates.length < 3 ? (
                    <span className="flex flex-col items-center gap-0.5">
                      <span className="flex items-center gap-1.5">
                        <Plus size={15} strokeWidth={3} />
                        Add {selectedDates.length} Slot{selectedDates.length > 1 ? "s" : ""} · {formatTime(startTime)} – {formatTime(endTime)}
                      </span>
                      <span className="text-[10px] font-semibold opacity-60">
                        💡 Adding {3 - selectedDates.length} more day{3 - selectedDates.length > 1 ? "s" : ""} improves your booking chances
                      </span>
                    </span>
                  ) : (
                    <>
                      <Plus size={15} strokeWidth={3} />
                      {`Add ${selectedDates.length} Slots · ${formatTime(startTime)} – ${formatTime(endTime)}`}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ── SLOTS LIST ── */}
          <div className="fade-up bg-white rounded-[1.75rem] border border-slate-200 shadow-sm overflow-hidden"
            style={{ animationDelay: "120ms" }}>

            {/* Header */}
            <div className="px-6 md:px-8 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex gap-2">
                  {["UPCOMING", "PAST"].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all
                        ${tab === t
                          ? "bg-[#1E293B] text-white border-[#1E293B]"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}>
                      {t}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black
                        ${tab === t ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                        {t === "UPCOMING" ? upcoming.length : past.length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {["ALL", "AVAILABLE", "BOOKED"].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all
                        ${filterStatus === f
                          ? f === "AVAILABLE" ? "bg-emerald-500 text-white"
                          : f === "BOOKED"    ? "bg-yellow-500 text-white"
                          : "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}>
                      {f}
                    </button>
                  ))}

                  {tab === "PAST" && pastCleanableCount > 0 && (
                    <button
                      onClick={() => setConfirmClean(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-[10px] font-black text-red-500 hover:bg-red-100 transition-all active:scale-95">
                      <Trash2 size={10} />
                      Clean ({pastCleanableCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Confirm clean dialog */}
              {confirmClean && (
                <div className="scale-in mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                  <p className="text-xs font-black text-red-700 mb-1">
                    Delete {pastCleanableCount} past available slot{pastCleanableCount > 1 ? "s" : ""}?
                  </p>
                  <p className="text-[11px] text-red-400 font-medium mb-3">
                    Only unbooked past slots will be removed. Booked slots are kept for records.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={deletePastSlots}
                      disabled={deletingPast}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black transition-all disabled:opacity-50">
                      {deletingPast
                        ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Cleaning...</>
                        : <><Trash2 size={11} /> Yes, clean up</>
                      }
                    </button>
                    <button
                      onClick={() => setConfirmClean(false)}
                      className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-black hover:bg-red-50 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                <Search size={13} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by date or time..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 text-xs font-medium text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                    <XCircle size={13} />
                  </button>
                )}
              </div>

              <p className="text-[10px] font-semibold text-slate-400 mt-2.5">
                Showing {Math.min(paginatedSlots.length, filteredSlots.length)} of {filteredSlots.length} slots
              </p>
            </div>

            {/* Empty state */}
            {filteredSlots.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <CalendarDays size={26} className="text-slate-300" />
                </div>
                <p className="text-sm font-black text-slate-700">
                  {searchQuery ? "No results found" : `No ${tab.toLowerCase()} slots`}
                </p>
                <p className="text-xs text-slate-400 mt-1.5 max-w-xs">
                  {searchQuery
                    ? "Try a different search term or clear the filter"
                    : tab === "UPCOMING"
                      ? "Add your working hours above to start accepting bookings"
                      : "Your completed slots will appear here"
                  }
                </p>
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); setFilterStatus("ALL"); }}
                    className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-black hover:bg-slate-200 transition-all">
                    <RotateCcw size={11} /> Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Slot rows */}
            {filteredSlots.length > 0 && (
              <div className="divide-y divide-slate-100">
                {paginatedSlots.map((slot) => (
                  <div key={slot.id}>
                    <div
                      className={`slot-row px-6 md:px-8 py-4 flex items-center justify-between gap-4
                        ${slot.active ? "hover:bg-emerald-50/30" : "hover:bg-yellow-50/30"}`}>

                      <div className="flex items-center gap-4 min-w-0">
                        {/* Date block */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center border-2
                          ${slot.active ? "bg-emerald-50 border-emerald-200" : "bg-yellow-50 border-yellow-200"}`}>
                          <span className={`text-[8px] font-black uppercase tracking-wider
                            ${slot.active ? "text-emerald-500" : "text-yellow-500"}`}>
                            {new Date(slot.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short" })}
                          </span>
                          <span className={`text-lg font-black leading-none
                            ${slot.active ? "text-emerald-700" : "text-yellow-700"}`}>
                            {new Date(slot.date + "T00:00:00").getDate()}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-black text-slate-900">
                              {new Date(slot.date + "T00:00:00").toLocaleDateString("en-IN", {
                                weekday: "short", day: "numeric", month: "short", year: "numeric"
                              })}
                            </p>
                            {slot.date === today && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[9px] font-black uppercase">Today</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <Clock size={10} /> {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                              <Timer size={10} /> {formatDuration(slot.durationMinutes)}
                            </span>
                          </div>

                          {!slot.active && slot.bookingWorkStart && slot.bookingWorkEnd && (
                            <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-yellow-50 border border-yellow-200 rounded-lg w-fit">
                              <CalendarDays size={9} className="text-yellow-600 flex-shrink-0" />
                              <span className="text-[9px] font-black text-yellow-700">
                                {formatDate(slot.bookingWorkStart)} → {formatDate(slot.bookingWorkEnd)}
                                {slot.bookingCustomerName && ` · ${slot.bookingCustomerName}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side — status pill + action */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border
                          ${slot.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}>
                          {slot.active ? "Available" : "Booked"}
                        </span>

                        {/* Delete button — only for active (free) slots */}
                        {slot.active ? (
                          <button
                            onClick={() => setConfirmDeleteSlot(slot)}
                            disabled={deletingSlotId === slot.id}
                            className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all active:scale-90">
                            {deletingSlotId === slot.id
                              ? <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                              : <Trash2 size={12} />
                            }
                          </button>
                        ) : (
                          /* Lock icon — booked slots cannot be deleted */
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-yellow-200 bg-yellow-50 text-yellow-400">
                            <Lock size={12} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inline confirm delete — expands below the row */}
                    {confirmDeleteSlot?.id === slot.id && (
                      <div className="scale-in mx-6 md:mx-8 mb-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-xs font-black text-red-700">Remove this slot?</p>
                          <p className="text-[11px] text-red-400 font-medium mt-0.5">
                            {formatDate(slot.date)} · {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteSlot(slot)}
                            disabled={deletingSlotId === slot.id}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black transition-all disabled:opacity-50 active:scale-95">
                            {deletingSlotId === slot.id
                              ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Removing...</>
                              : <><Trash2 size={11} /> Yes, remove</>
                            }
                          </button>
                          <button
                            onClick={() => setConfirmDeleteSlot(null)}
                            className="px-3.5 py-2 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-black hover:bg-red-50 transition-all active:scale-95">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMore && (
              <div className="px-6 py-5 border-t border-slate-100 flex justify-center">
                <button onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-100 transition-all active:scale-95">
                  <ChevronDown size={13} strokeWidth={3} />
                  Load more · {filteredSlots.length - paginatedSlots.length} remaining
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProviderAvailability;