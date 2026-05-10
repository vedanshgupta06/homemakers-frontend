// AdminTopbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, LayoutDashboard, Users, Briefcase,
  IndianRupee, ChevronDown, LogOut, Menu, X,FileExclamationPointIcon,
  BarChart3, ArrowLeft
} from "lucide-react";

export default function AdminTopbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const payoutRef = useRef();
  const profileRef = useRef();

  const isRoot = location.pathname === "/admin";

  const isActive = (path) => location.pathname === path;

  const mainLinks = [
    { name: "Dashboard",  path: "/admin",           icon: <LayoutDashboard size={15} /> },
    { name: "Providers",  path: "/admin/providers",  icon: <Users size={15} />           },
    { name: "Bookings",   path: "/admin/bookings",   icon: <Briefcase size={15} />       },
    { name: "Reports",    path: "/admin/reports",    icon: <BarChart3 size={15} />       },
    { name: "Complaints", path: "/admin/complaints", icon: <FileExclamationPointIcon size={15} />       },
  ];

  const payoutLinks = [
    { name: "Payout Requests", path: "/admin/payouts/requests" },
    { name: "Payout History",  path: "/admin/payouts/history"  },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handle = (e) => {
      if (payoutRef.current && !payoutRef.current.contains(e.target)) setPayoutOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <nav className="sticky top-0 z-[100] bg-[#1E293B] border-b border-white/5 shadow-2xl">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LEFT — Logo + back */}
          <div className="flex items-center gap-3">
            {!isRoot && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all md:hidden"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Home size={16} className="text-white" />
              </div>
              <span className="text-base font-black text-white tracking-tight uppercase">
                TheHomemakers
              </span>
              <span className="bg-red-500/20 border border-red-500/30 text-red-300 text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest ">
                Admin
              </span>
            </Link>
          </div>

          {/* CENTER — Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {mainLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-xs font-black  tracking-wider transition-all flex items-center gap-2
                  ${isActive(link.path)
                    ? "text-white bg-blue-600 shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {/* Payouts dropdown */}
            <div ref={payoutRef} className="relative">
              <button
                onClick={() => setPayoutOpen(!payoutOpen)}
                className={`px-4 py-2 rounded-xl text-xs font-black  tracking-wider transition-all flex items-center gap-2
                  ${payoutLinks.some(l => isActive(l.path))
                    ? "text-white bg-blue-600 shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <IndianRupee size={15} />
                Payouts
                <ChevronDown size={13} className={`transition-transform duration-200 ${payoutOpen ? "rotate-180" : ""}`} />
              </button>

              {payoutOpen && (
                <div className="absolute top-12 left-0 w-48 bg-white rounded-2xl shadow-2xl p-2 border border-slate-100 z-50">
                  {payoutLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setPayoutOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black  tracking-wider transition-colors
                        ${isActive(link.path)
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Profile + mobile toggle */}
          <div className="flex items-center gap-3">

            {/* Profile dropdown */}
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-3 border-l border-white/10"
              >
                <div className="w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center font-black text-sm shadow-lg">
                  A
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl p-2 border border-slate-100 z-50">
                  <div className="px-3 py-3 mb-1 border-b border-slate-100">
                    <p className="text-[10px] font-black text-slate-400  tracking-widest">Signed in as</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">Admin</p>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors  tracking-wider"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[#1E293B] z-50 px-6 py-8 space-y-6 overflow-y-auto">

          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center font-black text-white text-lg">
              A
            </div>
            <div>
              <p className="text-white font-black text-sm">Admin</p>
              <span className="bg-red-500/20 border border-red-500/30 text-red-300 text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest  mt-1 inline-block">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {mainLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black  tracking-widest transition-all
                  ${isActive(link.path)
                    ? "text-white bg-blue-600 shadow-xl shadow-blue-900/40"
                    : "text-slate-400 bg-white/5 border border-white/5 hover:text-white"
                  }`}
              >
                {link.icon} {link.name}
              </Link>
            ))}

            <div className="border-t border-white/10 pt-2 mt-1 space-y-2">
              {payoutLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black  tracking-widest transition-all
                    ${isActive(link.path)
                      ? "text-white bg-blue-600 shadow-xl shadow-blue-900/40"
                      : "text-slate-400 bg-white/5 border border-white/5 hover:text-white"
                    }`}
                >
                  <IndianRupee size={18} /> {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 bg-red-400/5 border border-red-400/10 text-sm font-black  tracking-widest w-full"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}