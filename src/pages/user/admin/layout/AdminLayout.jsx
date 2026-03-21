import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();

 const menu = [
  { name: "Dashboard", path: "/admin" },
  { name: "Providers", path: "/admin/providers" },
  { name: "Bookings", path: "/admin/bookings" },

  { name: "Payout Requests", path: "/admin/payouts/requests" },
  { name: "Payout History", path: "/admin/payouts/history" },

  { name: "Reports", path: "/admin/reports" },
];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={sidebar}>
        <h2 style={{ marginBottom: "30px" }}>Admin Panel</h2>

        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...menuItem,
              background:
                location.pathname === item.path
                  ? "#2563eb"
                  : "transparent",
              color:
                location.pathname === item.path
                  ? "#fff"
                  : "#111827",
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>
        <Outlet />
      </div>
    </div>
  );
};

const sidebar = {
  width: "240px",
  background: "#ffffff",
  padding: "20px",
  borderRight: "1px solid #e5e7eb",
};

const menuItem = {
  display: "block",
  padding: "12px",
  borderRadius: "8px",
  marginBottom: "10px",
  textDecoration: "none",
  fontWeight: "500",
};

export default AdminLayout;
