import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StaffRole } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return "Rs. 0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `Rs. ${num.toLocaleString("en-LK", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function generateEnquiryNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `XM-${year}-${random}`;
}

export function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `XM-Q-${year}-${random}`;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `XM-ORD-${year}-${random}`;
}

export function generateProjectNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `XM-PRJ-${year}-${random}`;
}

export function generatePaymentNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `XM-PAY-${year}-${random}`;
}

export function generateExpenseNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `XM-EXP-${year}-${random}`;
}

export function generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `XM-BKG-${year}-${random}`;
}

export function getWhatsAppLink(rawNumber: string, message: string = ""): string {
  const cleaned = rawNumber.replace(/[^0-9]/g, "");
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleaned}${encodedMsg ? `?text=${encodedMsg}` : ""}`;
}

export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  SUPER_ADMIN: [
    "dashboard", "bookings", "customers", "enquiries", "quotations", "orders", 
    "projects", "tasks", "payments", "expenses", "leads", 
    "employees", "cms", "reports", "notifications", "settings"
  ],
  MANAGER: [
    "dashboard", "bookings", "customers", "enquiries", "quotations", "orders", 
    "projects", "tasks", "payments", "expenses", "leads", 
    "cms", "reports", "notifications"
  ],
  DESIGNER: [
    "dashboard", "bookings", "projects", "tasks", "portfolio", "notifications"
  ],
  PHOTOGRAPHER: [
    "dashboard", "bookings", "projects", "tasks", "portfolio", "notifications"
  ],
  VIDEOGRAPHER: [
    "dashboard", "bookings", "projects", "tasks", "portfolio", "notifications"
  ],
  MARKETING: [
    "dashboard", "bookings", "leads", "customers", "cms", "blog", "notifications", "reports"
  ],
  STAFF: [
    "dashboard", "bookings", "tasks", "projects", "notifications"
  ]
};

export function canAccessModule(role: StaffRole | undefined, module: string): boolean {
  if (!role) return false;
  if (role === "SUPER_ADMIN") return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(module);
}
