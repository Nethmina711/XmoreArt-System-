export type StaffRole = 
  | 'SUPER_ADMIN' 
  | 'MANAGER' 
  | 'DESIGNER' 
  | 'PHOTOGRAPHER' 
  | 'VIDEOGRAPHER' 
  | 'MARKETING' 
  | 'STAFF';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  phone?: string;
  photoUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address?: string;
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
  balance?: number;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'REQUIREMENTS_COLLECTED' 
  | 'QUOTATION_SENT' 
  | 'NEGOTIATION' 
  | 'APPROVED' 
  | 'PROJECT_STARTED' 
  | 'COMPLETED' 
  | 'PAID' 
  | 'ON_HOLD' 
  | 'CANCELLED' 
  | 'LOST';

export type LeadSource = 
  | 'Facebook' 
  | 'Instagram' 
  | 'TikTok' 
  | 'WhatsApp' 
  | 'Website' 
  | 'Google' 
  | 'Walk-in' 
  | 'Referral' 
  | 'Other';

export interface EnquiryAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface Enquiry {
  id: string;
  enquiryNumber: string; // e.g. XM-2026-00001
  customerId?: string;
  customerName: string;
  company?: string;
  phone: string;
  whatsapp: string;
  email: string;
  location?: string;
  service: string;
  secondaryServices?: string[];
  description: string;
  quantity?: string;
  dimensions?: string;
  deadline?: string;
  estimatedBudget?: string;
  source: LeadSource;
  attachments?: EnquiryAttachment[];
  status: EnquiryStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  notes?: string;
  quotationId?: string;
  createdAt: string;
  updatedAt: string;
}

