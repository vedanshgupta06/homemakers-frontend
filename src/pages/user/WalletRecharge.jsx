import { useState } from "react";
import api from "../../api/axios";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

function WalletRecharge() {

  const [amount, setAmount] = useState("");

  const recharge = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      const res = await api.post(
        `/api/payments/wallet/recharge/${amount}?userId=1`
      );

      window.location.href = res.data.url;

    } catch (err) {
      console.error("Recharge failed:", err);
      alert("Recharge failed");
    }
  };

  const quickAmounts = [100, 200, 500, 1000];

  return (
    <Container>

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Recharge Wallet 💳
        </h2>
        <p className="text-gray-500 text-sm">
          Add money securely to your wallet
        </p>
      </div>

      {/* CARD */}
      <Card className="max-w-md mx-auto">

        {/* INPUT */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">
            Enter Amount
          </label>

          <input
            type="number"
            placeholder="₹ Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* QUICK AMOUNTS */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-blue-50 hover:border-blue-400 transition"
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* CTA BUTTON */}
        <button
          onClick={recharge}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition shadow-md"
        >
          Add Money
        </button>

      </Card>

    </Container>
  );
}

export default WalletRecharge;