import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { IndianRupee, Wallet, Clock, CheckCircle2, CreditCard, ArrowLeft } from "lucide-react";

function PaymentRequired() {
  const [bookings, setBookings]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [payingId, setPayingId]             = useState(null);
  const [selectedMethod, setSelectedMethod] = useState({});
  const [error, setError]                   = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/bookings/user/payment-required");
      const all = (res.data || []).filter(b =>
        (b.status || "").toUpperCase() !== "CANCELLED"
      );
      setBookings(all);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Failed to load payments. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const pay = async (bookingId) => {
    const method = selectedMethod[bookingId] || "stripe";
    setPayingId(bookingId);
    setError(null);
    try {
      if (method === "stripe") {
        const res = await api.post(`/api/payments/booking/${bookingId}`);
        window.location.href = res.data.url;
      } else {
        const res = await api.post(`/api/razorpay/order/${bookingId}`);
        openRazorpay(res.data, bookingId);
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setError(err.response?.data?.message || "Payment failed. Please try again.");
      setPayingId(null);
    }
  };

  const openRazorpay = (data, bookingId) => {
    const options = {
      key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:      data.amount,
      currency:    "INR",
      order_id:    data.orderId,
      name:        "Homemakers",
      description: `Booking #${bookingId}`,
      handler: async (response) => {
        try {
          await api.post("/api/razorpay/verify", response);
          fetchBookings();
        } catch {
          setError("Payment verification failed. Please contact support.");
        }
      },
      prefill: { contact: "", email: "" },
      theme:   { color: "#2563EB" },
      modal:   { ondismiss: () => setPayingId(null) },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setPayingId(null);
  };

  const totalDue       = bookings.reduce((sum, b) => sum + (b.finalPayableAmount || 0), 0);
  const pendingCount   = bookings.filter(b => b.finalPayableAmount > 0).length;
  const walletPaidCount = bookings.filter(b => b.finalPayableAmount === 0).length;
  const sorted         = [...bookings].sort((a, b) => b.finalPayableAmount - a.finalPayableAmount);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-20 md:pt-20 md:pb-24 px-3 md:px-[5%] relative overflow-hidden">
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
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Billing</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Payments <span className="text-blue-400">Dashboard</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl">
            Manage and complete your pending payments.
          </p>

          {!loading && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <IndianRupee size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">₹{totalDue} Total Due</span>
              </div>
              {pendingCount > 0 && (
                <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
                  <Clock size={12} className="text-yellow-300" />
                  <span className="text-yellow-200 text-xs font-bold">{pendingCount} Pending</span>
                </div>
              )}
              {walletPaidCount > 0 && (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5">
                  <CheckCircle2 size={12} className="text-emerald-300" />
                  <span className="text-emerald-200 text-xs font-bold">{walletPaidCount} Wallet Paid</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-3 md:px-[5%] pb-16">
        <div className="max-w-7xl mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-4 md:p-10 overflow-hidden">

          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <CreditCard size={14} className="text-white" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Payment History</h3>
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-8">Highest due amounts appear first</p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm font-bold text-red-600">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading && bookings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <p className="text-base font-black text-slate-800 uppercase tracking-tight">All Paid Up</p>
              <p className="text-sm text-slate-400 mt-2">You have no pending dues. Great job!</p>
            </div>
          )}

          {/* LIST */}
          {!loading && sorted.length > 0 && (
            <div className="space-y-4">
              {sorted.map((b) => {
                const fullyPaid = b.finalPayableAmount === 0;
                const isPaying  = payingId === b.id;

                return (
                  <div
                    key={b.id}
                    className={`rounded-2xl border-2 p-4 md:p-5 transition-all duration-200
                      ${fullyPaid
                        ? "border-emerald-100 bg-emerald-50/30"
                        : "border-yellow-100 bg-yellow-50/20"
                      }`}
                  >
                    {/* TOP ROW */}
                    <div className="flex items-center justify-between mb-4 gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                          ${fullyPaid ? "bg-emerald-500" : "bg-yellow-500"}`}>
                          {fullyPaid
                            ? <CheckCircle2 size={16} className="text-white" />
                            : <Clock size={16} className="text-white" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800">Booking #{b.id}</p>
                          <span className={`text-[10px] font-black uppercase tracking-wider
                            ${fullyPaid ? "text-emerald-600" : "text-yellow-600"}`}>
                            {fullyPaid ? "Wallet Paid" : "Payment Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">To Pay</p>
                        <p className={`text-xl font-black ${fullyPaid ? "text-emerald-600" : "text-slate-900"}`}>
                          ₹{b.finalPayableAmount}
                        </p>
                      </div>
                    </div>

                    {/* PRICE BREAKDOWN */}
                    <div className="bg-white rounded-xl p-3 mb-4 space-y-2 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <IndianRupee size={11} /> Total Amount
                        </span>
                        <span className="text-xs font-bold text-slate-800">₹{b.totalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Wallet size={11} /> Wallet Used
                        </span>
                        <span className="text-xs font-bold text-emerald-600">− ₹{b.walletUsed || 0}</span>
                      </div>
                      <div className="h-px bg-slate-100" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Remaining</span>
                        <span className="text-xs font-black text-slate-900">₹{b.finalPayableAmount}</span>
                      </div>
                    </div>

                    {/* PAYMENT METHOD SELECTOR */}
                    {!fullyPaid && (
                      <div className="flex gap-2 mb-3">
                        {[
                          { id: "stripe",   label: "💳 Card", sub: "Debit / Credit"         },
                          { id: "razorpay", label: "📱 UPI",  sub: "PhonePe · GPay · Paytm" },
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedMethod(prev => ({ ...prev, [b.id]: method.id }))}
                            className={`flex-1 py-2.5 px-3 rounded-xl border-2 transition-all text-left
                              ${(selectedMethod[b.id] || "stripe") === method.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 bg-white"
                              }`}
                          >
                            <p className={`text-xs font-black
                              ${(selectedMethod[b.id] || "stripe") === method.id
                                ? "text-blue-600" : "text-slate-500"}`}>
                              {method.label}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">{method.sub}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* ACTION */}
                    {!fullyPaid ? (
                      <button
                        onClick={() => pay(b.id)}
                        disabled={isPaying}
                        className={`w-full py-3 rounded-xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2
                          ${isPaying
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-95"
                          }`}
                      >
                        <CreditCard size={14} />
                        {isPaying ? "REDIRECTING..." : `PAY ₹${b.finalPayableAmount}`}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 size={15} strokeWidth={2.5} />
                        <span className="text-xs font-black uppercase tracking-wider">Paid via Wallet</span>
                      </div>
                    )}
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

export default PaymentRequired;