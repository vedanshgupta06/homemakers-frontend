import { Link } from "react-router-dom";

function ProviderDashboard() {
  return (
    <div>
      <h2>Provider Dashboard</h2>

      <ul>
        <li><Link to="/provider/profile">My Profile</Link></li>
        <li><Link to="/provider/availability">Manage Availability</Link></li>
        <li><Link to="/provider/pricing">Set Pricing</Link></li>
        <li><Link to="/provider/bookings">View Bookings</Link></li>
        <li><Link to="/provider/earnings">My Earnings</Link></li>
        <li><Link to="/provider/payouts">My Payouts</Link></li>
        <li><Link to="/provider/deductions">My Deductions</Link></li> 

      </ul>
    </div>
  );
}

export default ProviderDashboard;
