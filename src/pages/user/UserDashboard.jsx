import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Sparkles, Calendar, CheckCircle2,
  Clock, ChevronRight, Zap, Star, Wallet, ArrowRight, Fingerprint, ShoppingBag,
  MapPin, Navigation, AlertTriangle, User, Phone, XCircle
} from "lucide-react";

const serviceMeta = {
  CLEANING:    { img: "/images/image.png" },
  COOKING:     { img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600" },
  BABYSITTING: { img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600" },
  DEFAULT:     { img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600" }
};

function getProfileCompletion(user) {
  if (!user) return { percent: 0, missing: [] };
  const checks = [
    { key: "name",    label: "Full name",      icon: "user",  done: !!user.name },
    { key: "phone",   label: "Phone number",   icon: "phone", done: !!user.phone },
    { key: "city",    label: "City",           icon: "map",   done: !!user.city },
    { key: "pincode", label: "Area / Pincode", icon: "pin",   done: !!user.pincode },
    { key: "address", label: "Home address",   icon: "home",  done: !!user.address },
  ];
  const done    = checks.filter(c => c.done).length;
  const missing = checks.filter(c => !c.done);
  return { percent: Math.round((done / checks.length) * 100), missing, total: checks.length, done };
}

const typeMeta = {
  PAYMENT: {
    icon: <Wallet size={18} />,
    iconBg: "bg-amber-50",   iconColor: "text-amber-600",
    lineBg: "bg-amber-100",  badgeBg: "bg-amber-50",  badgeColor: "text-amber-800",
    label: "Payment",
  },
  BOOKING: {
    icon: <Calendar size={18} />,
    iconBg: "bg-blue-50",    iconColor: "text-blue-600",
    lineBg: "bg-blue-100",   badgeBg: "bg-blue-50",   badgeColor: "text-blue-800",
    label: "Booking",
  },
  ATTENDANCE: {
    icon: <CheckCircle2 size={18} />,
    iconBg: "bg-emerald-50", iconColor: "text-emerald-600",
    lineBg: "bg-emerald-100",badgeBg: "bg-emerald-50",badgeColor: "text-emerald-800",
    label: "Attendance",
  },
  REFUND: {
    icon: <Wallet size={18} />,
    iconBg: "bg-emerald-50", iconColor: "text-emerald-600",
    lineBg: "bg-emerald-100",badgeBg: "bg-emerald-50",badgeColor: "text-emerald-800",
    label: "Refund",
  },
};

const terminatedOverride = {
  icon: <XCircle size={18} />,
  iconBg: "bg-orange-50",  iconColor: "text-orange-600",
  lineBg: "bg-orange-100", badgeBg: "bg-orange-50",  badgeColor: "text-orange-800",
  label: "Terminated",
};

function resolveTypeMeta(item) {
  if (item.type === "BOOKING" && item.status === "TERMINATED") return terminatedOverride;
  return typeMeta[item.type] || typeMeta.BOOKING;
}

function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading]   = useState(true);
  const [user, setUser]         = useState(null);
  const [services, setServices] = useState([]);
  const [activity, setActivity] = useState([]);
  const [stats, setStats]       = useState({ total: 0, upcoming: 0, rating: 0 });

  useEffect(() => {
    if (location.state?.scrollTo === "recent-updates") {
      setTimeout(() => {
        document.getElementById("recent-updates")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location.state]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [prof, statRes, actRes, servRes] = await Promise.all([
          api.get("/api/users/profile"),
          api.get("/api/users/dashboard-stats"),
          api.get("/api/users/recent-activity"),
          api.get("/api/services").catch(() => ({ data: [
            { name: "CLEANING" }, { name: "COOKING" },
            { name: "BABYSITTING" }, { name: "LAUNDRY" }
          ]}))
        ]);
        setUser(prof.data);
        setStats({
          total:    statRes.data.totalBookings || 0,
          upcoming: statRes.data.upcoming      || 0,
          rating:   statRes.data.rating        || 5.0
        });
        setActivity(actRes.data || []);
        setServices(servRes.data);
        localStorage.setItem("notificationsLastSeen", new Date().toISOString());
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const quickActions = [
    { title: "Book a Service",   path: "/user/services",         icon: <Sparkles size={19}/>,     sub: "New Request",   iconBg: "bg-blue-50",    iconColor: "text-blue-600",    bgColor: "bg-blue-600"    },
    { title: "My Bookings",      path: "/user/bookings",         icon: <Calendar size={19}/>,     sub: "View Schedule", iconBg: "bg-violet-50",  iconColor: "text-violet-600",  bgColor: "bg-violet-600"  },
    { title: "Pending Payments", path: "/user/payments",         icon: <Clock size={19}/>,        sub: "Unpaid Dues",   iconBg: "bg-amber-50",   iconColor: "text-amber-600",   bgColor: "bg-amber-600"   },
    { title: "Attendance",       path: "/user/attendance",       icon: <CheckCircle2 size={19}/>, sub: "Log Reports",   iconBg: "bg-emerald-50", iconColor: "text-emerald-600", bgColor: "bg-emerald-600" },
    { title: "Payment History",  path: "/user/payments/history", icon: <Wallet size={19}/>,       sub: "Past Records",  iconBg: "bg-cyan-50",    iconColor: "text-cyan-600",    bgColor: "bg-cyan-600"    },
  ];

  const { percent, missing, done, total } = getProfileCompletion(user);
  const profileComplete = percent === 100;
  const hasLocationData = user?.pincode || user?.latitude;

  const progressColor = percent < 40 ? "bg-red-500"   : percent < 80 ? "bg-amber-500"   : "bg-emerald-500";
  const progressText  = percent < 40 ? "text-red-600" : percent < 80 ? "text-amber-600" : "text-emerald-600";
  const progressBg    = percent < 40 ? "bg-red-50 border-red-200" : percent < 80 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200";

  const iconForField = (icon) => {
    if (icon === "user")  return <User size={13} />;
    if (icon === "phone") return <Phone size={13} />;
    if (icon === "pin")   return <MapPin size={13} />;
    return <Navigation size={13} />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <section className="bg-[#1E293B] pt-20 pb-32 px-[5%]">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-2xl">
            <h2 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
              Welcome back, {user?.name?.split(' ')[0]}
            </h2>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-tighter mb-6 uppercase">
              Domestic Care<br/>
              <span className="text-white/20 italic">Redefined.</span>
            </h1>
            <p className="text-slate-400 font-bold text-lg mb-10 animate-pulse">
              Reliable household service just a click away ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-5 mt-10">
              <button
                onClick={() => navigate("/user/services")}
                className="bg-[#2563EB] hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4"
              >
                Book Service <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/user/attendance")}
                className="bg-white hover:bg-slate-100 text-slate-900 px-10 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-4"
              >
                <Fingerprint size={20} className="text-blue-600" />
                Mark Attendance
              </button>
            </div>
          </div>

          <div className="hidden lg:flex gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] w-48 text-center">
              <p className="text-4xl font-black text-white mb-2">{stats.total}</p>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Total Orders</p>
            </div>
            <div className="bg-blue-600 p-8 rounded-[2.5rem] w-48 text-center shadow-xl shadow-blue-900/20">
              <p className="text-4xl font-black text-white mb-2">{stats.upcoming}</p>
              <p className="text-[9px] font-black text-white/90 uppercase tracking-widest">Upcoming</p>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STATS */}
      <section className="px-[5%] -mt-12 relative z-20 lg:hidden">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Bookings", val: stats.total },
            { label: "Upcoming", val: stats.upcoming },
            { label: "Rating",   val: stats.rating }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xl flex flex-col items-center">
              <p className="text-2xl font-black text-slate-900">{item.val}</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROFILE COMPLETION BANNER */}
      {!loading && !profileComplete && (
        <section className="px-[5%] pt-10 lg:pt-16">
          <div className="max-w-[1440px] mx-auto">
            <div className={`rounded-[2rem] border-2 p-6 md:p-8 ${progressBg}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <AlertTriangle size={15} className={progressText} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        Complete your profile to find providers near you
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Providers are matched using your area and location —
                        {!hasLocationData
                          ? " without these we can only show city-wide results."
                          : " add the remaining details for best results."
                        }
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 ml-11">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        {done} of {total} fields completed
                      </span>
                      <span className={`text-[10px] font-black ${progressText}`}>{percent}%</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                  {missing.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-11">
                      {missing.map(f => (
                        <span key={f.key} className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                          {iconForField(f.icon)}
                          {f.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate("/user/profile")}
                  className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200 whitespace-nowrap"
                >
                  Complete Profile <ArrowRight size={14} />
                </button>
              </div>
              {!hasLocationData && (
                <div className="mt-4 ml-0 md:ml-11 flex items-start gap-2 p-3 bg-white/60 rounded-xl border border-white">
                  <MapPin size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    <span className="font-black text-slate-800">Your area / pincode is missing.</span>{" "}
                    This is the most important field — providers serving your pincode will appear first.
                    Without it, only "willing to travel" providers will show up.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {!loading && profileComplete && (
        <section className="px-[5%] pt-10 lg:pt-16">
          <div className="max-w-[1440px] mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                Profile complete — you'll see the best matched providers near you
              </span>
            </div>
          </div>
        </section>
      )}

      {/* QUICK ACTIONS */}
      <section className="w-full px-[5%] pt-10 pb-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={14} className="text-blue-600" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Quick Actions</h3>
          </div>
          <div className="flex overflow-x-auto gap-5 pb-6 no-scrollbar snap-x touch-pan-x">
            {quickActions.map((action, i) => (
              <div
                key={i}
                onClick={() => navigate(action.path)}
                className="min-w-[200px] md:min-w-[220px] snap-start relative bg-white border border-slate-100 p-6 rounded-[1.75rem] cursor-pointer hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-[0.07] ${action.bgColor}`} />
                <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center mb-5 ${action.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  <span className={action.iconColor}>{action.icon}</span>
                </div>
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-tight">{action.title}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{action.sub}</p>
                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-blue-600">
                  <ArrowRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SLIDER */}
      <section className="w-full px-[5%] py-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.35em] flex items-center gap-2 mb-2">
                <ShoppingBag size={11} /> Marketplace
              </p>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Our Services</h3>
              <div className="h-[3px] w-10 bg-blue-600 rounded-full mt-2" />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden md:flex items-center gap-1">
              Swipe to explore <ChevronRight size={13} />
            </p>
          </div>
          <div className="flex overflow-x-auto gap-5 pb-6 no-scrollbar snap-x touch-pan-x">
            {services.map((s, i) => {
              const meta    = serviceMeta[s.name.toUpperCase()] || serviceMeta.DEFAULT;
              const tags    = ["Most Booked", "Top Rated", "Verified Carers", "Same Day"];
              const ratings = ["4.9", "4.8", "4.9", "4.7"];
              const descs   = {
                CLEANING:    "Deep & regular home cleaning by trained professionals",
                COOKING:     "Home-cooked meals tailored to your taste & diet",
                BABYSITTING: "Trusted & background-checked childcare at home",
                LAUNDRY:     "Wash, fold and iron — picked up & delivered",
              };
              return (
                <div
                  key={i}
                  onClick={() => navigate(`/user/services?type=${s.name}`)}
                  className="min-w-[300px] md:min-w-[320px] snap-start flex-shrink-0 rounded-[1.75rem] overflow-hidden border border-slate-100 bg-white cursor-pointer hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="h-[200px] relative overflow-hidden">
                    <img src={meta.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/10 to-transparent" />
                    <div className="absolute top-3.5 left-3.5 bg-white/15 border border-white/25 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                      {tags[i] || "Popular"}
                    </div>
                    <div className="absolute top-3.5 right-3.5 bg-white/15 border border-white/20 rounded-full px-2.5 py-1 flex items-center gap-1 backdrop-blur-sm">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-white text-[11px] font-black">{ratings[i] || "4.8"}</span>
                    </div>
                    <div className="absolute bottom-3.5 left-4">
                      <p className="text-white text-xl font-black uppercase tracking-tight leading-none">
                        {s.name.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-4 flex justify-between items-center gap-4">
                    <p className="text-slate-400 text-[12px] leading-relaxed max-w-[160px]">
                      {descs[s.name.toUpperCase()] || "Professional home service"}
                    </p>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-slate-900 text-lg font-black tracking-tight">
                        ₹499 <span className="text-slate-400 text-[11px] font-medium">/starts from</span>
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 border border-slate-200 px-3 py-1.5 rounded-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                        Book now <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RECENT UPDATES */}
      <section id="recent-updates" className="w-full px-[5%] py-20 bg-slate-50">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-4">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Recent Updates</h3>
            <div className="h-[3px] w-9 bg-blue-600 rounded-full mb-5" />
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Stay informed about your service schedules, approvals, and transaction history.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
              {activity.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2rem] m-6">
                  <p className="text-slate-300 font-bold text-[11px] uppercase tracking-widest">No activity history</p>
                </div>
              ) : (
                activity.map((item, i) => {
                  const isLast = i === activity.length - 1;
                  const m      = resolveTypeMeta(item);

                  const linkLabel =
                    item.link?.includes("/payments") && !item.link?.includes("history")
                      ? "Pay Now"
                      : item.link?.includes("history")
                      ? "View History"
                      : item.link?.includes("wallet")
                      ? "View Wallet"
                      : item.link
                      ? "View Details"
                      : null;

                  return (
                    <div
                      key={i}
                      onClick={() => item.link && navigate(item.link)}
                      className={`flex items-start gap-4 px-6 py-5 transition-colors
                        ${item.link ? "cursor-pointer hover:bg-blue-50" : "hover:bg-slate-50"}
                        ${!isLast ? "border-b border-slate-100" : ""}
                      `}
                    >
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center ${m.iconBg} ${m.iconColor}`}>
                          {m.icon}
                        </div>
                        {!isLast && <div className={`w-0.5 flex-1 min-h-[20px] rounded-full ${m.lineBg}`} />}
                      </div>

                      <div className="flex-1 pt-0.5">
                        <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 ${m.badgeBg} ${m.badgeColor}`}>
                          {m.label}
                        </span>

                        <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-snug mb-1">
                          {item.message}
                        </p>

                        {item.terminationReason && (
                          <div className="flex items-start gap-1.5 mt-1.5 px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl">
                            <XCircle size={11} className="text-orange-400 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-orange-700 font-medium leading-relaxed">
                              <span className="font-black uppercase tracking-wider text-[10px]">Reason: </span>
                              {item.terminationReason}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {new Date(item.time).toDateString()}
                          </p>
                          {linkLabel && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase tracking-wider">
                              {linkLabel} <ArrowRight size={10} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

export default UserDashboard;