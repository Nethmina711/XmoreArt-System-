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

export const initialCompanySettings: CompanySettings = {
  companyName: "XMORE ART SOLUTIONS",
  tagline: "Creative solutions under one roof.",
  address: "No. 48, Wellawaya Road, Monaragala",
  city: "Monaragala",
  district: "Monaragala",
  province: "Uva Province",
  country: "Sri Lanka",
  phone: "+94 71 666 6643",
  phoneDisplay: "+94 71 666 6643",
  whatsappNumber: "94716666643",
  whatsappDisplay: "+94 71 666 6643",
  email: "hello@xmoreart.lk",
  businessHours: "Monday – Saturday: 8:30 AM – 6:30 PM (Sunday by appointment)",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.85966453775!2d81.31481541819665!3d6.871968832962386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae467a758778f65%3A0x6b63d9171f114674!2sMonaragala!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk",
  socialLinks: {
    facebook: "https://facebook.com/xmoreartsolutions",
    instagram: "https://instagram.com/xmoreartsolutions",
    tiktok: "https://tiktok.com/@xmoreartsolutions",
    youtube: "https://youtube.com/@xmoreartsolutions",
    linkedin: "https://linkedin.com/company/xmoreartsolutions",
  },
  currencySymbol: "Rs.",
  currencyCode: "LKR",
  taxPercentage: 0,
  quotationTerms: "1. Quotation is valid for 30 days from date of issue.\n2. 50% advance payment required to initiate design/production work.\n3. Balance payment upon final review & prior to delivery or file handover.\n4. Revisions: Up to 3 rounds of creative revisions included.\n5. Turnaround time starts upon approval of final artwork proofs.",
};

