import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/admin", icon: "📊" },
  { name: "Providers", path: "/admin/providers", icon: "👨‍🔧" },
  { name: "Bookings", path: "/admin/bookings", icon: "📅" },
  { name: "Payout Requests", path: "/admin/payouts/requests", icon: "💰" },
  { name: "Payout History", path: "/admin/payouts/history", icon: "📜" },
  { name: "Reports", path: "/admin/reports", icon: "📈" },
];

export default function AdminSidebar() {
  return (
    <div
      className="
        w-64 hidden md:flex flex-col
        bg-white/80 backdrop-blur-md
        border-r border-gray-200
        p-5
      "
    >
      {/* LOGO */}
      <h2 className="text-xl font-semibold text-blue-600 mb-8">
        TheHomemakers
      </h2>

      {/* NAV */}
      <nav className="flex flex-col gap-2">

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              flex items-center gap-3
              px-4 py-2 rounded-xl text-sm font-medium
              transition-all duration-200

              ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }
              `
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}

      </nav>

      {/* FOOTER (optional but clean UX) */}
      <div className="mt-auto pt-6">
        <div className="text-xs text-gray-400">
          Admin Panel v1.0
        </div>
      </div>

    </div>
  );
}