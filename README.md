# XMORE ART SOLUTIONS — Digital Business Platform & Creative Studio

A complete, production-ready full-stack digital business platform built for **XMORE ART SOLUTIONS** in **Monaragala, Sri Lanka**.

---

## 🌟 Platform Capabilities

1. **Premium Public Creative Website**:
   - Modern agency aesthetics with dark luxury palette & curated animations.
   - Comprehensive services showcase (Printing, Graphic Design, Digital Marketing, Photography, 4K Videography, Branding).
   - High-impact Portfolio CMS & Client Case Studies.
   - Transparent Pricing Packages & Interactive Service Inquiries.
   - Direct WhatsApp Floating Button linked to `+94 71 666 6643`.

2. **Interactive Wedding & Production Shoot Booking Engine (`/book`)**:
   - Client multi-step booking wizard for Weddings, Pre-shoots, Homecoming, Model Portfolios & Events.
   - Date & Time slot picker with venue location selector.
   - Sri Lankan Auspicious (Nakath) schedule tracker (Dressing, Poruwa, Cake cutting, Going away).
   - Luxury Add-ons (4K Drone, 12x24 Flush Mount Album, Same-Day Teaser, Live Stream).
   - Instant 25% booking advance calculation and direct WhatsApp booking dispatch.

3. **Internal Operations & Shoot Booking Calendar (`/admin/bookings`)**:
   - Visual Month / Week / Day interactive calendar grid.
   - Creative Crew Assignment Hub (Lead Photographer, Videographer, Drone Operator, Editor).
   - Equipment & Camera Kit Preparation Checklist.
   - 1-Click WhatsApp Call Sheet Dispatcher for staff.
   - 1-Click WhatsApp Client Logistics Reminders.
   - Post-production milestone delivery checklist.

4. **Executive CRM & Quotation Generator**:
   - Quotation Builder with itemized pricing, discounts, tax, and automated WhatsApp delivery.
   - Customer Directory with lifetime spend and credit balances.
   - Orders & Production Job Desk with deposit and balance tracking.
   - 4-Column Kanban Project & Task Suite.
   - Financial Ledgers for Payments & Expenses.
   - Inbound Leads Funnel (Facebook Ads, TikTok, Google, WhatsApp, Walk-ins).
   - Financial Analytics & Net Profit Reporting.
   - Staff Management & Encrypted Login Portal.

---

## 🔑 Master Admin Credentials

- **Sign In URL**: `/admin/login`
- **Email / Username**: `miyuru@xmoreart.lk` *(or simply `miyuru` / `admin`)*
- **Password**: `admin1234`
- **Role**: `SUPER_ADMIN` (Full administrative privileges)

---

## 🚀 3-Minute Deployment Guide (GitHub & Vercel)

This application is 100% configured for **Vercel** with **$0/month free tier hosting**, global edge CDN, and automated HTTPS SSL certificates.

### Step 1: Push Code to GitHub
Open your terminal inside this project folder:

```bash
# 1. Initialize Git repository (if not already done)
git init

# 2. Add all clean production files
git add .

# 3. Commit your production release
git commit -m "feat: XMORE ART SOLUTIONS Production Release v1.0"

# 4. Link to your GitHub repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/xmore-system.git

# 5. Push code
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy on Vercel ($0 / Month)

1. Go to **[https://vercel.com](https://vercel.com)** and sign in with your GitHub account.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your `xmore-system` repository and click **"Import"**.
4. Keep the default settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **"Deploy"**.

Your website will be live globally within ~60 seconds at `https://xmore-system.vercel.app`!

---

### Step 3: Connect Your Custom Domain (e.g. `xmoreart.lk` or `xmore.lk`)

1. Inside your Vercel Project Dashboard, navigate to **Settings** &rarr; **Domains**.
2. Type your domain (e.g. `xmoreart.lk` or `www.xmoreart.lk`) and click **Add**.
3. Add the two DNS records shown in Vercel to your domain registrar (e.g. LK Domain Registry / Cloudflare):
   - **Type `A`**: `76.76.21.21` (Host: `@`)
   - **Type `CNAME`**: `cname.vercel-dns.com` (Host: `www`)
4. Vercel will automatically verify DNS and issue a free SSL Certificate (HTTPS).

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run production build check
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the public site or [http://localhost:3000/admin](http://localhost:3000/admin) to access the operations workspace.
