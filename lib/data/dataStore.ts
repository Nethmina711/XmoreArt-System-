"use client";

import { 
  Customer, 
  Enquiry, 
  Quotation, 
  Order, 
  Project, 
  Task, 
  Payment, 
  Expense, 
  Employee, 
  Lead, 
  PortfolioProject, 
  ServiceItem, 
  PackageItem, 
  BlogPost, 
  WebsiteContent, 
  CompanySettings, 
  AppNotification, 
  ActivityLog,
  ShootBooking,
  ShootPackageOption,
  ShootAddonOption
} from "../types";

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
} from "./seedData";

const STORAGE_KEYS = {
  SETTINGS: "xmore_settings_final",
  CONTENT: "xmore_website_content_final",
  SERVICES: "xmore_services_final",
  PORTFOLIO: "xmore_portfolio_final",
  PACKAGES: "xmore_packages_final",
  BLOG: "xmore_blog_final",
  EMPLOYEES: "xmore_employees_final",
  CUSTOMERS: "xmore_customers_final",
  ENQUIRIES: "xmore_enquiries_final",
  QUOTATIONS: "xmore_quotations_final",
  ORDERS: "xmore_orders_final",
  PROJECTS: "xmore_projects_final",
  TASKS: "xmore_tasks_final",
  PAYMENTS: "xmore_payments_final",
  EXPENSES: "xmore_expenses_final",
  LEADS: "xmore_leads_final",
  NOTIFICATIONS: "xmore_notifications_final",
  ACTIVITY_LOGS: "xmore_activity_logs_final",
  BOOKINGS: "xmore_bookings_final",
  SHOOT_PACKAGES: "xmore_shoot_packages_final",
  SHOOT_ADDONS: "xmore_shoot_addons_final",
};

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("xmore_data_updated"));
  } catch (err) {
    console.error(`Error saving to localStorage ${key}:`, err);
  }
}

