import Navbar from "./Navbar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Heart } from "lucide-react";

const services = [
  { label: "Cleaning",     type: "CLEANING"     },
  { label: "Cooking",      type: "COOKING"       },
  { label: "Babysitting",  type: "BABYSITTING"   },
  { label: "Dish Washing", type: "DISH_WASHING"  },
  { label: "Laundry",      type: "LAUNDRY"       },
  { label: "Elder Care",   type: "ELDER_CARE"    },
  { label: "Dusting",   type: "DUSTING"    },
];

function Footer() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!storedUser;
  const isProvider = storedUser?.role === "PROVIDER";
  const isAdmin    = storedUser?.role === "ADMIN";

  // Don't show footer for admin
  if (isAdmin) return null;

  return (
    <footer className="bg-[#1E293B] text-slate-400 mt-20">

      {/* MAIN FOOTER */}
      <div className="max-w-[1800px] mx-auto px-[5%] py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* COL 1 — BRAND */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Home size={16} className="text-white" />
              </div>
              <span className="text-base font-black text-white tracking-tight uppercase">
                TheHomemakers
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-400 mb-6">
              Reliable domestic care, redefined. Connecting trusted home service providers with families across India.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <Mail size={13} className="text-blue-400 flex-shrink-0" />
                <span>support@thehomemakers.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <Phone size={13} className="text-blue-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <MapPin size={13} className="text-blue-400 flex-shrink-0" />
                <span>Nagpur, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* COL 2 — SERVICES */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-5">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map(({ label, type }) => (
                <li key={type}>
                  <button
                    onClick={() => navigate(`/user/services?type=${type}`)}
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150 text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — QUICK LINKS */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {!isProvider && (
                <>
                  <li>
                    <Link to="/user/services" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Book a Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/bookings" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/attendance" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Mark Attendance
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/wallet" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      My Wallet
                    </Link>
                  </li>
                  <li>
                    <Link to="/user/help" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Help & Support
                    </Link>
                  </li>
                </>
              )}
              {isProvider && (
                <>
                  <li>
                    <Link to="/provider/bookings" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      My Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/provider/attendance" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Attendance
                    </Link>
                  </li>
                  <li>
                    <Link to="/provider/earnings" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Earnings
                    </Link>
                  </li>
                  <li>
                    <Link to="/provider/payouts" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Payouts
                    </Link>
                  </li>
                  <li>
                    <Link to="/provider/availability" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Availability
                    </Link>
                  </li>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <li>
                    <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* COL 4 — COMPANY */}
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us",        path: "/about"          },
                { label: "Privacy Policy",  path: "/privacy"        },
                { label: "Terms of Service",path: "/terms"          },
                { label: "Contact Us",      path: "/user/help"      },
                { label: "Become a Partner",path: "/register"       },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl w-fit">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                  Verified Providers Only
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl w-fit">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                  Secure Payments
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl w-fit">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                  Background Checked
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/5" />

      {/* BOTTOM BAR */}
      <div className="max-w-[1800px] mx-auto px-[5%] py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-medium text-slate-500 text-center sm:text-left">
            © 2026 TheHomemakers. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            Made with <Heart size={11} className="text-red-400 fill-red-400" /> in India 🇮🇳
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-[11px] font-medium text-slate-500 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-[11px] font-medium text-slate-500 hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/user/help" className="text-[11px] font-medium text-slate-500 hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="flex-1 w-[95%] lg:w-[90%] max-w-[1800px] mx-auto py-8 md:py-12">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;