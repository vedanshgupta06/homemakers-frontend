import { useEffect, useState } from "react";
import {
  getMyPayouts,
  requestPayout,
  getWalletSummary,
} from "../../api/providerPayoutApi";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function ProviderPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [payoutRes, walletRes] = await Promise.all([
        getMyPayouts(),
        getWalletSummary(),
      ]);

      setPayouts(payoutRes.data || []);
      setWallet(walletRes.data || {});
    } catch (err) {
      console.error("Failed to load payouts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    try {
      await requestPayout();
      setMessage("Payout request submitted. Processing by admin.");
      loadData();
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
        err.message ||
        "Failed to request withdrawal"
      );
    }
  };

  const formatCurrency = (val) =>
    `₹ ${Number(val || 0).toFixed(2)}`;

  if (loading) {
    return (
      <Container>
        <p className="text-gray-500">Loading payouts...</p>
      </Container>
    );
  }

  const available = wallet?.available || 0;
  const requested = wallet?.requested || 0;
  const paid = wallet?.paid || 0;
  const canWithdraw = wallet?.canWithdraw ?? false;
  const nextEligible = wallet?.nextEligibleWithdrawalDate;

  return (
    <Container>
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">

        {/* 🔥 HEADER */}
        <div className="relative">
          <div className="
            absolute -top-16 -left-10 w-72 h-72 
            bg-pink-400/20 blur-3xl rounded-full
            pointer-events-none
          "></div>

          <div className="relative z-10">
            <h2 className="
              text-3xl font-bold 
              bg-brand-gradient bg-clip-text text-transparent
            ">
              Withdraw Earnings 💸
            </h2>

            <p className="text-textSub mt-2">
              Manage your payouts and withdrawal requests
            </p>
          </div>
        </div>

        {/* 💰 WALLET CARD */}
        <Card className="p-6 space-y-3">

          <p className="text-sm text-gray-500">Available Balance</p>
          <h2 className="text-3xl font-bold text-green-600">
            {formatCurrency(available)}
          </h2>

          {requested > 0 && (
            <p className="text-yellow-600 text-sm">
              Processing: {formatCurrency(requested)}
            </p>
          )}

          <p className="text-gray-500 text-sm">
            Total Paid: {formatCurrency(paid)}
          </p>

          <Button
            className="mt-3"
            onClick={handleRequest}
            disabled={!canWithdraw || available <= 0}
          >
            {available <= 0
              ? "No balance available"
              : !canWithdraw
              ? "Withdrawal locked (7 days)"
              : "Request Withdrawal"}
          </Button>

          {!canWithdraw && nextEligible && (
            <p className="text-red-500 text-sm mt-2">
              🔒 Next withdrawal on{" "}
              {new Date(nextEligible).toLocaleDateString()}
            </p>
          )}

          {message && (
            <p className="text-sm font-medium mt-2">
              {message}
            </p>
          )}

        </Card>

        {/* 📋 HISTORY */}
        <Card>
          <h3 className="font-semibold mb-4">
            Withdrawal History
          </h3>

          {payouts.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No withdrawals yet
            </p>
          ) : (
            <div className="space-y-4">

              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="
                    p-4 rounded-xl border
                    hover:shadow-md hover:scale-[1.01]
                    transition-all duration-300
                  "
                >

                  <div className="flex justify-between items-center">

                    <div>
                      <p className="font-semibold">
                        {formatCurrency(p.amount)}
                      </p>

                      <p className="text-sm text-gray-500">
                        Created: {p.createdAt?.slice(0, 10)}
                      </p>

                      <p className="text-sm text-gray-500">
                        Paid: {p.paidAt ? p.paidAt.slice(0, 10) : "-"}
                      </p>
                    </div>

                    <StatusBadge status={p.status} />

                  </div>

                </div>
              ))}

            </div>
          )}
        </Card>

      </div>
    </Container>
  );
}

/* 🎯 STATUS BADGE */
const StatusBadge = ({ status }) => {
  const styles = {
    INITIATED: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    PAID: "bg-green-100 text-green-700 border border-green-200",
    REJECTED: "bg-red-100 text-red-600 border border-red-200",
  };

  const normalize = (s) => (s || "").toUpperCase().trim();

  const key = normalize(status);

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-medium border
        ${styles[key] || "bg-gray-100 text-gray-600"}
      `}
    >
      {key === "INITIATED" ? "Processing" : key}
    </span>
  );
};