export const DataStore = {
  // Settings
  getSettings: (): CompanySettings => getItem(STORAGE_KEYS.SETTINGS, initialCompanySettings),
  updateSettings: (newSettings: Partial<CompanySettings>): CompanySettings => {
    const current = DataStore.getSettings();
    const updated = { ...current, ...newSettings };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    DataStore.logActivity({
      entityType: "CMS",
      entityId: "settings",
      entityTitle: "Company Settings",
      action: "Settings Updated",
      performedBy: "Admin",
      details: "Updated business contact/pricing configuration",
    });
    return updated;
  },

  // Website Content
  getWebsiteContent: (): WebsiteContent => getItem(STORAGE_KEYS.CONTENT, initialWebsiteContent),
  updateWebsiteContent: (newContent: Partial<WebsiteContent>): WebsiteContent => {
    const current = DataStore.getWebsiteContent();
    const updated = { ...current, ...newContent };
    setItem(STORAGE_KEYS.CONTENT, updated);
    DataStore.logActivity({
      entityType: "CMS",
      entityId: "website-content",
      entityTitle: "Website Content",
      action: "Content Updated",
      performedBy: "Admin",
    });
    return updated;
  },

  // Services
  getServices: (): ServiceItem[] => getItem(STORAGE_KEYS.SERVICES, initialServices),
  getServiceBySlug: (slug: string): ServiceItem | undefined => {
    const list = DataStore.getServices();
    return list.find(s => s.slug === slug);
  },
  saveService: (service: ServiceItem): void => {
    const list = DataStore.getServices();
    const index = list.findIndex(s => s.id === service.id || s.slug === service.slug);
    if (index >= 0) {
      list[index] = service;
    } else {
      list.push(service);
    }
    setItem(STORAGE_KEYS.SERVICES, list);
  },
  deleteService: (id: string): void => {
    const list = DataStore.getServices().filter(s => s.id !== id && s.slug !== id);
    setItem(STORAGE_KEYS.SERVICES, list);
  },

  // Portfolio
  getPortfolioProjects: (): PortfolioProject[] => getItem(STORAGE_KEYS.PORTFOLIO, initialPortfolioProjects),
  getPortfolioBySlug: (slug: string): PortfolioProject | undefined => {
    const list = DataStore.getPortfolioProjects();
    return list.find(p => p.slug === slug);
  },
  savePortfolioProject: (project: PortfolioProject): void => {
    const list = DataStore.getPortfolioProjects();
    const index = list.findIndex(p => p.id === project.id);
    if (index >= 0) {
      list[index] = project;
    } else {
      list.unshift(project);
    }
    setItem(STORAGE_KEYS.PORTFOLIO, list);
    DataStore.logActivity({
      entityType: "CMS",
      entityId: project.id,
      entityTitle: project.title,
      action: index >= 0 ? "Portfolio Updated" : "Portfolio Created",
      performedBy: "Admin",
    });
  },
  deletePortfolioProject: (id: string): void => {
    const list = DataStore.getPortfolioProjects().filter(p => p.id !== id);
    setItem(STORAGE_KEYS.PORTFOLIO, list);
  },

  // Packages
  getPackages: (): PackageItem[] => getItem(STORAGE_KEYS.PACKAGES, initialPackages),
  savePackage: (pkg: PackageItem): void => {
    const list = DataStore.getPackages();
    const index = list.findIndex(p => p.id === pkg.id);
    if (index >= 0) list[index] = pkg;
    else list.push(pkg);
    setItem(STORAGE_KEYS.PACKAGES, list);
  },
  deletePackage: (id: string): void => {
    const list = DataStore.getPackages().filter(p => p.id !== id);
    setItem(STORAGE_KEYS.PACKAGES, list);
  },

  // Blog Posts
  getBlogPosts: (): BlogPost[] => getItem(STORAGE_KEYS.BLOG, initialBlogPosts),
  getBlogPostBySlug: (slug: string): BlogPost | undefined => {
    const list = DataStore.getBlogPosts();
    return list.find(b => b.slug === slug);
  },
  saveBlogPost: (post: BlogPost): void => {
    const list = DataStore.getBlogPosts();
    const index = list.findIndex(b => b.id === post.id);
    if (index >= 0) list[index] = post;
    else list.unshift(post);
    setItem(STORAGE_KEYS.BLOG, list);
  },
  deleteBlogPost: (id: string): void => {
    const list = DataStore.getBlogPosts().filter(b => b.id !== id);
    setItem(STORAGE_KEYS.BLOG, list);
  },

  // Customers
  getCustomers: (): Customer[] => getItem(STORAGE_KEYS.CUSTOMERS, initialCustomers),
  getCustomerById: (id: string): Customer | undefined => {
    return DataStore.getCustomers().find(c => c.id === id);
  },
  saveCustomer: (customer: Customer): void => {
    const list = DataStore.getCustomers();
    const index = list.findIndex(c => c.id === customer.id);
    if (index >= 0) {
      list[index] = { ...customer, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...customer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setItem(STORAGE_KEYS.CUSTOMERS, list);
    DataStore.logActivity({
      entityType: "CUSTOMER",
      entityId: customer.id,
      entityTitle: customer.name,
      action: index >= 0 ? "Customer Updated" : "Customer Created",
      performedBy: "Staff",
    });
  },

  // Enquiries
  getEnquiries: (): Enquiry[] => getItem(STORAGE_KEYS.ENQUIRIES, initialEnquiries),
  getEnquiryById: (id: string): Enquiry | undefined => {
    return DataStore.getEnquiries().find(e => e.id === id);
  },
  saveEnquiry: (enquiry: Enquiry): void => {
    const list = DataStore.getEnquiries();
    const index = list.findIndex(e => e.id === enquiry.id);
    const isNew = index < 0;
    if (index >= 0) {
      list[index] = { ...enquiry, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...enquiry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setItem(STORAGE_KEYS.ENQUIRIES, list);

    if (isNew) {
      DataStore.addNotification({
        title: "New Enquiry Received",
        message: `${enquiry.customerName} submitted ${enquiry.service} enquiry (${enquiry.enquiryNumber}).`,
        type: "ENQUIRY",
        link: "/admin/enquiries",
      });
    }

    DataStore.logActivity({
      entityType: "ENQUIRY",
      entityId: enquiry.id,
      entityTitle: `${enquiry.enquiryNumber} - ${enquiry.customerName}`,
      action: isNew ? "Enquiry Submitted" : `Status Changed to ${enquiry.status}`,
      performedBy: enquiry.assignedStaffName || "Customer",
    });
  },

  // Quotations
  getQuotations: (): Quotation[] => getItem(STORAGE_KEYS.QUOTATIONS, initialQuotations),
  getQuotationById: (id: string): Quotation | undefined => {
    return DataStore.getQuotations().find(q => q.id === id);
  },
  saveQuotation: (quotation: Quotation): void => {
    const list = DataStore.getQuotations();
    const index = list.findIndex(q => q.id === quotation.id);
    const isNew = index < 0;
    if (index >= 0) {
      list[index] = { ...quotation, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...quotation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setItem(STORAGE_KEYS.QUOTATIONS, list);

    if (isNew) {
      DataStore.addNotification({
        title: "New Quotation Generated",
        message: `Quotation ${quotation.quotationNumber} (Rs. ${quotation.total.toLocaleString()}) created for ${quotation.customerName}.`,
        type: "QUOTATION",
        link: "/admin/quotations",
      });
    }

    DataStore.logActivity({
      entityType: "QUOTATION",
      entityId: quotation.id,
      entityTitle: `${quotation.quotationNumber} - ${quotation.customerName}`,
      action: isNew ? "Quotation Created" : `Quotation marked ${quotation.status}`,
      performedBy: "Staff",
      details: `Total: Rs. ${quotation.total.toLocaleString()}`,
    });
  },

  // Orders
  getOrders: (): Order[] => getItem(STORAGE_KEYS.ORDERS, initialOrders),
  getOrderById: (id: string): Order | undefined => {
    return DataStore.getOrders().find(o => o.id === id);
  },
  saveOrder: (order: Order): void => {
    const list = DataStore.getOrders();
    const index = list.findIndex(o => o.id === order.id);
    if (index >= 0) {
      list[index] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...order,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setItem(STORAGE_KEYS.ORDERS, list);
  },

  // Projects
  getProjects: (): Project[] => getItem(STORAGE_KEYS.PROJECTS, initialProjects),
  getProjectById: (id: string): Project | undefined => {
    return DataStore.getProjects().find(p => p.id === id);
  },
  saveProject: (project: Project): void => {
    const list = DataStore.getProjects();
    const index = list.findIndex(p => p.id === project.id);
    if (index >= 0) {
      list[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setItem(STORAGE_KEYS.PROJECTS, list);
    DataStore.logActivity({
      entityType: "PROJECT",
      entityId: project.id,
      entityTitle: `${project.projectNumber} - ${project.title}`,
      action: index >= 0 ? `Project status: ${project.status}` : "Project Initiated",
      performedBy: "Team",
    });
  },

  // Tasks
  getTasks: (): Task[] => getItem(STORAGE_KEYS.TASKS, initialTasks),
  saveTask: (task: Task): void => {
    const list = DataStore.getTasks();
    const index = list.findIndex(t => t.id === task.id);
    if (index >= 0) {
      list[index] = { ...task, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setItem(STORAGE_KEYS.TASKS, list);
  },
  deleteTask: (id: string): void => {
    const list = DataStore.getTasks().filter(t => t.id !== id);
    setItem(STORAGE_KEYS.TASKS, list);
  },

  // Payments
  getPayments: (): Payment[] => getItem(STORAGE_KEYS.PAYMENTS, initialPayments),
  savePayment: (payment: Payment): void => {
    const list = DataStore.getPayments();
    list.unshift({
      ...payment,
      createdAt: new Date().toISOString()
    });
    setItem(STORAGE_KEYS.PAYMENTS, list);

    DataStore.addNotification({
      title: "Payment Recorded",
      message: `Received Rs. ${payment.amount.toLocaleString()} from ${payment.customerName} via ${payment.method}.`,
      type: "PAYMENT",
      link: "/admin/payments",
    });

    DataStore.logActivity({
      entityType: "PAYMENT",
      entityId: payment.id,
      entityTitle: payment.paymentId,
      action: `Payment Recorded (Rs. ${payment.amount.toLocaleString()})`,
      performedBy: "Accounts",
      details: `${payment.method} - Ref: ${payment.reference || "N/A"}`,
    });
  },

  // Expenses
  getExpenses: (): Expense[] => getItem(STORAGE_KEYS.EXPENSES, initialExpenses),
  saveExpense: (expense: Expense): void => {
    const list = DataStore.getExpenses();
    list.unshift({
      ...expense,
      createdAt: new Date().toISOString()
    });
    setItem(STORAGE_KEYS.EXPENSES, list);

    DataStore.logActivity({
      entityType: "EXPENSE",
      entityId: expense.id,
      entityTitle: expense.expenseId,
      action: `Expense Logged: ${expense.category}`,
      performedBy: "Staff",
      details: `Rs. ${expense.amount.toLocaleString()} - ${expense.description}`,
    });
  },

  // Leads
  getLeads: (): Lead[] => getItem(STORAGE_KEYS.LEADS, initialLeads),
  saveLead: (lead: Lead): void => {
    const list = DataStore.getLeads();
    const index = list.findIndex(l => l.id === lead.id);
    if (index >= 0) {
      list[index] = { ...lead, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...lead,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setItem(STORAGE_KEYS.LEADS, list);
  },

  // Employees
  getEmployees: (): Employee[] => {
    const list = getItem<Employee[]>(STORAGE_KEYS.EMPLOYEES, initialEmployees);
    if (!list || list.length === 0) {
      setItem(STORAGE_KEYS.EMPLOYEES, initialEmployees);
      return initialEmployees;
    }
    // Ensure master admin is always preserved with password
    const hasAdmin = list.some(e => e.role === "SUPER_ADMIN" || e.email.toLowerCase() === "miyuru@xmoreart.lk");
    if (!hasAdmin) {
      list.unshift(initialEmployees[0]);
      setItem(STORAGE_KEYS.EMPLOYEES, list);
    }
    return list;
  },
  saveEmployee: (emp: Employee): void => {
    const list = DataStore.getEmployees();
    const cleanEmp: Employee = {
      ...emp,
      email: emp.email.trim().toLowerCase(),
      name: emp.name.trim(),
      phone: emp.phone.trim(),
      password: (emp.password || "admin1234").trim(),
      active: emp.active !== false,
    };
    const index = list.findIndex(e => e.id === cleanEmp.id || e.email.toLowerCase() === cleanEmp.email.toLowerCase());
    if (index >= 0) {
      list[index] = { ...list[index], ...cleanEmp };
    } else {
      list.push(cleanEmp);
    }
    setItem(STORAGE_KEYS.EMPLOYEES, list);

    try {
      DataStore.logActivity({
        entityType: "OTHER",
        entityId: cleanEmp.id,
        entityTitle: cleanEmp.name,
        action: index >= 0 ? "Staff Account Updated" : "New Staff Account Created",
        performedBy: "Super Admin",
        details: `Role: ${cleanEmp.role} - Email: ${cleanEmp.email}`,
      });
    } catch {
      // Non-blocking
    }
  },

  // Notifications
  getNotifications: (): AppNotification[] => getItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications),
  markNotificationAsRead: (id: string): void => {
    const list = DataStore.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },
  markAllNotificationsAsRead: (): void => {
    const list = DataStore.getNotifications().map(n => ({ ...n, read: true }));
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },
  addNotification: (notif: Omit<AppNotification, "id" | "read" | "createdAt">): void => {
    const list = DataStore.getNotifications();
    list.unshift({
      id: `notif-${Date.now()}`,
      ...notif,
      read: false,
      createdAt: new Date().toISOString()
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  // Activity Logs
  getActivityLogs: (): ActivityLog[] => getItem(STORAGE_KEYS.ACTIVITY_LOGS, initialActivityLogs),
  logActivity: (log: Omit<ActivityLog, "id" | "createdAt">): void => {
    const list = DataStore.getActivityLogs();
    list.unshift({
      id: `act-${Date.now()}`,
      ...log,
      createdAt: new Date().toISOString()
    });
    setItem(STORAGE_KEYS.ACTIVITY_LOGS, list);
  },

  // Shoot Bookings & Calendar
  getBookings: (): ShootBooking[] => getItem(STORAGE_KEYS.BOOKINGS, initialBookings),
  getBookingById: (id: string): ShootBooking | undefined => {
    return DataStore.getBookings().find(b => b.id === id || b.bookingNumber === id);
  },
  saveBooking: (booking: ShootBooking): void => {
    const list = DataStore.getBookings();
    const index = list.findIndex(b => b.id === booking.id);
    if (index >= 0) {
      list[index] = { ...booking, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...booking,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setItem(STORAGE_KEYS.BOOKINGS, list);

    DataStore.addNotification({
      title: index >= 0 ? "Shoot Booking Updated" : "New Shoot Booking Created",
      message: `${booking.title} (${booking.shootType.replace("_", " ")}) on ${booking.eventDate}. Total: Rs. ${booking.totalAmount.toLocaleString()}`,
      type: "ENQUIRY",
      link: "/admin/bookings",
    });

    DataStore.logActivity({
      entityType: "BOOKING",
      entityId: booking.id,
      entityTitle: booking.title,
      action: index >= 0 ? "Shoot Booking Updated" : "New Shoot Booking Scheduled",
      performedBy: "Staff",
      details: `${booking.eventDate} @ ${booking.locationName} - Advance: Rs. ${booking.advancePaid.toLocaleString()}`,
    });
  },
  deleteBooking: (id: string): void => {
    const list = DataStore.getBookings().filter(b => b.id !== id);
    setItem(STORAGE_KEYS.BOOKINGS, list);
  },

  // Shoot Packages Configuration (for /book wizard)
  getShootPackages: (): ShootPackageOption[] => getItem(STORAGE_KEYS.SHOOT_PACKAGES, initialShootPackages),
  saveShootPackage: (pkg: ShootPackageOption): void => {
    const list = DataStore.getShootPackages();
    const index = list.findIndex(p => p.id === pkg.id || p.type === pkg.type);
    if (index >= 0) {
      list[index] = pkg;
    } else {
      list.push(pkg);
    }
    setItem(STORAGE_KEYS.SHOOT_PACKAGES, list);
  },
  deleteShootPackage: (id: string): void => {
    const list = DataStore.getShootPackages().filter(p => p.id !== id && p.type !== id);
    setItem(STORAGE_KEYS.SHOOT_PACKAGES, list);
  },

  // Shoot Addons Configuration (for /book wizard)
  getShootAddons: (): ShootAddonOption[] => getItem(STORAGE_KEYS.SHOOT_ADDONS, initialShootAddons),
  saveShootAddon: (addon: ShootAddonOption): void => {
    const list = DataStore.getShootAddons();
    const index = list.findIndex(a => a.id === addon.id);
    if (index >= 0) {
      list[index] = addon;
    } else {
      list.push(addon);
    }
    setItem(STORAGE_KEYS.SHOOT_ADDONS, list);
  },
  deleteShootAddon: (id: string): void => {
    const list = DataStore.getShootAddons().filter(a => a.id !== id);
    setItem(STORAGE_KEYS.SHOOT_ADDONS, list);
  },

  // Reset Data Seeder
  resetToInitialSeedData: (): void => {
    if (typeof window === "undefined") return;
    localStorage.clear();
    setItem(STORAGE_KEYS.SETTINGS, initialCompanySettings);
    setItem(STORAGE_KEYS.CONTENT, initialWebsiteContent);
    setItem(STORAGE_KEYS.SERVICES, initialServices);
    setItem(STORAGE_KEYS.PORTFOLIO, initialPortfolioProjects);
    setItem(STORAGE_KEYS.PACKAGES, initialPackages);
    setItem(STORAGE_KEYS.BLOG, initialBlogPosts);
    setItem(STORAGE_KEYS.EMPLOYEES, initialEmployees);
    setItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
    setItem(STORAGE_KEYS.ENQUIRIES, initialEnquiries);
    setItem(STORAGE_KEYS.QUOTATIONS, initialQuotations);
    setItem(STORAGE_KEYS.ORDERS, initialOrders);
    setItem(STORAGE_KEYS.PROJECTS, initialProjects);
    setItem(STORAGE_KEYS.TASKS, initialTasks);
    setItem(STORAGE_KEYS.PAYMENTS, initialPayments);
    setItem(STORAGE_KEYS.EXPENSES, initialExpenses);
    setItem(STORAGE_KEYS.LEADS, initialLeads);
    setItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    setItem(STORAGE_KEYS.ACTIVITY_LOGS, initialActivityLogs);
    setItem(STORAGE_KEYS.BOOKINGS, initialBookings);
    setItem(STORAGE_KEYS.SHOOT_PACKAGES, initialShootPackages);
    setItem(STORAGE_KEYS.SHOOT_ADDONS, initialShootAddons);
    window.dispatchEvent(new Event("xmore_data_updated"));
  }
};
