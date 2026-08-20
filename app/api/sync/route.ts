import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  initialCompanySettings,
  initialWebsiteContent,
  initialServices,
  initialPortfolioProjects,
  initialPackages,
  initialBlogPosts,
  initialEmployees,
  initialCustomers,
  initialEnquiries,
  initialQuotations,
  initialOrders,
  initialProjects,
  initialTasks,
  initialPayments,
  initialExpenses,
  initialLeads,
  initialNotifications,
  initialActivityLogs,
  initialBookings,
  initialShootPackages,
  initialShootAddons
} from "@/lib/data/seedData";

// In-memory persistent cache for serverless runtime
let memoryDb: Record<string, any> = {
  xmore_settings_final: initialCompanySettings,
  xmore_website_content_final: initialWebsiteContent,
  xmore_services_final: initialServices,
  xmore_portfolio_final: initialPortfolioProjects,
  xmore_packages_final: initialPackages,
  xmore_blog_final: initialBlogPosts,
  xmore_employees_final: initialEmployees,
  xmore_customers_final: initialCustomers,
  xmore_enquiries_final: initialEnquiries,
  xmore_quotations_final: initialQuotations,
  xmore_orders_final: initialOrders,
  xmore_projects_final: initialProjects,
  xmore_tasks_final: initialTasks,
  xmore_payments_final: initialPayments,
  xmore_expenses_final: initialExpenses,
  xmore_leads_final: initialLeads,
  xmore_notifications_final: initialNotifications,
  xmore_activity_logs_final: initialActivityLogs,
  xmore_bookings_final: initialBookings,
  xmore_shoot_packages_final: initialShootPackages,
  xmore_shoot_addons_final: initialShootAddons,
  _lastUpdated: new Date().toISOString(),
};

// File-based persistence helper for local & server environments
const getDbFilePath = () => {
  const tmpDir = process.env.NODE_ENV === "production" ? "/tmp" : path.join(process.cwd(), ".data");
  if (!fs.existsSync(tmpDir)) {
    try {
      fs.mkdirSync(tmpDir, { recursive: true });
    } catch {
      // Non-blocking
    }
  }
  return path.join(tmpDir, "xmore_cloud_db.json");
};

const loadPersistedDb = () => {
  try {
    const filePath = getDbFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      memoryDb = { ...memoryDb, ...parsed };
    }
  } catch (err) {
    console.warn("Could not read persistent DB file:", err);
  }
};

const savePersistedDb = () => {
  try {
    const filePath = getDbFilePath();
    fs.writeFileSync(filePath, JSON.stringify(memoryDb, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write persistent DB file:", err);
  }
};

// Load existing file if present on cold start
loadPersistedDb();

export async function GET(request: Request) {
  loadPersistedDb();

  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key) {
    return NextResponse.json({
      success: true,
      key,
      data: memoryDb[key] ?? null,
      lastUpdated: memoryDb._lastUpdated,
    });
  }

  return NextResponse.json({
    success: true,
    data: memoryDb,
    lastUpdated: memoryDb._lastUpdated,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, fullSync } = body;

    loadPersistedDb();

    if (fullSync && typeof fullSync === "object") {
      memoryDb = {
        ...memoryDb,
        ...fullSync,
        _lastUpdated: new Date().toISOString(),
      };
      savePersistedDb();

      return NextResponse.json({
        success: true,
        message: "Full database synchronized across all devices successfully",
        lastUpdated: memoryDb._lastUpdated,
      });
    }

    if (key && value !== undefined) {
      memoryDb[key] = value;
      memoryDb._lastUpdated = new Date().toISOString();
      savePersistedDb();

      return NextResponse.json({
        success: true,
        key,
        message: `Key "${key}" updated successfully`,
        lastUpdated: memoryDb._lastUpdated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid payload format. Expected 'key' and 'value' or 'fullSync'." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process sync request" },
      { status: 500 }
    );
  }
}
