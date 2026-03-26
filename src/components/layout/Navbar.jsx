import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";

function Navbar() {

  const { role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const menuRef = useRef();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔥 FETCH PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setUser(data);

      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, []);

  // ✅ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const linkStyle = (path) => `
    relative group text-sm font-medium transition duration-200
    ${isActive(path)
      ? "text-blue-600"
      : "text-gray-600 hover:text-blue-600"
    }
  `;

  return (
    <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">

      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          TheHomemakers
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-8">

          {role === "USER" && (
            <>
              <Link to="/user" className={linkStyle("/user")}>
                Dashboard
                <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/user") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>

              <Link to="/user/bookings" className={linkStyle("/user/bookings")}>
                Bookings
                <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/user/bookings") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>

              <Link to="/user/services" className={linkStyle("/user/services")}>
                Book Service
                <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/user/services") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            </>
          )}

          {role === "PROVIDER" && (
            <>
              <Link to="/provider" className={linkStyle("/provider")}>
                Dashboard
                <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/provider") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>

              <Link to="/provider/bookings" className={linkStyle("/provider/bookings")}>
                Bookings
                <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/provider/bookings") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            </>
          )}

          {/* 🔥 PROFILE DROPDOWN */}
          <div ref={menuRef} className="relative">

            {/* AVATAR */}
            <button
              onClick={() => setOpen(!open)}
              className="
                w-10 h-10 rounded-full
                bg-gradient-to-br from-blue-500 to-indigo-600
                text-white font-semibold
                flex items-center justify-center
                shadow-md
                transition-all duration-300
                hover:scale-110 hover:shadow-lg
                active:scale-95
              "
            >
              {user?.name?.charAt(0) || "U"}
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="
                absolute right-0 mt-3 w-56
                bg-white/90 backdrop-blur-md
                border border-gray-200
                rounded-2xl shadow-xl p-3
                animate-dropdown
              ">

                {/* USER INFO */}
                <div className="px-3 py-2 border-b mb-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>

                  <p className="text-xs text-gray-400">
                    {user?.city}
                  </p>
                </div>

                {/* PROFILE */}
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate(role === "USER" ? "/user/profile" : "/provider/profile");
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition hover:translate-x-1"
                >
                  Profile
                </button>

                {/* DASHBOARD */}
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate(role === "USER" ? "/user" : "/provider");
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition hover:translate-x-1"
                >
                  Dashboard
                </button>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 transition hover:translate-x-1"
                >
                  Logout
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Navbar;