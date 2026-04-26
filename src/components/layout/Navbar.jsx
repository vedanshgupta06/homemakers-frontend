// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useState, useEffect, useRef } from "react";

// function Navbar() {

//   const { role, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [open, setOpen] = useState(false);
//   const [user, setUser] = useState(null);

//   const menuRef = useRef();

//   const isActive = (path) => location.pathname === path;

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   // 🔥 FETCH PROFILE
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/api/users/profile", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`
//           }
//         });

//         if (!res.ok) throw new Error("Failed");

//         const data = await res.json();
//         setUser(data);

//       } catch (err) {
//         console.error("Profile fetch failed", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // ✅ CLOSE DROPDOWN ON OUTSIDE CLICK
//   useEffect(() => {
//     const handler = (e) => {
//       if (!menuRef.current?.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const linkStyle = (path) => `
//     relative group text-sm font-medium transition duration-200
//     ${isActive(path)
//       ? "text-blue-600"
//       : "text-gray-600 hover:text-blue-600"
//     }
//   `;

//   return (
//     <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">

//       <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

//         {/* LOGO */}
//         <Link
//           to="/"
//           className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
//         >
//           TheHomemakers
//         </Link>

//         {/* NAV LINKS */}
//         <div className="flex items-center gap-8">

//           {role === "USER" && (
//             <>
//               <Link to="/user" className={linkStyle("/user")}>
//                 Dashboard
//                 <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/user") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
//               </Link>

//               <Link to="/user/bookings" className={linkStyle("/user/bookings")}>
//                 Bookings
//                 <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/user/bookings") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
//               </Link>

//               <Link to="/user/services" className={linkStyle("/user/services")}>
//                 Book Service
//                 <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/user/services") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
//               </Link>
//             </>
//           )}

//           {role === "PROVIDER" && (
//             <>
//               <Link to="/provider" className={linkStyle("/provider")}>
//                 Dashboard
//                 <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/provider") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
//               </Link>

//               <Link to="/provider/bookings" className={linkStyle("/provider/bookings")}>
//                 Bookings
//                 <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transform origin-left transition duration-300 ${isActive("/provider/bookings") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
//               </Link>
//             </>
//           )}

//           {/* 🔥 PROFILE DROPDOWN */}
//           <div ref={menuRef} className="relative">

//             {/* AVATAR */}
//             <button
//               onClick={() => setOpen(!open)}
//               className="
//                 w-10 h-10 rounded-full
//                 bg-gradient-to-br from-blue-500 to-indigo-600
//                 text-white font-semibold
//                 flex items-center justify-center
//                 shadow-md
//                 transition-all duration-300
//                 hover:scale-110 hover:shadow-lg
//                 active:scale-95
//               "
//             >
//               {user?.name?.charAt(0) || "U"}
//             </button>

//             {/* DROPDOWN */}
//             {open && (
//               <div className="
//                 absolute right-0 mt-3 w-56
//                 bg-white/90 backdrop-blur-md
//                 border border-gray-200
//                 rounded-2xl shadow-xl p-3
//                 animate-dropdown
//               ">

//                 {/* USER INFO */}
//                 <div className="px-3 py-2 border-b mb-2">
//                   <p className="text-sm font-semibold text-gray-800">
//                     {user?.name || "User"}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     {user?.email}
//                   </p>

//                   <p className="text-xs text-gray-400">
//                     {user?.city}
//                   </p>
//                 </div>

//                 {/* PROFILE */}
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     navigate(role === "USER" ? "/user/profile" : "/provider/profile");
//                   }}
//                   className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition hover:translate-x-1"
//                 >
//                   Profile
//                 </button>

//                 {/* DASHBOARD */}
//                 <button
//                   onClick={() => {
//                     setOpen(false);
//                     navigate(role === "USER" ? "/user" : "/provider");
//                   }}
//                   className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition hover:translate-x-1"
//                 >
//                   Dashboard
//                 </button>

//                 {/* LOGOUT */}
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 transition hover:translate-x-1"
//                 >
//                   Logout
//                 </button>