export const initialWebsiteContent: WebsiteContent = {
  hero: {
    badge: "CREATIVE & PRODUCTION AGENCY • MONARAGALA",
    titleLine1: "TURN YOUR IDEAS",
    titleLine2: "INTO",
    highlightWord: "IMPACT.",
    subtitle: "Printing, Digital Marketing, Design, Photography, Videography and Creative Solutions — all under one roof.",
    primaryCtaText: "GET A QUOTE",
    secondaryCtaText: "VIEW OUR WORK",
    bgImageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=2000&auto=format&fit=crop",
  },
  about: {
    title: "WE ENGINEER BOLD VISUAL EXPERIENCES",
    subtitle: "From Monaragala to across Sri Lanka, we elevate brands with unmatched creative craftsmanship.",
    storyParagraphs: [
      "Founded with a conviction that regional enterprises and modern brands deserve world-class creative firepower, XMORE ART SOLUTIONS is an integrated creative production powerhouse based in Monaragala, Sri Lanka.",
      "We operate as your complete in-house creative department. Instead of juggling separate printers, freelance designers, marketing agents, and videographers, Xmore unifies high-precision offset & digital printing, brand strategy, commercial video production, and high-impact digital marketing under one roof.",
      "Our team combines cutting-edge production machinery with editorial aesthetic rigor to deliver work that commands attention and drives tangible commercial growth."
    ],
    mission: "To deliver uncompromising creative quality, ultra-fast production turnaround, and cohesive branding solutions that empower businesses across Sri Lanka to lead their markets.",
    vision: "To become Sri Lanka's benchmark regional creative agency and multi-disciplinary production studio, renowned for innovation, reliability, and visual excellence.",
    stats: [
      { label: "Projects Delivered", value: "850+" },
      { label: "Active Business Clients", value: "240+" },
      { label: "Creative Services", value: "6 Core Verticals" },
      { label: "Client Satisfaction", value: "99.4%" },
    ]
  },
  whyXmore: {
    title: "WHY LEADING BUSINESSES CHOOSE XMORE",
    subtitle: "A relentless standard of craft, technology, and end-to-end execution.",
    points: [
      {
        title: "Creative Quality",
        desc: "World-class graphic design, high-definition cinematography, and premium print finishes engineered to make your brand impossible to ignore.",
        icon: "Sparkles"
      },
      {
        title: "Professional Service",
        desc: "Dedicated project coordinators, transparent milestones, real-time proofing, and strict confidentiality for your commercial assets.",
        icon: "ShieldCheck"
      },
      {
        title: "Fast Delivery",
        desc: "In-house production equipment and streamlined digital workflows enable rapid turnarounds without compromising pixel or print perfection.",
        icon: "Zap"
      },
      {
        title: "One Creative Partner",
        desc: "Zero fragmented suppliers. From initial logo concept and product packaging to event signage, video commercials, and social ad campaigns.",
        icon: "Layers"
      }
    ]
  },
  process: {
    title: "OUR 5-STEP CREATIVE ENGINE",
    subtitle: "A structured, frictionless journey from initial concept to commercial impact.",
    steps: [
      {
        number: "01",
        title: "Tell Us Your Idea",
        desc: "Submit your requirements via our interactive quote portal or meet our creative directors to outline your vision, objectives, and timeline."
      },
      {
        number: "02",
        title: "Plan & Strategize",
        desc: "We formulate the creative brief, material specs, visual direction, production storyboard, and transparent itemized quotation."
      },
      {
        number: "03",
        title: "Create & Craft",
        desc: "Our specialized designers, videographers, and print specialists develop high-fidelity prototypes, artwork proofs, and cinematic drafts."
      },
      {
        number: "04",
        title: "Deliver & Deploy",
        desc: "Precision printing, final master renders, physical quality inspection, and prompt delivery right to your business location."
      },
      {
        number: "05",
        title: "Grow Your Brand",
        desc: "Ongoing performance marketing, brand asset scaling, and campaign optimization to ensure long-term ROI."
      }
    ]
  },
  testimonials: [
    {
      id: "t-1",
      clientName: "Kasun Jayasundara",
      company: "Nilgiri Eco Resort & Spa, Ella",
      role: "Managing Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      text: "XMORE ART SOLUTIONS transformed our entire brand. From the luxurious gold-foiled menu boards and eco-friendly packaging to their cinematic resort promotional video, the quality rivals Colombo agencies at a fraction of the friction.",
      service: "Branding & Videography"
    },
    {
      id: "t-2",
      clientName: "Dr. Anoma Wijesinghe",
      company: "Apex Healthcare & Diagnostic Center",
      role: "Operations Director",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      text: "The speed and print precision from Xmore is unmatched in Uva province. They produced 5,000 corporate brochures, outdoor illuminated signage, and staff ID kits within 72 hours for our hospital launch.",
      service: "Printing & Signboards"
    },
    {
      id: "t-3",
      clientName: "Nuwan Bandara",
      company: "Ceylon Heritage Spices (Pvt) Ltd",
      role: "Head of Marketing",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      rating: 5,
      text: "Their social media management and TikTok video campaigns increased our direct export inquiries by 140% in just two months. They truly understand modern creative storytelling.",
      service: "Digital Marketing & Photography"
    }
  ],
  clientLogos: [
    { name: "Nilgiri Eco Resort", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop" },
    { name: "Apex Healthcare", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop" },
    { name: "Ceylon Heritage Spices", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop" },
    { name: "Uva Agro Organic", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop" },
    { name: "Monaragala City Hotel", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop" }
  ],
  faqs: [
    {
      question: "Where is XMORE ART SOLUTIONS located, and do you serve outside Monaragala?",
      answer: "Our central creative and production studio is located in Monaragala city. We actively serve businesses, hotels, wedding couples, and corporations across Monaragala, Badulla, Wellawaya, Ella, Hambantota, and islandwide with islandwide courier delivery for print orders."
    },
    {
      question: "How fast can I get a quotation for my project?",
      answer: "Using our online Quote Builder, you receive an instant preliminary estimation, and our accounts team issues a finalized itemized official quotation within 2 to 4 business hours."
    },
    {
      question: "Can I order custom sizes, paper stocks, and special finishes for printing?",
      answer: "Yes! We stock premium linen, textured, kraft, matte/gloss art boards, synthetic waterproof stickers, metallic foil stamping, spot UV, embossed finishes, and large format outdoor PVC and backlit vinyls."
    },
    {
      question: "Do you handle both photo and video coverage for events and weddings?",
      answer: "Absolutely. Our visual production department provides multi-camera 4K coverage, drone aerial cinematography, gimbal stabilization, on-site live highlights, and bespoke luxury photo albums."
    }
  ]
};

export const initialServices: ServiceItem[] = [
  {
    id: "srv-printing",
    slug: "printing",
    name: "Printing",
    shortDescription: "High-precision commercial, promotional, and large-format printing with premium finishes.",
    fullDescription: "From premium matte-laminated business cards and embossed certificates to 20-foot outdoor billboard banners and custom packaging boxes, Xmore's in-house production plant delivers vibrant color fidelity, durable substrates, and rapid turnaround.",
    iconName: "Printer",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "Rs. 2,500",
    features: [
      "Ultra-high DPI digital & offset printing",
      "Specialty finishes: Spot UV, Gold/Silver Foiling, Embossing",
      "Waterproof & UV-resistant outdoor banners",
      "Die-cut product labels and sticker sheets",
      "Express same-day dispatch available for select items"
    ],
    subServices: [
      "Business Cards (Matte, Gloss, Velvet, Textured)",
      "Flyers, Leaflets & Tri-fold Brochures",
      "Posters & Art Prints",
      "Outdoor Flex Banners & Roll-up Standees",
      "Stickers, Die-cut Labels & Product Seals",
      "Custom Wedding & Event Invitations",
      "Certificates & Parchment Printing",
      "Large Format Backlit Boards & Hoardings",
      "Custom Packaging Boxes & Paper Bags"
    ],
    benefits: [
      "Vibrant Pantone & CMYK color calibration",
      "Durable weather-resistant outdoor vinyls",
      "Bulk quantity discounts for corporate accounts",
      "Free sample proofing on bulk orders"
    ],
    processSteps: [
      { title: "Artwork Proofing", desc: "Digital prepress check for bleed, margin, and resolution." },
      { title: "Material Selection", desc: "Select from 30+ premium paper stocks, synthetics, and boards." },
      { title: "Production Run", desc: "High-speed precision printing and specialized surface finish." },
      { title: "Finishing & QC", desc: "Guillotine cutting, binding, creasing, and quality inspection." },
      { title: "Delivery", desc: "Protective packaging and courier delivery or studio pickup." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"
    ],
    faq: [
      { question: "What is the minimum quantity for business cards?", answer: "Standard packs start at 100 cards with optional double-sided matte lamination." },
      { question: "What file formats should I send for printing?", answer: "Print-ready PDF, Adobe Illustrator (.AI), Photoshop (.PSD), or high-res TIFF with 300 DPI and CMYK color profile." }
    ],
    published: true
  },
  {
    id: "srv-graphic-design",
    slug: "graphic-design",
    name: "Graphic Design",
    shortDescription: "Strategic visual identities, marketing collateral, and high-conversion commercial artwork.",
    fullDescription: "Great design communicates value in milliseconds. Our graphic design team crafts distinct visual language for forward-thinking brands, blending typography, color psychology, and composition to elevate your market presence.",
    iconName: "Palette",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "Rs. 5,000",
    features: [
      "Custom vector logo design & brand guideline books",
      "Social media post & story graphics bundles",
      "Advertising billboards & transit artwork",
      "Product packaging & label design with 3D mockups",
      "Full ownership and source files (AI, EPS, SVG, PNG, PDF)"
    ],
    subServices: [
      "Logo Design & Brand Identity Systems",
      "Social Media Post & Banner Graphics",
      "Advertising Artwork for Print & Digital",
      "Packaging Design & 3D Realistic Mockups",
      "Restaurant Menus & Catalogs",
      "Promotional Flyers, Posters & Billboards",
      "Event Backdrops & Stage Artworks",
      "Corporate Stationery & Presentation Decks"
    ],
    benefits: [
      "Original concepts crafted from strategic briefs",
      "Vector scalability from business cards to billboards",
      "Fast turnaround with iterative review rounds",
      "Complete commercial copyright transfer"
    ],
    processSteps: [
      { title: "Creative Brief", desc: "Understanding brand positioning, target audience, and competition." },
      { title: "Concept Moodboard", desc: "Developing aesthetic themes, typography pairings, and palettes." },
      { title: "Design Drafting", desc: "Iterative creation of vector options and real-world mockups." },
      { title: "Refinement", desc: "Collaborative feedback tweaks to achieve perfection." },
      { title: "Asset Delivery", desc: "Handover of all vector source files, raster exports, and font guides." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
    ],
    faq: [
      { question: "How many logo concepts do you provide?", answer: "Our standard brand packages provide 3 distinct concept directions followed by unlimited refinement rounds on your chosen direction." },
      { question: "Will I get editable source files?", answer: "Yes, you receive all native vector AI, EPS, SVG, PDF, and high-resolution PNG transparent assets." }
    ],
    published: true
  },
  {
    id: "srv-digital-marketing",
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortDescription: "Performance-driven social media management, paid ad campaigns, and content growth strategies.",
    fullDescription: "Turn views into paying customers. We engineer targeted Facebook, Instagram, and TikTok advertising campaigns, manage your social feeds with engaging multimedia content, and build brand loyalty across Sri Lanka.",
    iconName: "TrendingUp",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "Rs. 25,000/mo",
    features: [
      "Monthly social media content calendars & creative posts",
      "Meta Ads (Facebook & Instagram) targeted hyper-locally",
      "TikTok viral short-form video strategies",
      "Lead generation funnels with WhatsApp automation",
      "Transparent monthly ROI and reach performance reporting"
    ],
    subServices: [
      "Social Media Page Management (FB, IG, TikTok, LinkedIn)",
      "Targeted Paid Ads Campaign Management",
      "Content Creation (Graphics, Short Videos, Copywriting)",
      "WhatsApp & Messenger Chatbot / Inbound Funnels",
      "Brand Strategy & Digital Growth Consultation",
      "Influencer & Local Collaboration Campaigns"
    ],
    benefits: [
      "Data-backed targeting for Sri Lankan demographics",
      "Consistent, aesthetic brand voice across all channels",
      "Lower cost-per-lead through continuous ad A/B testing",
      "Dedicated account manager & monthly review sessions"
    ],
    processSteps: [
      { title: "Audit & Persona", desc: "Analyzing current reach, target customers, and competitor landscape." },
      { title: "Content Roadmap", desc: "Structuring 30-day posting schedules and campaign offers." },
      { title: "Production", desc: "Designing visual graphics, reels, and persuasive Sinhala/English copy." },
      { title: "Campaign Launch", desc: "Deploying Meta Pixel, audience interest targeting, and budget scaling." },
      { title: "Optimization", desc: "Weekly budget tuning and monthly performance analytics report." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=800&auto=format&fit=crop"
    ],
    faq: [
      { question: "Is advertising budget included in your monthly retainers?", answer: "Our package fees cover strategy, content creation, copywriting, setup, and optimization. Ad spend is paid directly to Meta/TikTok with your preferred monthly budget." }
    ],
    published: true
  },
  {
    id: "srv-photography",
    slug: "photography",
    name: "Photography",
    shortDescription: "Cinematic commercial, product, corporate, event, and destination wedding photography.",
    fullDescription: "Every frame crafted with intentional lighting, crisp focus, and editorial color grading. Whether showcasing a luxury resort in Ella, documenting a grand wedding in Monaragala, or capturing e-commerce product catalogs, Xmore's photography elevates perception.",
    iconName: "Camera",
    coverImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "Rs. 20,000",
    features: [
      "Full-frame high-resolution cameras & prime cinema lenses",
      "Portable studio lighting for on-location shoots",
      "Professional color grading and skin retouching",
      "High-res web & print-ready cloud gallery delivery",
      "Bespoke flush-mount luxury photo albums"
    ],
    subServices: [
      "Wedding & Homecoming Photography",
      "Event & Celebration Coverage",
      "Commercial & E-Commerce Product Photography",
      "Corporate Team Portraits & Executive Headshots",
      "Architectural, Hotel & Resort Photography",
      "Fashion Lookbooks & Creative Portfolios"
    ],
    benefits: [
      "Artistic eye with editorial compositions",
      "Fast preview turnarounds for social media",
      "Complete lighting gear for dark banquet halls and outdoor scenes",
      "Full commercial usage rights for business imagery"
    ],
    processSteps: [
      { title: "Shotlist Planning", desc: "Defining essential angles, moodboard, and shoot itinerary." },
      { title: "Shooting Day", desc: "Masterful capture with studio strobes and cinema primes." },
      { title: "Curation & Proofing", desc: "Selecting the best frames for client selection." },
      { title: "Master Retouching", desc: "Color grading, blemish removal, and light shaping." },
      { title: "Delivery & Album", desc: "Cloud gallery download + optional hand-bound flush album." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop"
    ],
    faq: [
      { question: "How long before we receive wedding photos?", answer: "We provide next-day highlight previews (20-30 photos) and the full edited master gallery within 2 weeks." }
    ],
    published: true
  },
  {
    id: "srv-videography",
    slug: "videography",
    name: "Videography",
    shortDescription: "High-impact commercial films, wedding highlights, corporate storytelling, and social media reels.",
    fullDescription: "Video is the undisputed king of modern audience engagement. We shoot in 4K with cinematic camera movements, professional sound design, drone aerials, and dynamic editing to produce films that captivate and convert.",
    iconName: "Video",
    coverImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "Rs. 30,000",
    features: [
      "4K 10-bit cinema camera packages with motorized gimbals",
      "Licensed drone aerial cinematography",
      "Crystal-clear wireless audio recording & sound design",
      "Optimized vertical reels (9:16) and widescreen 4K (16:9)",
      "Express teaser delivery within 48 hours"
    ],
    subServices: [
      "Cinematic Wedding Films & Pre-Shoot Videos",
      "Corporate Brand Stories & Factory Tours",
      "Commercial TV & Digital Video Ads",
      "Instagram & TikTok Viral Reels Production",
      "Event Coverage & Conference Recording",
      "Real Estate & Tourism Showcase Films"
    ],
    benefits: [
      "Engaging narrative pacing and emotive music licensing",
      "Licensed drone operator with safe flight protocols",
      "Multi-platform format optimization (Reels, YouTube, TV)",
      "High color grade standard using DaVinci Resolve"
    ],
    processSteps: [
      { title: "Script & Storyboard", desc: "Developing concept, scene sequence, and shot planning." },
      { title: "Filming", desc: "Multi-angle 4K production with lighting, gimbals, and drone." },
      { title: "Assembly Cut", desc: "Syncing dialogue, pacing to rhythm, and structuring the story." },
      { title: "Sound & Color", desc: "Professional DaVinci color grade, sound effects, and voice mastering." },
      { title: "Export & Formats", desc: "4K Master delivery for web, social media, and broadcast." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop"
    ],
    faq: [
      { question: "Do you provide drone videography?", answer: "Yes, our packages include certified 4K drone aerial shots for outdoor venues, landscapes, and event coverage." }
    ],
    published: true
  },
  {
    id: "srv-branding",
    slug: "branding",
    name: "Branding",
    shortDescription: "End-to-end brand identity architecture, stationery systems, packaging, and corporate guidelines.",
    fullDescription: "Branding is how your customers feel when they experience your business. We build cohesive brand ecosystems that establish authority, command premium pricing, and create lifelong client trust.",
    iconName: "Shield",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    startingPrice: "Rs. 35,000",
    features: [
      "Comprehensive Brand Style Guide (Colors, Typography, Usage Rules)",
      "Complete Corporate Stationery suite (Cards, Letterheads, Envelopes)",
      "Signage, 3D acrylic name boards & showroom branding",
      "Uniforms, packaging, and branded merchandise guidelines",
      "Complete digital asset toolkit for all web & social formats"
    ],
    subServices: [
      "Full Brand Identity Architecture",
      "Brand Style Guide & Rulebooks",
      "Corporate Stationery Systems",
      "Retail Showroom & Office Interior Branding",
      "3D Illuminated Name Boards & Wayfinding Signage",
      "Packaging Architecture & Label Systems",
      "Vehicle Graphics & Fleet Wraps"
    ],
    benefits: [
      "Distinctive positioning that separates you from competitors",
      "Consistency across all digital and physical touchpoints",
      "Ready-to-print production specifications included",
      "Enhanced business valuation and customer perception"
    ],
    processSteps: [
      { title: "Brand Discovery", desc: "Defining your vision, mission, target personas, and voice." },
      { title: "Visual Strategy", desc: "Exploring color theories, typography weights, and iconography." },
      { title: "Identity Design", desc: "Drafting the primary mark, secondary emblems, and lockups." },
      { title: "Collateral System", desc: "Extending design across stationery, packaging, and signage." },
      { title: "Brand Bible Handover", desc: "Delivering the complete Brand Guidelines manual and asset pack." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop"
    ],
    faq: [
      { question: "What is included in the Brand Style Guide?", answer: "Logo variations, clear space rules, typography pairings, color palette with HEX/CMYK/Pantone codes, icon style, and do's & don'ts." }
    ],
    published: true
  }
];

export const initialPortfolioProjects: PortfolioProject[] = [
  {
    id: "port-1",
    slug: "nilgiri-eco-resort-rebrand",
    title: "Nilgiri Eco Resort & Spa Brand Identity",
    category: "Branding",
    client: "Nilgiri Eco Resort (Ella / Wellawaya)",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Complete visual identity and luxury collateral design for an eco-conscious mountain retreat nestled between Ella and Wellawaya.",
    challenge: "The client needed an identity that felt deeply connected to Sri Lankan natural flora while appealing to high-end European eco-tourists.",
    solution: "We designed a minimalist leaf-and-mountain logo lockup, earth-tone color system, recycled kraft paper restaurant menus with brass screw binding, and laser-engraved wooden room key tags.",
    deliverables: ["Brand Identity Book", "Stationery Kit", "Menu Cards", "Wooden Signage", "Staff Uniforms"],
    tags: ["Branding", "Hospitality", "Eco Luxury", "Stationery"],
    date: "2026-06-15",
    featured: true,
    published: true,
    views: 420
  },
  {
    id: "port-2",
    slug: "apex-healthcare-launch-printing",
    title: "Apex Diagnostic Hospital Launch Collateral",
    category: "Printing",
    client: "Apex Healthcare (Pvt) Ltd",
    coverImage: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Comprehensive multi-discipline print production for the opening of a modern private medical center in Monaragala.",
    challenge: "Tight 4-day deadline to print over 10,000 distinct items including patient medical files, corporate brochures, and 3D acrylic outdoor name boards.",
    solution: "Mobilized continuous 24-hour printing lines with matte thermal lamination and precision die-cutting, delivering 100% on schedule.",
    deliverables: ["10,000 Patient File Folders", "3,000 Tri-Fold Health Brochures", "Illuminated 3D LED Signboard", "Employee Smart ID Badges"],
    tags: ["Printing", "Healthcare", "Large Format", "Signboards"],
    date: "2026-05-20",
    featured: true,
    published: true,
    views: 310
  },
  {
    id: "port-3",
    slug: "ceylon-heritage-spices-commercial",
    title: "Ceylon Heritage Spices Export Commercial",
    category: "Videography",
    client: "Ceylon Heritage Spices Exporters",
    coverImage: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop"
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "A cinematic 4K brand film highlighting organic cinnamon and pepper cultivation in the Monaragala valleys for international buyers.",
    challenge: "Showcasing raw agricultural beauty while maintaining a high-tech organic certification standard.",
    solution: "Used RED cinema camera workflow, 4K FPV drone sweeps over plantations, macro 120fps spice grinding shots, and authentic farmer storytelling.",
    deliverables: ["90-second Brand Story Film", "3x 15-second Vertical TikTok Ads", "Photography Lookbook"],
    tags: ["Videography", "Export", "Cinematography", "Commercial"],
    date: "2026-07-02",
    featured: true,
    published: true,
    views: 650
  },
  {
    id: "port-4",
    slug: "kavindi-hasitha-destination-wedding",
    title: "Kavindi & Hasitha Luxury Destination Wedding",
    category: "Photography",
    client: "Kavindi & Hasitha",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop"
    ],
    description: "A royal Poruwa ceremony and sunset reception captured with editorial elegance and rich warm tones.",
    challenge: "Rapidly changing lighting conditions across noon outdoor garden portraits and nighttime fireworks reception.",
    solution: "Multi-strobe wireless lighting rig and dual Sony FX3 4K recording units capturing every spontaneous tear and dance step.",
    deliverables: ["800 Master Edited High-Res Photos", "40-Page Flush Mount Leather Album", "6-Minute Cinematic Highlight Film"],
    tags: ["Photography", "Wedding", "Portraits", "Cinematic"],
    date: "2026-04-10",
    featured: true,
    published: true,
    views: 890
  },
  {
    id: "port-5",
    slug: "monaragala-agro-tech-social-growth",
    title: "Uva Agro Tech Social Media & Ad Growth",
    category: "Digital Marketing",
    client: "Uva Agro Tech Farm Machinery",
    coverImage: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Multi-channel digital marketing and WhatsApp lead generation funnel for agricultural equipment distributors.",
    challenge: "Reaching rural agricultural business owners who primarily consume Sinhala video content on Facebook and TikTok.",
    solution: "Created Sinhala demonstration videos, customer testimonial reels, and direct click-to-WhatsApp ads with automated product catalogs.",
    deliverables: ["24 Monthly Designed Posts & Reels", "Meta Lead Ad Campaigns", "WhatsApp Catalog Integration", "+220 Qualified Inquiries"],
    tags: ["Digital Marketing", "Lead Gen", "Meta Ads", "AgriBusiness"],
    date: "2026-06-28",
    featured: false,
    published: true,
    views: 290
  },
  {
    id: "port-6",
    slug: "vintage-tea-boutique-packaging",
    title: "Vintage Hills Boutique Tea Packaging System",
    category: "Graphic Design",
    client: "Vintage Hills Tea Estates",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop"
    ],
    description: "Premium tin cylinder and foil-embossed box designs for artisan loose-leaf Ceylon teas.",
    challenge: "Creating a collectible souvenir feel for boutique gift shops in tourist hubs.",
    solution: "Intricate gold foil botanical illustrations with matte black soft-touch coatings and color-coded tea region labels.",
    deliverables: ["6 Product Line Canisters", "Outer Gift Box", "Foil Stamping Die Guidelines", "3D Web Visuals"],
    tags: ["Graphic Design", "Packaging", "Tea Export", "Foil Stamping"],
    date: "2026-07-20",
    featured: true,
    published: true,
    views: 510
  }
];

export const initialPackages: PackageItem[] = [
  {
    id: "pkg-w1",
    name: "Royal Signature Wedding Experience",
    category: "Wedding",
    description: "Our flagship all-inclusive wedding cinema & luxury flush mount photography package.",
    price: 185000,
    priceDisplay: "Rs. 185,000",
    popular: true,
    features: [
      "Full Day Coverage: Bridal Dressing, Poruwa Ceremony & Reception",
      "2 Master Photographers + 2 4K Cinematographers",
      "4K Drone Aerial Cinematography by Licensed Pilot",
      "40-Page 12x24 Flush Mount Luxury Leather Album + Handcrafted Wooden Box",
      "Two 8x16 Parent Mini Albums Included",
      "6-8 Min Cinematic Highlight Film + Full Ceremony Video",
      "Same-Day 60s Social Media Instagram Teaser for Wedding Night"
    ],
    ctaText: "Reserve Wedding Date",
    published: true
  },
  {
    id: "pkg-w2",
    name: "Pre-Wedding & Couple Engagement Story",
    category: "Wedding",
    description: "Romantic outdoor couple session with editorial styling and 4K romance teaser film.",
    price: 65000,
    priceDisplay: "Rs. 65,000",
    features: [
      "Full Day Outdoor Location Shoot (Ella / Monaragala / Beach)",
      "Creative Storyboarding & Concept Mood Board Styling",
      "4K Cinematic 60s Romance Teaser Video Clip",
      "50 Master Retouched High-Resolution Portraits",
      "16x24 Framed Reception Welcome Portrait Included",
      "All Raw Digital Originals via Cloud Vault"
    ],
    ctaText: "Book Pre-Wedding",
    published: true
  },
  {
    id: "pkg-w3",
    name: "Homecoming & Evening Gala Coverage",
    category: "Wedding",
    description: "Complete elegant coverage for your homecoming day and second day celebration.",
    price: 120000,
    priceDisplay: "Rs. 120,000",
    features: [
      "Complete Homecoming Reception & Going Away Coverage",
      "1 Senior Photographer + 1 Senior Cinematographer",
      "30-Page 10x20 Magazine Style Flush Mount Album",
      "4-Minute Cinematic Highlight Video",
      "300+ Color-Graded High-Resolution Digital Files",
      "Express 48-Hour Digital Photo Delivery"
    ],
    ctaText: "Book Homecoming",
    published: true
  },
  {
    id: "pkg-1",
    name: "Starter Brand Identity",
    category: "Branding",
    description: "Ideal for new businesses needing an impactful visual launch.",
    price: 35000,
    priceDisplay: "Rs. 35,000",
    features: [
      "3 Vector Logo Concept Directions",
      "Brand Color Palette & Font Pairings",
      "Business Card & Letterhead Artwork",
      "Social Media Profile & Cover Artwork",
      "All Native Vector Files (.AI, .EPS, .PDF, .PNG)",
      "3 Rounds of Revisions"
    ],
    ctaText: "Choose Starter Brand",
    published: true
  },
  {
    id: "pkg-2",
    name: "Complete Business Presence",
    category: "Branding",
    description: "Our most popular comprehensive corporate identity package.",
    price: 75000,
    priceDisplay: "Rs. 75,000",
    popular: true,
    features: [
      "5 Vector Logo Concept Directions",
      "Full 20-Page Brand Guidelines Manual",
      "Stationery Suite (Cards, Letterhead, Envelopes, Invoice)",
      "Uniform / T-shirt & ID Badge Layouts",
      "Social Media Kit (10 Templates for Canva/Photoshop)",
      "Packaging or Name Board Concept Design",
      "Printed Sample Proofs of Stationery Included"
    ],
    ctaText: "Choose Complete Brand",
    published: true
  },
  {
    id: "pkg-3",
    name: "Social Media Growth Retainer",
    category: "Social Media",
    description: "Active monthly management to turn social feeds into revenue generators.",
    price: 45000,
    priceDisplay: "Rs. 45,000 / month",
    features: [
      "16 High-Quality Custom Graphic Posts / Month",
      "4 Cinematic Vertical Reels / TikTok Videos",
      "Bilingual Captions & Hashtag Strategy",
      "Meta Ads Management & Optimization",
      "Monthly Growth & Inquiry Analytics Report",
      "Dedicated WhatsApp Account Manager"
    ],
    ctaText: "Start Social Retainer",
    published: true
  },
  {
    id: "pkg-4",
    name: "Corporate Video Commercial",
    category: "Videography",
    description: "Cinematic promotional films for television, websites, and digital ads.",
    price: 65000,
    priceDisplay: "Starting from Rs. 65,000",
    features: [
      "4K Cinema Camera & Gimbal On-Site Filming",
      "4K Drone Aerial Footage by Licensed Pilot",
      "Professional Lighting & Wireless Audio",
      "DaVinci Resolve Cinematic Color Grading",
      "Licensed Commercial Soundtrack",
      "Full 2-Min Film + 30s Social Media Teaser"
    ],
    ctaText: "Book Video Production",
    published: true
  },
  {
    id: "pkg-6",
    name: "Custom Enterprise Solution",
    category: "Custom",
    description: "Tailored multi-disciplinary package for large scale corporate projects.",
    priceDisplay: "Contact for Custom Quote",
    features: [
      "Custom Mix of Printing, Video, Signage & Marketing",
      "Dedicated On-Site Creative Director",
      "Volume Commercial Printing Rates",
      "Custom SLA & Fast-Track Production Priority",
      "Itemized B2B Invoicing with Credit Terms"
    ],
    ctaText: "Request Custom Quote",
    published: true
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "5-reasons-why-monaragala-businesses-need-professional-branding",
    title: "5 Reasons Why Modern Sri Lankan Businesses Must Invest in Professional Branding",
    excerpt: "Why a 500-rupee logo is costing you thousands in lost customers and how modern branding establishes instant market authority.",
    content: `
# Why Professional Branding Matters More Than Ever

In today's digital-first economy, customers form an opinion about your business in less than **50 milliseconds**. Whether you run a resort in Ella, an agricultural export company in Wellawaya, or a private clinic in Monaragala, your visual presentation determines whether clients see you as a premium leader or a budget alternative.

## 1. You Can Charge Higher Rates
When your logo, packaging, invoices, and signage look immaculate, customers psychologically perceive your product as higher value. Premium visual identity allows you to stop competing on price cuts and start commanding healthy profit margins.

## 2. Cohesion Builds Trust
A company with mismatched colors on Facebook, low-resolution printed cards, and poorly formatted quotes sends a subconscious signal of disorganization. Unified branding shows that you care about precision in everything you do.

## 3. Instant Memorability
With hundreds of businesses competing on social media feeds, distinctive typography and signature color palettes make your brand instantly recognizable in scroll streams.

## 4. Attracting the Right Clientele
High-value clients look for professionalism. If your brand communicates elegance and clarity, you naturally attract clients who value quality over rock-bottom prices.

## 5. Ready for Scale
A professional vector brand identity scales seamlessly from a tiny favicon to a 20-foot highway hoarding without pixelation.

> *"Design is not just what it looks like and feels like. Design is how it works."*

Ready to transform your brand? [Get in touch with XMORE ART SOLUTIONS](/quote) today.
    `,
    coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop",
    author: "Miyuru Senarathne",
    authorRole: "Creative Director",
    category: "Branding",
    tags: ["Branding", "Business Growth", "Sri Lanka", "Marketing"],
    published: true,
    publishedDate: "2026-07-10",
    readTime: "4 min read",
    seoTitle: "Why Professional Branding Matters in Sri Lanka | Xmore Art",
    seoDescription: "Learn why professional branding is the highest ROI investment for Sri Lankan businesses."
  },
  {
    id: "blog-2",
    slug: "choosing-the-right-print-finishes-matte-gloss-foil-spot-uv",
    title: "The Ultimate Guide to Print Finishes: Matte, Gloss, Spot UV & Gold Foil",
    excerpt: "Everything you need to know about paper GSM, laminations, and luxury finishes to make your cards, flyers, and boxes stand out.",
    content: `
# How to Choose the Perfect Print Finish for Your Business

Print is a tactile medium. When a prospect holds your business card or luxury brochure, the texture of the paper speaks louder than words.

## 1. Matte Lamination vs. Gloss Lamination
- **Matte Lamination**: Offers a sophisticated, non-reflective velvety finish. Perfect for luxury hotels, law firms, and modern creative agencies.
- **Gloss Lamination**: Delivers high reflectivity, making photographic colors punchy and vibrant. Ideal for food menus and product catalogs.

## 2. Spot UV Highlighting
Spot UV applies a clear, high-gloss liquid coating to specific parts of your design (such as your logo or a subtle pattern) over a matte laminated background. The contrast between the flat matte surface and glossy relief creates an undeniable luxury feel.

## 3. Metallic Foil Stamping (Gold, Silver, Rose Gold)
Foil stamping uses heat and pressure to bond metallic foil to your card stock. Nothing communicates prestige like gold-foiled typography on deep black or linen card.

## 4. Understanding Paper Weights (GSM)
- **80 – 120 GSM**: Standard letterheads, invoices, and flyers.
- **150 – 200 GSM**: High-grade brochure pages and poster prints.
- **300 – 350 GSM**: Standard premium business cards and presentation folders.
- **600+ GSM (Duplex/Triplex)**: Ultra-thick executive cards with colored middle layers.

Contact our production desk at Xmore to feel physical swatch samples before your next print run!
    `,
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200&auto=format&fit=crop",
    author: "Dinuka Perera",
    authorRole: "Print Production Lead",
    category: "Printing",
    tags: ["Printing", "Paper Crafts", "Packaging", "Spot UV"],
    published: true,
    publishedDate: "2026-06-25",
    readTime: "5 min read"
  },
  {
    id: "blog-3",
    slug: "how-to-run-profitable-facebook-and-tiktok-ads-in-sri-lanka",
    title: "How to Run Profitable Facebook & TikTok Ads in Sri Lanka in 2026",
    excerpt: "Stop wasting money on the 'Boost Post' button. Here is the proven funnel framework to generate real sales on Meta and TikTok.",
    content: `
# Mastering Social Media Ads in Sri Lanka

Many business owners press the blue 'Boost' button on Facebook and wonder why they receive hundreds of likes but zero phone calls. Here is the framework we use at XMORE to generate consistent ROI for our clients.

## Step 1: Hook with Video in the First 2 Seconds
Sri Lankan social feeds are crowded. Your video ad must hook attention immediately using a clear question, bold visual, or relatable local scenario.

## Step 2: Use Bilingual Sinhala & English Copy
Depending on your demographic, speaking your audience's mother tongue builds trust 10x faster than purely generic English corporate copy.

## Step 3: Direct to WhatsApp
In Sri Lanka, WhatsApp is the undisputed communication hub. Sending traffic directly to a pre-filled WhatsApp message reduces friction by 80% compared to complicated website checkout forms.

## Step 4: Retarget Interested Viewers
People rarely buy on the first view. Run retargeting ads to everyone who watched more than 50% of your video or visited your page.

Contact XMORE ART SOLUTIONS to manage your next growth campaign!
    `,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    author: "Sahan Jayawardena",
    authorRole: "Digital Marketing Strategist",
    category: "Digital Marketing",
    tags: ["Digital Marketing", "Meta Ads", "TikTok", "Growth"],
    published: true,
    publishedDate: "2026-07-28",
    readTime: "6 min read"
  }
];

export const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "Miyuru Senarathne",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    email: "miyuru@xmoreart.lk",
    phone: "+94 71 666 6643",
    role: "SUPER_ADMIN",
    password: "admin1234",
    specialization: "Creative Director & Management",
    active: true,
    assignedProjectsCount: 0,
    assignedTasksCount: 0,
    createdAt: new Date().toISOString().split("T")[0]
  },
  {
    id: "emp-super-2",
    name: "XMORE Master Admin",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    email: "master@xmoreart.lk",
    phone: "+94 71 666 6643",
    role: "SUPER_ADMIN",
    password: "XmoreMaster@2026",
    specialization: "Master System Administrator & Operations",
    active: true,
    assignedProjectsCount: 0,
    assignedTasksCount: 0,
    createdAt: new Date().toISOString().split("T")[0]
  }
];

export const initialCustomers: Customer[] = [];

export const initialEnquiries: Enquiry[] = [];

export const initialQuotations: Quotation[] = [];

export const initialOrders: Order[] = [];

export const initialProjects: Project[] = [];

export const initialTasks: Task[] = [];

export const initialPayments: Payment[] = [];

export const initialExpenses: Expense[] = [];

export const initialLeads: Lead[] = [];

export const initialNotifications: AppNotification[] = [
  {
    id: "notif-welcome",
    title: "Welcome to XMORE ART SOLUTIONS Workspace",
    message: "Your production workspace is active and ready for business. Start creating official quotations, adding clients, and tracking orders.",
    type: "SYSTEM",
    link: "/admin",
    read: false,
    createdAt: new Date().toISOString()
  }
];

export const initialActivityLogs: ActivityLog[] = [];

export const initialBookings: ShootBooking[] = [];

export const initialShootPackages: ShootPackageOption[] = [
  {
    id: "pkg_wedding_full",
    type: "WEDDING_FULL",
    title: "Full Day Wedding Day",
    subtitle: "Complete Poruwa / Church + Reception photography & cinematic film",
    basePrice: 185000,
    popular: true,
  },
  {
    id: "pkg_pre_wedding",
    type: "PRE_WEDDING",
    title: "Pre-Wedding / Engagement",
    subtitle: "Outdoor romantic couple shoot with styling & mood concepts",
    basePrice: 65000,
    popular: true,
  },
  {
    id: "pkg_wedding_homecoming",
    type: "WEDDING_HOMECOMING",
    title: "Homecoming Function",
    subtitle: "Complete homecoming photography & video highlights",
    basePrice: 120000,
  },
  {
    id: "pkg_model_portfolio",
    type: "MODEL_PORTFOLIO",
    title: "Model & Fashion Portfolio",
    subtitle: "High-fashion lookbook, runway & personal branding shoots",
    basePrice: 45000,
  },
  {
    id: "pkg_commercial_video",
    type: "COMMERCIAL_VIDEO",
    title: "Commercial & Brand Ad Video",
    subtitle: "Product, hotel & corporate promotional cinematography",
    basePrice: 95000,
  },
  {
    id: "pkg_event_coverage",
    type: "EVENT_COVERAGE",
    title: "Birthday & Event Coverage",
    subtitle: "Anniversaries, get-togethers & private parties",
    basePrice: 55000,
  },
  {
    id: "pkg_studio_portrait",
    type: "STUDIO_PORTRAIT",
    title: "In-Studio Portrait Session",
    subtitle: "Family, graduation, executive & newborn portraiture",
    basePrice: 25000,
  },
];

export const initialShootAddons: ShootAddonOption[] = [
  { id: "drone", name: "4K Drone Aerial Cinematography", price: 35000, desc: "Licensed aerial operator for cinematic overhead angles" },
  { id: "album_luxury", name: "12x24 Flush Mount Leather Album", price: 45000, desc: "Handcrafted wooden box & seamless panoramic pages" },
  { id: "same_day_teaser", name: "Same-Day 60s Social Media Teaser", price: 25000, desc: "Delivered on wedding night for instant Instagram/TikTok" },
  { id: "led_wall", name: "LED Wall 4K Pre-shoot Loop Video", price: 18000, desc: "Color-graded loop prepared for reception backdrop" },
  { id: "thank_you_cards", name: "Instant Thank-You Cards (100 pcs)", price: 15000, desc: "Printed during event with wedding day photo" },
  { id: "live_stream", name: "Multi-Cam Live Streaming (1080p)", price: 40000, desc: "Private YouTube / Facebook stream for overseas family" },
  { id: "second_shooter", name: "Additional Master Photographer", price: 30000, desc: "Extra candid photographer for candid guest moments" },
];

