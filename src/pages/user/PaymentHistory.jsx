import { useEffect, useState } from "react";
import api from "../../api/axios";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

function PaymentHistory() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/payments/history")
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "FAILED":
        return "bg-red-100 text-red-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const totalSpent = history
    .filter(txn => txn.status === "SUCCESS")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const successCount = history.filter(txn => txn.status === "SUCCESS").length;

  return (
    <Container>

      {/* 🔥 HEADER + STATS */}
      <div className="mb-8 space-y-6">

        {/* HEADER */}
        <div>
         <h2 className="
          text-3xl font-bold
          bg-brand-gradient bg-clip-text text-transparent
        ">
            Payment History 
          </h2>

          <p className="text-gray-500 mt-1">
            Track all your transactions
          </p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-semibold">₹ {totalSpent}</p>
          </div>

          <div className="p-4 rounded-xl bg-green-100/60">
            <p className="text-sm text-green-700">Successful</p>
            <p className="text-xl font-semibold text-green-800">
              {successCount}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-100/60">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-xl font-semibold text-gray-800">
              {history.length}
            </p>
          </div>

        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500">Loading transactions...</p>
      )}

      {/* EMPTY */}
      {!loading && history.length === 0 && (
        <div className="text-center py-20">

          <p className="text-lg font-medium">
            No transactions yet 💸
          </p>

          <p className="text-gray-400 mt-2">
            Your payments will appear here
          </p>

        </div>
      )}

      {/* LIST */}
      <div className="space-y-5">

        {history
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(txn => (

          <Card
            key={txn.id}
            className="flex justify-between items-center"
          >

            {/* LEFT */}
            <div className="flex items-center gap-4">

              {/* ICON STYLE CIRCLE */}
              <div className="
                w-10 h-10 rounded-full flex items-center justify-center
                bg-gradient-to-r from-pink-500 to-indigo-500 text-white
                font-bold
              ">
                ₹
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  ₹{txn.amount}
                </p>

                <p className="text-sm text-gray-500">
                  {txn.description || "Service Payment"}
                </p>
              </div>

            </div>

            {/* RIGHT */}
            <div className="text-right">

              <span className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${getStatusStyle(txn.status)}
              `}>
                {txn.status}
              </span>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(txn.createdAt).toLocaleString()}
              </p>

              <p className="text-xs text-gray-400">
                {txn.method}
              </p>

            </div>

          </Card>

        ))}

      </div>

    </Container>
  );
}

export default PaymentHistory;