//               </div>
//             )}

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Navbar;
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import {
  User as UserIcon, LogOut, LayoutDashboard,
  Calendar, PlusCircle, Wallet, ChevronDown, Menu, X,
  IndianRupee, Briefcase, Clock, Settings, Home, Bell
} from "lucide-react";
import { getWalletBalance } from "../../api/walletApi";

function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [balance, setBalance] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [providerUnreadCount, setProviderUnreadCount] = useState(0); // ✅ NEW

  const menuRef = useRef();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isProvider = storedUser?.role === "PROVIDER";
  const isActive = (path) => location.pathname === path;

  const fetchUnreadCount = async () => {
    try {
      const notif = await api.get("/api/users/notifications/unread-count");
      const lastSeen = localStorage.getItem("notificationsLastSeen");
      if (lastSeen) {
        const lastSeenDate = new Date(lastSeen);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (lastSeenDate > fiveMinutesAgo) {
          setUnreadCount(0);
          return;
        }
      }
      setUnreadCount(notif.data.count || 0);
    } catch {}
  };

  const fetchProviderUnreadCount = async () => {
    try {
      const notif = await api.get("/api/provider/notifications/unread-count");
      setProviderUnreadCount(notif.data.count || 0);
    } catch {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prof = await api.get("/api/users/profile");
        setUserData(prof.data);

        if (!isProvider) {
          const bal = await getWalletBalance();
          setBalance(bal);
          await fetchUnreadCount();
        } else {
          await fetchProviderUnreadCount();
        }
      } catch (err) {
        console.error("Navbar data fetch failed", err);
      }
    };
    fetchData();

    // ✅ Poll every 30 seconds
    const interval = setInterval(() => {
      if (isProvider) fetchProviderUnreadCount();
      else fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const userLinks = [
    { name: "Dashboard",      path: "/user",          icon: <LayoutDashboard size={16} /> },
    { name: "Bookings",       path: "/user/bookings", icon: <Calendar size={16} /> },
    { name: "Book Service",   path: "/user/services", icon: <PlusCircle size={16} /> },
    { name: "Help & Support", path: "/user/help" },
  ];

  const providerLinks = [
    { name: "Dashboard",    path: "/provider",              icon: <LayoutDashboard size={16} /> },
    { name: "My Jobs",      path: "/provider/bookings",     icon: <Briefcase size={16} /> },
    { name: "Attendance",   path: "/provider/attendance",   icon: <Clock size={16} /> },
    { name: "Availability", path: "/provider/availability", icon: <Calendar size={16} /> },
  ];

  const navLinks = isProvider ? providerLinks : userLinks;

  const handleUserNotificationClick = () => {
    if (location.pathname === "/user") {
      document.getElementById("recent-updates")?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    } else {
      navigate("/user", { state: { scrollTo: "recent-updates" } });
      setTimeout(() => setUnreadCount(0), 300);
    }
  };

  const handleProviderNotificationClick = () => {
    setProviderUnreadCount(0);
    navigate("/provider/notifications");
  };

  return (
    <nav className="sticky top-0 z-[100] bg-[#1E293B] border-b border-white/5 shadow-2xl">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Home size={16} className="text-white" />
            </div>
            <span className="text-base font-black text-white tracking-tight uppercase">
              TheHomemakers
            </span>
            {isProvider && (
              <span className="bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest">
                Partner
              </span>
            )}
          </Link>

          {/* CENTER NAV */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all flex items-center gap-2
                  ${isActive(link.path)
                    ? "text-white bg-blue-600 shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* ✅ USER NOTIFICATION BELL */}
            {!isProvider && (
              <button
                onClick={handleUserNotificationClick}
                className="relative p-2 rounded-xl bg-slate-800 border border-white/10 hover:border-blue-500/40 transition-all"
              >
                <Bell size={16} className="text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* ✅ PROVIDER NOTIFICATION BELL */}
            {isProvider && (
              <button
                onClick={handleProviderNotificationClick}
                className="relative p-2 rounded-xl bg-slate-800 border border-white/10 hover:border-blue-500/40 transition-all"
              >
                <Bell size={16} className="text-slate-300" />
                {providerUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                    {providerUnreadCount > 9 ? "9+" : providerUnreadCount}
                  </span>
                )}
              </button>
            )}

            {/* WALLET — users only */}
            {!isProvider && (
              <button
                onClick={() => navigate("/user/wallet")}
                className="flex items-center gap-2.5 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl hover:border-blue-500/40 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Wallet size={14} className="text-blue-400" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[9px] font-black text-slate-500 leading-none mb-0.5">Balance</p>
                  <p className="text-white text-xs font-black leading-none">₹{Number(balance).toLocaleString("en-IN")}</p>
                </div>
              </button>
            )}

            {/* EARNINGS — providers only */}
            {isProvider && (
              <button
                onClick={() => navigate("/provider/payouts")}
                className="flex items-center gap-2.5 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl hover:border-blue-500/40 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                  <IndianRupee size={14} className="text-emerald-400" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[9px] font-black text-slate-500 leading-none mb-0.5">Earnings</p>
                  <p className="text-white text-xs font-black leading-none">Payouts</p>
                </div>
              </button>
            )}

            {/* PROFILE DROPDOWN */}
            <div ref={menuRef} className="relative hidden sm:block">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 pl-3 border-l border-white/10"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-900/30">
                  {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl p-2 border border-slate-100 z-50">
                  <div className="px-3 py-3 mb-1 border-b border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-black text-slate-900 truncate mt-0.5">{userData?.name || "User"}</p>
                    <p className="text-[10px] text-slate-400 truncate">{userData?.email}</p>
                  </div>

                  <button
                    onClick={() => { navigate(isProvider ? "/provider/profile" : "/user/profile"); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-colors tracking-wider"
                  >
                    <UserIcon size={15} className="text-slate-400" />
                    Profile Settings
                  </button>

                  {isProvider && (
                    <button
                      onClick={() => { navigate("/provider/pricing"); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-colors tracking-wider"
                    >
                      <Settings size={15} className="text-slate-400" />
                      Set Pricing
                    </button>
                  )}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors tracking-wider"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[#1E293B] z-50 px-6 py-8 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-white font-black text-sm">{userData?.name}</p>
              <p className="text-slate-400 text-xs">{userData?.email}</p>
              {isProvider && (
                <span className="bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest mt-1 inline-block">
                  Partner
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black tracking-widest transition-all
                  ${isActive(link.path)
                    ? "text-white bg-blue-600 shadow-xl shadow-blue-900/40"
                    : "text-slate-400 bg-white/5 border border-white/5 hover:text-white"
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
            <button
              onClick={() => { navigate(isProvider ? "/provider/profile" : "/user/profile"); setMobileMenuOpen(false); }}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 bg-white/5 border border-white/5 text-sm font-black tracking-widest"
            >
              <UserIcon size={18} /> Profile Settings
            </button>

            {!isProvider && (
              <>
                <button
                  onClick={() => { navigate("/user/wallet"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 bg-white/5 border border-white/5 text-sm font-black tracking-widest"
                >
                  <Wallet size={18} /> Wallet · ₹{Number(balance).toLocaleString("en-IN")}
                </button>
                <button
                  onClick={() => { handleUserNotificationClick(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl text-slate-300 bg-white/5 border border-white/5 text-sm font-black tracking-widest"
                >
                  <span className="flex items-center gap-4"><Bell size={18} /> Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* ✅ Provider mobile notification */}
            {isProvider && (
              <button
                onClick={() => { handleProviderNotificationClick(); setMobileMenuOpen(false); }}
                className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl text-slate-300 bg-white/5 border border-white/5 text-sm font-black tracking-widest"
              >
                <span className="flex items-center gap-4"><Bell size={18} /> Notifications</span>
                {providerUnreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {providerUnreadCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 bg-red-400/5 border border-red-400/10 text-sm font-black tracking-widest"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;