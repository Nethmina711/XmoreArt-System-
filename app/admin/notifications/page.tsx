"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/lib/context/NotificationContext";
import { formatDate } from "@/lib/utils";
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  FileSpreadsheet, 
  Briefcase, 
  CreditCard, 
  CheckSquare,
  Sparkles
} from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "ENQUIRY": return <MessageSquare className="w-5 h-5 text-brand-red" />;
      case "QUOTATION": return <FileSpreadsheet className="w-5 h-5 text-purple-400" />;
      case "PROJECT": return <Briefcase className="w-5 h-5 text-blue-400" />;
      case "PAYMENT": return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case "TASK": return <CheckSquare className="w-5 h-5 text-amber-400" />;
      default: return <Bell className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time alerts for customer inquiries, approved quotes, project tasks & payments
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-brand-red" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-brand-dark-card border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 space-y-2">
            <Bell className="w-10 h-10 mx-auto text-neutral-600" />
            <p className="text-sm font-semibold text-neutral-400">All caught up!</p>
            <p className="text-xs">No pending notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markAsRead(notif.id);
                if (notif.link) router.push(notif.link);
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.read
                  ? "bg-brand-red/10 border-brand-red/30 hover:border-brand-red"
                  : "bg-white/5 border-white/5 hover:bg-white/10"
              }`}
            >
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm text-white">
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                    {formatDate(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-brand-red shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
