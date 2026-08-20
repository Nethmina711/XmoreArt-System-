"use client";

const SYNC_ENDPOINT = "/api/sync";

export const CloudSync = {
  /**
   * Push a single key-value update to the central cloud API
   */
  pushKey: async (key: string, value: any): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    try {
      const res = await fetch(SYNC_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      return res.ok;
    } catch (err) {
      console.warn(`[CloudSync] Background push error for ${key}:`, err);
      return false;
    }
  },

  /**
   * Push all current localStorage collections to the central cloud API
   * Used when admin wants to broadcast their laptop customization to all other devices & visitors
   */
  pushAllToCloud: async (): Promise<{ success: boolean; message?: string }> => {
    if (typeof window === "undefined") return { success: false, message: "Window not defined" };
    try {
      const fullSync: Record<string, any> = {};
      
      const keysToSync = [
        "xmore_settings_final",
        "xmore_website_content_final",
        "xmore_services_final",
        "xmore_portfolio_final",
        "xmore_packages_final",
        "xmore_blog_final",
        "xmore_employees_final",
        "xmore_customers_final",
        "xmore_enquiries_final",
        "xmore_quotations_final",
        "xmore_orders_final",
        "xmore_projects_final",
        "xmore_tasks_final",
        "xmore_payments_final",
        "xmore_expenses_final",
        "xmore_leads_final",
        "xmore_notifications_final",
        "xmore_activity_logs_final",
        "xmore_bookings_final",
        "xmore_shoot_packages_final",
        "xmore_shoot_addons_final",
      ];

      for (const key of keysToSync) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            fullSync[key] = JSON.parse(item);
          } catch {
            // Skip invalid json
          }
        }
      }

      const res = await fetch(SYNC_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullSync }),
      });

      const data = await res.json();
      return { success: res.ok, message: data.message || (res.ok ? "Synced successfully" : "Sync failed") };
    } catch (err: any) {
      console.error("[CloudSync] Push all error:", err);
      return { success: false, message: err.message || "Network error syncing to cloud" };
    }
  },

  /**
   * Pull all collections from the central cloud and update localStorage
   * Updates other browsers, phones, and new visitors with the latest admin customizations
   */
  pullFromCloud: async (force = false): Promise<{ success: boolean; count?: number }> => {
    if (typeof window === "undefined") return { success: false };
    try {
      const res = await fetch(SYNC_ENDPOINT, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      if (!res.ok) return { success: false };

      const json = await res.json();
      if (!json.success || !json.data) return { success: false };

      const cloudData = json.data;
      let updateCount = 0;

      for (const [key, value] of Object.entries(cloudData)) {
        if (key.startsWith("xmore_")) {
          const current = localStorage.getItem(key);
          const newValueStr = JSON.stringify(value);

          // If different, update localStorage
          if (force || current !== newValueStr) {
            localStorage.setItem(key, newValueStr);
            updateCount++;
          }
        }
      }

      if (updateCount > 0) {
        window.dispatchEvent(new Event("xmore_data_updated"));
      }

      return { success: true, count: updateCount };
    } catch (err) {
      console.warn("[CloudSync] Background pull error:", err);
      return { success: false };
    }
  },

  /**
   * Export complete database as a downloadable JSON file
   */
  exportBackupJson: (): void => {
    if (typeof window === "undefined") return;
    const exportData: Record<string, any> = {
      _exportDate: new Date().toISOString(),
      _platform: "XMORE ART SOLUTIONS Cloud Suite",
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("xmore_")) {
        try {
          exportData[key] = JSON.parse(localStorage.getItem(key) || "");
        } catch {
          exportData[key] = localStorage.getItem(key);
        }
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xmore_database_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Import complete database from a JSON file and broadcast to cloud
   */
  importBackupJson: async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);

          let importedCount = 0;
          for (const [key, value] of Object.entries(parsed)) {
            if (key.startsWith("xmore_")) {
              localStorage.setItem(key, JSON.stringify(value));
              importedCount++;
            }
          }

          window.dispatchEvent(new Event("xmore_data_updated"));

          // Automatically push the imported backup to the central cloud
          await CloudSync.pushAllToCloud();

          resolve({
            success: true,
            message: `Successfully imported ${importedCount} data collections and synchronized with cloud!`,
          });
        } catch (err: any) {
          resolve({
            success: false,
            message: `Failed to parse backup file: ${err.message}`,
          });
        }
      };
      reader.readAsText(file);
    });
  },
};
