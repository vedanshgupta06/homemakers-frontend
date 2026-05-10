import { useState } from "react";
import { Wallet, IndianRupee } from "lucide-react";
import api from "../../api/axios";

export default function WalletConsentModal({ booking, onConsentDone }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const walletEligible  = booking.walletEligible ?? 0;
  const totalPrice      = booking.totalPrice ?? 0;
  const payAfterWallet  = totalPrice - walletEligible;

  const handleConsent = async (useWallet) => {
    if (loading || submitted) return;
    setLoading(true);
    setSubmitted(true);
    try {
      const res = await api.post(
        `/api/bookings/${booking.id}/wallet-consent?useWallet=${useWallet}`
      );
      onConsentDone(res.data);
    } catch (err) {
      setSubmitted(false);
      setLoading(false);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Use wallet balance?</h2>
            <p className="text-xs text-slate-400 font-medium">Choose how to pay for this booking</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 font-medium">Booking total</span>
            <span className="text-sm font-black text-slate-800">₹{totalPrice.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-emerald-600 font-medium">Wallet balance</span>
            <span className="text-sm font-black text-emerald-600">− ₹{walletEligible.toFixed(0)}</span>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-slate-700">You'll pay</span>
            <div className="flex items-center gap-1">
              <IndianRupee size={12} className="text-slate-800" />
              <span className="text-lg font-black text-slate-900">{payAfterWallet.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => handleConsent(true)}
          disabled={loading || submitted || walletEligible <= 0}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400
                     text-white font-black py-3.5 rounded-2xl mb-3 transition-all active:scale-95 text-sm"
        >
          {loading ? "Processing..." : `Apply ₹${walletEligible.toFixed(0)} from wallet`}
        </button>

        <button
          onClick={() => handleConsent(false)}
          disabled={loading || submitted}
          className="w-full border-2 border-slate-200 hover:bg-slate-50 disabled:opacity-50
                     text-slate-700 font-black py-3.5 rounded-2xl transition-all active:scale-95 text-sm"
        >
          {loading ? "Processing..." : `Pay full ₹${totalPrice.toFixed(0)} via UPI / card`}
        </button>

        {walletEligible <= 0 && (
          <p className="text-xs text-slate-400 text-center mt-3 font-medium">
            No wallet balance available — you'll pay the full amount.
          </p>
        )}

      </div>
    </div>
  );
}