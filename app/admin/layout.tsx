"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useNotifications } from "@/lib/context/NotificationContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { canAccessModule } from "@/lib/utils";
import { StaffRole } from "@/lib/types";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  FileSpreadsheet,
  ShoppingBag,
  Briefcase,
  CheckSquare,
  CreditCard,
  Receipt,
  UserCheck,
  TrendingUp,
  Globe,
  FileText,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Search,
  Sparkles,
  Check
} from "lucide-react";

import { BrandLogo } from "@/components/common/BrandLogo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, isAuthenticated, isLoaded } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { settings } = useSettings();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real Mode Auth Route Guard: Redirect unauthenticated requests to /admin/login
  useEffect(() => {
    if (isLoaded && !isAuthenticated && pathname !== "/admin/login") {
      router.replace(`/admin/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoaded, isAuthenticated, pathname, router]);

  // If on login page, render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading while checking persistent authentication session
  if (!isLoaded || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-10 h-10 border-2 border-brand-red/20 border-t-brand-red rounded-full animate-spin" />
        <p className="text-xs text-neutral-400 font-heading uppercase tracking-widest">
          Authenticating Workspace...
        </p>
      </div>
    );
  }

  const allNavItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, module: "dashboard" },
    { name: "Shoot Calendar", href: "/admin/bookings", icon: Calendar, module: "bookings" },
    { name: "Customers", href: "/admin/customers", icon: Users, module: "customers" },
    { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare, module: "enquiries" },
    { name: "Quotations", href: "/admin/quotations", icon: FileSpreadsheet, module: "quotations" },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag, module: "orders" },
    { name: "Projects", href: "/admin/projects", icon: Briefcase, module: "projects" },
    { name: "Tasks", href: "/admin/tasks", icon: CheckSquare, module: "tasks" },
    { name: "Payments", href: "/admin/payments", icon: CreditCard, module: "payments" },
    { name: "Expenses", href: "/admin/expenses", icon: Receipt, module: "expenses" },
    { name: "Leads CRM", href: "/admin/leads", icon: TrendingUp, module: "leads" },
    { name: "Employees", href: "/admin/employees", icon: UserCheck, module: "employees" },
    { name: "Content CMS", href: "/admin/cms", icon: Globe, module: "cms" },
    { name: "Reports & Analytics", href: "/admin/reports", icon: FileText, module: "reports" },
    { name: "Settings", href: "/admin/settings", icon: Settings, module: "settings" },
  ];

  // Filter based on user's active role
  const accessibleItems = allNavItems.filter(item => canAccessModule(role, item.module));

  const availableRoles: StaffRole[] = [
    "SUPER_ADMIN",
    "MANAGER",
    "DESIGNER",
    "PHOTOGRAPHER",
    "VIDEOGRAPHER",
    "MARKETING",
    "STAFF"
  ];

  return (
    <div className="min-h-screen bg-brand-black text-neutral-100 flex flex-col selection:bg-brand-red selection:text-white">
      
      {/* Top Operations Header */}
      <header className="sticky top-0 z-40 bg-brand-dark-card/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Admin Brand Logo */}
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" href="/admin" />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-brand-red/10 border border-brand-red/30 text-[10px] uppercase font-bold text-brand-red tracking-wider">
              Workspace
            </span>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* View Public Website Link */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>

          {/* Active Staff Role Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-heading font-semibold text-white">
            <Shield className="w-3.5 h-3.5 text-brand-red" />
            <span className="hidden sm:inline text-neutral-400">Role:</span>
            <span className="text-brand-red uppercase">{role.replace("_", " ")}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-brand-red/50">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-brand-dark-card border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-slide-up">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-red/20 text-brand-red text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-neutral-400 hover:text-white transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-6">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.link) router.push(notif.link);
                          setShowNotifications(false);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          !notif.read
                            ? "bg-brand-red/10 border-brand-red/30 text-white"
                            : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{notif.title}</span>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-brand-red" />}
                        </div>
                        <p className="text-[11px] leading-relaxed line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <img
              src={user?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
              alt={user?.name || "Admin"}
              className="w-8 h-8 rounded-lg object-cover border border-white/10"
            />
            <div className="hidden xl:block text-left text-xs">
              <p className="font-bold text-white leading-tight">{user?.name || "Miyuru Senarathne"}</p>
              <p className="text-[10px] text-neutral-400 uppercase font-semibold">{role.replace("_", " ")}</p>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/admin/login";
              }}
              title="Logout"
              className="p-2 rounded-lg text-neutral-400 hover:text-brand-red hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Body container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-brand-dark-card border-r border-white/10 shrink-0 select-none overflow-y-auto">
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
              Management Modules
            </div>

            {accessibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-heading font-medium transition-all ${
                    isActive
                      ? "bg-brand-red text-white font-bold shadow-lg shadow-brand-red/25"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3 text-xs text-neutral-400 space-y-1">
              <div className="flex items-center justify-between text-white font-semibold">
                <span>Studio Currency</span>
                <span className="text-brand-red font-mono font-bold">LKR (Rs.)</span>
              </div>
              <p className="text-[10px] text-neutral-500">Monaragala Studio Platform v1.0</p>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-72 bg-brand-dark-card border-r border-white/10 p-6 flex flex-col justify-between overflow-y-auto z-50 animate-slide-up">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                  <BrandLogo size="sm" href="/admin" />
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-neutral-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {accessibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-brand-red text-white font-bold"
                            : "text-neutral-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link
                  href="/"
                  target="_blank"
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Website</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0A] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
