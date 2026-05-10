import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Bell, ArrowLeft, ShieldCheck, ShieldX,
  CheckCheck, Clock, Inbox, ArrowRight
} from "lucide-react";

const typeConfig = {
  VERIFIED: {
    icon: ShieldCheck,
    iconBg: "bg-emerald-500",
    border: "border-emerald-100",
    bg: "bg-emerald-50/30",
    badge: "bg-emerald-100 text-emerald-700",
    link: "/provider/profile",
    linkLabel: "View Profile",
  },
  REJECTED: {
    icon: ShieldX,
    iconBg: "bg-red-500",
    border: "border-red-100",
    bg: "bg-red-50/30",
    badge: "bg-red-100 text-red-600",
    link: "/provider/documents",
    linkLabel: "View Documents",
  },
  BOOKING: {
    icon: Bell,
    iconBg: "bg-blue-500",
    border: "border-blue-100",
    bg: "bg-blue-50/30",
    badge: "bg-blue-100 text-blue-700",
    link: "/provider/bookings",
    linkLabel: "View Bookings",
  },
  PAYOUT: {
    icon: Bell,
    iconBg: "bg-orange-500",
    border: "border-orange-100",
    bg: "bg-orange-50/30",
    badge: "bg-orange-100 text-orange-700",
    link: "/provider/payouts",
    linkLabel: "View Payouts",
  },
  GENERAL: {
    icon: Bell,
    iconBg: "bg-slate-500",
    border: "border-slate-100",
    bg: "bg-slate-50/30",
    badge: "bg-slate-100 text-slate-600",
    link: null,
    linkLabel: null,
  },
  REMINDER: {
    icon: Bell,
    iconBg: "bg-amber-500",
    border: "border-amber-100",
    bg: "bg-amber-50/30",
    badge: "bg-amber-100 text-amber-700",
    link: "/provider/bookings",
    linkLabel: "View Bookings",
  },
};

export default function ProviderNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/api/provider/notifications");
      setNotifications(res.data || []);
      await api.put("/api/provider/notifications/read-all");
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/api/provider/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    const config = typeConfig[notif.type] || typeConfig.GENERAL;
    if (!notif.read) await handleMarkRead(notif.id);
    if (config.link) navigate(config.link);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO */}
      <div className="bg-[#1E293B] pt-2 pb-24 md:pt-20 md:pb-28 px-[5%] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <button
            onClick={() => navigate(-1)}
            className="group mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowLeft size={18} strokeWidth={2.5} className="text-slate-900 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-3 py-1 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Partner</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
            My <span className="text-blue-400">Notifications</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-medium">
            Stay updated on your account status and activity.
          </p>

          {!loading && notifications.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                <Bell size={12} className="text-slate-300" />
                <span className="text-white text-xs font-bold">{notifications.length} total</span>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-red-200 text-xs font-bold">{unreadCount} unread</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-[5%] pb-16 -mt-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Bell size={14} className="text-white" />
                </div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">
                  All Notifications
                </h3>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={async () => {
                    await api.put("/api/provider/notifications/read-all");
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-wider hover:bg-blue-100 transition-all"
                >
                  <CheckCheck size={11} strokeWidth={3} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="space-y-3 p-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Inbox size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-black text-slate-700">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  You'll be notified about account status, bookings, and payouts here.
                </p>
              </div>
            )}

            {/* Notification list */}
            {!loading && notifications.length > 0 && (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => {
                  const config = typeConfig[notif.type] || typeConfig.GENERAL;
                  const Icon = config.icon;

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex items-start gap-4 px-6 py-5 transition-all
                        ${config.link ? "cursor-pointer" : ""}
                        ${!notif.read
                          ? `${config.bg} border-l-4 ${config.border}`
                          : "hover:bg-slate-50"
                        }
                      `}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
                        <Icon size={16} className="text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5 ${config.badge}`}>
                              {notif.type}
                            </span>
                            <p className={`text-sm font-black leading-snug ${!notif.read ? "text-slate-900" : "text-slate-600"}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>

                          {/* Unread dot + time */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                              <Clock size={9} />
                              {formatDate(notif.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Bottom row — mark as read + navigate link */}
                        <div className="flex items-center justify-between mt-2">
                          {!notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkRead(notif.id);
                              }}
                              className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-wider transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          {config.linkLabel && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase tracking-wider ml-auto">
                              {config.linkLabel} <ArrowRight size={10} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}