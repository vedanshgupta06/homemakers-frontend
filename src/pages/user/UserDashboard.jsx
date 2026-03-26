import { useAuth } from '../../context/AuthContext';
import Logout from '../../auth/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getWalletBalance } from "../../api/walletApi";
import api from "../../api/axios";

import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";

function UserDashboard() {

  const { role } = useAuth();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchWallet();
    fetchProfile();
  }, []);

  const fetchWallet = async () => {
    try {
      const balance = await getWalletBalance();
      setWallet(balance);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  const actions = [
    { title: "Recharge Wallet", path: "/user/wallet" },
    { title: "My Bookings", path: "/user/bookings" },
    { title: "Attendance Approval", path: "/user/attendance" },
    { title: "Book Service", path: "/user/services" },
    { title: "Pending Payments", path: "/user/payments" },
    { title: "Payment History", path: "/user/payments/history" },
  ];

  return (
    <Container>

      {/* 🔥 HEADER */}
      <div className="relative mb-10 animate-fadeIn">

        {/* Glow */}
        <div className="absolute -top-16 -left-10 w-72 h-72 bg-pink-400/20 blur-3xl rounded-full"></div>

        <div className="relative">

          <h2 className="
            text-3xl font-bold 
            bg-brand-gradient bg-clip-text text-transparent
          ">
            Welcome back, {user?.name || "User"} 👋
          </h2>

          <p className="text-textSub mt-2">
            Manage your home services effortlessly
          </p>

        </div>

      </div>

      {/* 💳 WALLET CARD */}
      <Card className="
        mb-8 flex justify-between items-center
        bg-brand-gradient text-white shadow-glow
        animate-fadeIn
      ">

        <div>
          <p className="text-sm opacity-80">Wallet Balance</p>

          {loading ? (
            <p className="opacity-70">Loading...</p>
          ) : (
            <p className="text-3xl font-bold">
              ₹ {wallet}
            </p>
          )}
        </div>

        <Link
          to="/user/wallet"
          className="
            bg-white/90 text-gray-800
            px-4 py-2 rounded-lg text-sm font-medium

            hover:bg-white hover:scale-105
            transition-all duration-300
          "
        >
          Recharge →
        </Link>

      </Card>

      {/* ⚡ ACTION GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

        {actions.map((item, i) => (
          <Card
            key={i}
            onClick={() => navigate(item.path)}
            className="group animate-fadeIn"
          >

            <p className="
              text-sm font-medium text-textMain
              transition-all duration-300
              group-hover:text-pink-500
            ">
              {item.title}
            </p>

            {/* underline animation */}
            <div className="
              mt-2 h-[2px] w-0 
              bg-brand-gradient
              transition-all duration-300
              group-hover:w-full
            " />

          </Card>
        ))}

      </div>

      {/* LOGOUT */}
      <div className="mt-10">
        <Logout />
      </div>

    </Container>
  );
}

export default UserDashboard;
