import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Wallet, Zap, ArrowRight, IndianRupee, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function WalletRecharge() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  const quickAmounts = [100, 200, 500, 1000];
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  useEffect(() => {
    api.get("/api/user/wallet/balance")
      .then(res => setBalance(res.data))
      .catch(err => console.error("Failed to load balance", err));
  }, []);

  const rechargeStripe = async () => {
    const res = await api.post(`/api/payments/wallet/recharge/${amount}`);
    window.location.href = res.data.url;
  };

  const rechargeRazorpay = async () => {
    const orderRes = await api.post(`/api/razorpay/wallet/order/${amount}`);
    const { orderId, amount: orderAmount } = orderRes.data;

    const options = {
      key:         razorpayKeyId,
      amount:      orderAmount,
      currency:    "INR",
      order_id:    orderId,
      name:        "Homemakers",
      description: "Wallet Recharge",
      handler: async (response) => {
        try {
          await api.post("/api/razorpay/wallet/verify", response);
          navigate("/user?wallet=success");
        } catch {
          alert("Payment verification failed. Contact support.");
          setLoading(false);
        }
      },
      theme: { color: "#2563EB" },
      modal: { ondismiss: () => setLoading(false) },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  const recharge = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    try {
      if (method === "stripe") await rechargeStripe();
      else await rechargeRazorpay();
    } catch (err) {
      console.error("Recharge failed:", err);
      setLoading(false);
    }
  };

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
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Secure Payments</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            Recharge <span className="text-blue-400">Wallet</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 font-medium max-w-xl">
            Add money securely to your wallet and pay for services instantly.
          </p>

          {/* BALANCE BADGE */}
          <div className="mt-5 inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Wallet size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Balance</p>
              {balance === null ? (
                <div className="h-5 w-20 bg-white/10 rounded-full animate-pulse mt-0.5" />
              ) : (
                <p className="text-white font-black text-lg leading-tight">
                  ₹{balance.toFixed(0)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-3 md:px-[5%] pb-28">
        <div className="max-w-md mx-auto -mt-8 md:-mt-12 relative z-10 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 p-6 md:p-10">

          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Wallet size={14} className="text-white" />
            </div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Add Money</h3>
          </div>
          <p className="text-slate-400 text-xs ml-11 mb-8">Choose a quick amount or enter custom</p>

          {/* QUICK AMOUNTS */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`py-3 rounded-2xl text-sm font-black transition-all duration-150 border-2
                  ${Number(amount) === amt
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105"
                    : "bg-slate-50 text-slate-700 border-slate-100 hover:border-blue-200 hover:bg-white"
                  }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or enter custom</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* CUSTOM INPUT */}
          <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 mb-6
            ${amount && !quickAmounts.includes(Number(amount))
              ? "border-blue-200 bg-blue-50/30 shadow-sm"
              : "border-slate-100 bg-slate-50"
            }`}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <IndianRupee size={15} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Custom Amount</p>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-medium"
              />
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div className="mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Payment Method</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "stripe",   label: "💳 Card", sub: "Debit / Credit"         },
                { id: "razorpay", label: "📱 UPI",  sub: "PhonePe · GPay · Paytm" },
              ].map(({ id, label, sub }) => (
                <button
                  key={id}
                  onClick={() => setMethod(id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all duration-150
                    ${method === id
                      ? "border-blue-600 bg-blue-50 shadow-sm"
                      : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    }`}
                >
                  <p className={`text-xs font-black ${method === id ? "text-blue-700" : "text-slate-600"}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* TOTAL PANEL */}
          {amount > 0 && (
            <div className="flex items-center justify-between p-5 bg-[#1E293B] rounded-2xl mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Adding to Wallet</p>
                <p className="text-white text-sm font-bold">
                  via {method === "stripe" ? "Card" : "UPI / Razorpay"}
                </p>
                {balance !== null && amount > 0 && (
                  <p className="text-slate-400 text-[10px] font-medium mt-1">
                    New balance: ₹{(balance + Number(amount)).toFixed(0)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400 font-black text-xs">₹</span>
                <span className="text-white font-black text-2xl">{amount}</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={recharge}
            disabled={!amount || amount <= 0 || loading}
            className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2
              ${!amount || amount <= 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : loading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 active:scale-95"
              }`}
          >
            {loading ? (
              <>
                <Zap size={14} className="animate-pulse" />
                REDIRECTING...
              </>
            ) : (
              <>
                <Wallet size={14} />
                {amount > 0 ? `ADD ₹${amount} TO WALLET` : "SELECT AN AMOUNT"}
                {amount > 0 && <ArrowRight size={14} strokeWidth={3} />}
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-300 font-medium mt-4">
            🔒 Secured by {method === "stripe" ? "Stripe" : "Razorpay"} · 256-bit encryption
          </p>

        </div>
      </div>
    </div>
  );
}

export default WalletRecharge;