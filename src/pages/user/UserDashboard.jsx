import { useAuth } from '../../context/AuthContext';
import Logout from '../../auth/Logout';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getWalletBalance } from "../../api/walletApi";

function UserDashboard() {

  const { role } = useAuth();

  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch wallet on load
  useEffect(() => {
    fetchWallet();
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

  return (
    <div style={{ padding: '20px' }}>

      <h2>User Dashboard</h2>
      <p>Role: {role}</p>

      <hr />

      {/* 🔥 WALLET CARD */}
      <div style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9"
      }}>
        <h3>Wallet Balance</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            ₹ {wallet}
          </p>
        )}
      </div>

      {/* 🔥 NAVIGATION */}
      <ul>
        <li>
          <Link to="/user/wallet">Recharge Wallet</Link>
        </li>
        <li>
          <Link to="/user/bookings">My Bookings</Link>
        </li>
        <li>
          <Link to="/user/attendance">Attendance Approval</Link>
        </li>
        <li>
          <Link to="/user/services">Book Service</Link>
        </li>
        <li>
          <Link to="/user/payments">Pending Payments</Link>
        </li>
        <li>  
        <Link to="/user/payments/history">Payment History</Link>
        </li>
      </ul>

      <Logout />

    </div>
  );
}

export default UserDashboard;