export type QuotationStatus = 
  | 'DRAFT' 
  | 'SENT' 
  | 'VIEWED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'EXPIRED';

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. XM-Q-2026-00001
  enquiryId?: string;
  customerId: string;
  customerName: string;
  customerCompany?: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  title: string;
  items: QuotationItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
  notes?: string;
  terms?: string;
  validUntil: string;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'READY' 
  | 'DELIVERED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string; // e.g. XM-ORD-2026-0001
  quotationId?: string;
  customerId: string;
  customerName: string;
  service: string;
  description: string;
  amount: number;
  paidAmount: number;
  balance: number;
  deadline: string;
  status: OrderStatus;
  assignedTeam?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 
  | 'PLANNED' 
  | 'IN_PROGRESS' 
  | 'REVIEW' 
  | 'REVISION' 
  | 'COMPLETED' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface Project {
  id: string;
  projectNumber: string; // e.g. XM-PRJ-2026-0001
  orderId?: string;
  title: string;
  customerId: string;
  customerName: string;
  service: string;
  description: string;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  assignedTeam: { id: string; name: string; role: StaffRole }[];
  budget: number;
  files?: EnquiryAttachment[];
  notes?: string;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export interface Task {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  description?: string;
  assignedToId: string;
  assignedToName: string;
  priority: TaskPriority;
  deadline: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Card' | 'Online' | 'Other';

export interface Payment {
  id: string;
  paymentId: string; // e.g. XM-PAY-2026-0001
  customerId: string;
  customerName: string;
  orderId?: string;
  projectId?: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Printing' 
  | 'Equipment' 
  | 'Transport' 
  | 'Staff' 
  | 'Marketing' 
  | 'Office' 
  | 'Software' 
  | 'Other';

export interface Expense {
  id: string;
  expenseId: string; // e.g. XM-EXP-2026-0001
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  photo: string;
  email: string;
  phone: string;
  role: StaffRole;
  password?: string;
  specialization?: string;
  active: boolean;
  assignedProjectsCount?: number;
  assignedTasksCount?: number;
  createdAt: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'QUOTED' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  company?: string;
  email?: string;
  source: LeadSource;
  service: string;
  estimatedValue?: number;
  status: LeadStatus;
  assignedToId?: string;
  assignedToName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: 'Printing' | 'Branding' | 'Graphic Design' | 'Photography' | 'Videography' | 'Digital Marketing';
  client: string;
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  description: string;
  challenge?: string;
  solution?: string;
  deliverables: string[];
  tags: string[];
  date: string;
  featured: boolean;
  published: boolean;
  views?: number;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  coverImage: string;
  features: string[];
  subServices: string[];
  startingPrice: string;
  gallery: string[];
  faq: ServiceFAQ[];
  benefits: string[];
  processSteps: { title: string; desc: string }[];
  published: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  category: 'Wedding' | 'Branding' | 'Social Media' | 'Printing' | 'Photography' | 'Videography' | 'Custom';
  description: string;
  features: string[];
  price?: number;
  priceDisplay: string; // e.g. "Rs. 45,000" or "Starting from Rs. 75,000" or "Contact for Price"
  popular?: boolean;
  ctaText: string;
  image?: string;
  published: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedDate: string;
  readTime: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  service: string;
}

export interface WebsiteContent {
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    highlightWord: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    bgVideoUrl?: string;
    bgImageUrl: string;
  };
  about: {
    title: string;
    subtitle: string;
    storyParagraphs: string[];
    mission: string;
    vision: string;
    stats: { label: string; value: string }[];
  };
  whyXmore: {
    title: string;
    subtitle: string;
    points: { title: string; desc: string; icon: string }[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: { number: string; title: string; desc: string }[];
  };
  testimonials: Testimonial[];
  clientLogos: { name: string; logoUrl: string }[];
  faqs: ServiceFAQ[];
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  address: string;
  city: string;
  district: string;
  province: string;
  country: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string; // numeric format with country code e.g. 94771234567
  whatsappDisplay: string; // e.g. "+94 77 123 4567"
  email: string;
  businessHours: string;
  googleMapsEmbedUrl: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube?: string;
    linkedin?: string;
  };
  currencySymbol: string; // "Rs."
  currencyCode: string; // "LKR"
  taxPercentage: number;
  quotationTerms: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ENQUIRY' | 'QUOTATION' | 'PROJECT' | 'TASK' | 'PAYMENT' | 'SYSTEM';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  entityType: 'CUSTOMER' | 'ENQUIRY' | 'QUOTATION' | 'ORDER' | 'PROJECT' | 'TASK' | 'PAYMENT' | 'EXPENSE' | 'CMS' | 'BOOKING' | 'OTHER';
  entityId: string;
  entityTitle: string;
  action: string;
  performedBy: string;
  details?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// WEDDING & PRODUCTION SHOOT BOOKINGS & CALENDAR MODELS
// -------------------------------------------------------------
export type ShootType =
  | 'WEDDING_FULL'        // Full Day Wedding (Poruwa / Church + Reception)
  | 'WEDDING_HOMECOMING'  // Homecoming Function
  | 'PRE_WEDDING'         // Pre-shoot / Engagement / Outdoor Couple
  | 'MODEL_PORTFOLIO'     // Model / Fashion / Glamour Shoot
  | 'COMMERCIAL_VIDEO'    // Brand Ad / Corporate / Product Video
  | 'EVENT_COVERAGE'      // Birthday, Anniversary, Corporate Event
  | 'STUDIO_PORTRAIT'     // In-Studio Family, Graduation, Baby Shoot
  | 'DRONE_SURVEY';       // Aerial / Real Estate Videography

export type BookingStatus =
  | 'INQUIRY'             // Initial Request / Slot Hold
  | 'ADVANCE_PAID'        // Date Confirmed with Advance Deposit
  | 'CREW_ASSIGNED'       // Photographers & Drone crew confirmed
  | 'SHOOTING_TODAY'      // Active on location today
  | 'POST_PRODUCTION'     // Editing & Color Grading in progress
  | 'ALBUM_PROOFING'      // Album layout sent to couple for review
  | 'COMPLETED'           // Final Luxury Box & high-res files delivered
  | 'CANCELLED';

export interface AuspiciousTimes {
  dressingTime?: string;
  poruwaCeremony?: string;
  cakeCutting?: string;
  goingAway?: string;
  otherNotes?: string;
}

export interface CrewMemberAssignment {
  staffId: string;
  staffName: string;
  role: string; // e.g. Lead Photographer, Drone Pilot, Lead Cinematographer, Assistant
  phone?: string;
}

export interface BookingDeliverables {
  rawPhotosDelivered: boolean;
  teaserVideoDelivered: boolean;
  cinematicFilmDelivered: boolean;
  albumProofApproved: boolean;
  albumPrinted: boolean;
  woodenBoxDelivered: boolean;
}

export interface ShootBooking {
  id: string;
  bookingNumber: string; // e.g. XM-BKG-2026-0001
  shootType: ShootType;
  title: string; // e.g. "Kasun & Sanduni Wedding Day"
  clientName: string;
  clientPhone: string;
  clientWhatsapp: string;
  clientEmail?: string;
  
  // Date & Logistics
  eventDate: string; // YYYY-MM-DD
  endDate?: string;
  startTime: string; // e.g. "06:00 AM"
  endTime: string; // e.g. "11:30 PM"
  locationName: string; // e.g. "Grand Monarch Hotel, Wellawaya"
  locationAddress?: string;
  auspiciousTimes?: AuspiciousTimes;
  
  // Package & Financials
  packageName: string;
  packagePrice: number;
  addons: {
    id: string;
    name: string;
    price: number;
  }[];
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: 'UNPAID' | 'ADVANCE_PAID' | 'FULLY_PAID';
  
  // Creative Crew Assigned
  crew: CrewMemberAssignment[];
  
  // Equipment / Gear Checklist
  gearList?: string[];
  
  // Deliverables
  deliverables: BookingDeliverables;
  
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ShootPackageOption {
  id: string;
  type: ShootType;
  title: string;
  subtitle: string;
  basePrice: number;
  popular?: boolean;
}

export interface ShootAddonOption {
  id: string;
  name: string;
  price: number;
  desc: string;
}

