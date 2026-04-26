import { useState } from "react";
import { Star, X } from "lucide-react";
import api from "../api/axios";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function RatingModal({ booking, onClose, onSubmitted }) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState("");

  const providerName =
    booking.provider?.user?.name ||
    booking.provider?.user?.email?.split("@")[0] ||
    "Provider";

  const formatServices = (services) => {
    if (!services?.length) return "Service";
    return services
      .map(s => s.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()))
      .join(", ");
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    setError("");
    try {
      await api.post(`/api/reviews/booking/${booking.id}`, { rating, comment });
      setSubmitted(true);
      setTimeout(() => { onSubmitted?.(); onClose(); }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">

        {!submitted ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">
                  Booking #{booking.id}
                </p>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Rate Your Experience
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X size={14} className="text-slate-600" />
              </button>
            </div>

            {/* Provider info */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm flex-shrink-0">
                {providerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{providerName}</p>
                <p className="text-xs text-slate-400 font-medium">
                  {formatServices(booking.services)}
                </p>
              </div>
            </div>

            {/* Stars */}
            <div className="mb-5">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
                Your Rating
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={32}
                      className="transition-colors"
                      style={{
                        fill: star <= (hovered || rating) ? "#F59E0B" : "transparent",
                        color: star <= (hovered || rating) ? "#F59E0B" : "#CBD5E1",
                        strokeWidth: 1.5,
                      }}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 mt-2 h-4">
                {LABELS[hovered || rating]}
              </p>
            </div>

            {/* Comment */}
            <div className="mb-5">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Comment{" "}
                <span className="text-slate-300 normal-case font-medium">(optional)</span>
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the service? Any feedback for the provider..."
                rows={3}
                className="w-full border-2 border-slate-100 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-blue-200 transition-colors text-slate-800 placeholder:text-slate-300"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 font-medium mb-3 px-1">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-black uppercase tracking-wider text-slate-400 border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={!rating || loading}
                className={`flex-[2] py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95
                  ${rating && !loading
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
              >
                {loading ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </>
        ) : (
          /* Success */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Star size={28} className="text-emerald-500 fill-emerald-500" />
            </div>
            <p className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
              Thanks for the feedback!
            </p>
            <p className="text-sm text-slate-400">
              Your rating helps other users choose better.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}