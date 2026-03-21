import { useState } from "react";
import api from "../../api/axios";

function WalletRecharge() {

  const [amount, setAmount] = useState("");

  const recharge = async () => {
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recharge Wallet</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      <button onClick={recharge}>
        Add Money
      </button>
    </div>
  );
}

export default WalletRecharge;