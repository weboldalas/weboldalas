import {
  Globe, Calendar, Wrench, Search, BarChart2, Smartphone,
  ShoppingCart, Percent, UserCheck, Building2, CreditCard,
  Banknote, SlidersHorizontal, FileText,
  Layers, ShoppingBag, Zap, Package,
  Map, PartyPopper, Landmark, BedDouble, Store, Images, Mail, Settings,
  Newspaper, Users, Tag, Info,
  Briefcase, Sparkles, MousePointerClick,
  Languages, ShieldCheck, Truck, Receipt, LayoutDashboard,
  Mic, RotateCcw, PackagePlus, ChefHat,
} from 'lucide-react'
import type { Reference } from '@/app/(public)/referenciak/references'

export const REFERENCES_EN: Reference[] = [
  {
    slug: 'helkem',
    name: 'Helkem',
    tagline: 'A custom-built, multi-country B2B e-commerce platform',
    category: 'B2B e-commerce',
    year: '2026',
    shape: 'cartridge',
    accentColor: '#84cc16',
    gradient: 'linear-gradient(135deg, #65a30d, #84cc16, #a3e635)',
    gradientFrom: '#1a2e05',
    gradientTo: '#365314',
    description:
      'Helkem is a wholesaler of construction adhesives and sealants. We built them a completely new, custom e-commerce platform that serves several countries from one system. Business partners (B2B) are the main audience, but the webshop also serves consumers, with their own pricing and VAT handling. The first market is Slovakia (helkem.sk); further countries are built on the same foundation.',
    challenge:
      'The previous WooCommerce setup was held together by nearly 80 custom plugins. The goal was one platform where partner management, a multilingual catalogue, country-specific VAT rules, invoicing and shipping work in one place, automatically, and where launching a new country does not mean building a new webshop.',
    services: [
      { icon: Layers,          label: 'Custom B2B platform' },
      { icon: LayoutDashboard, label: 'Admin and order management' },
      { icon: ShoppingCart,    label: 'Multilingual webshop' },
      { icon: Wrench,          label: 'Ongoing development' },
    ],
    features: [
      {
        icon: Languages,
        title: 'Many countries, many languages',
        description: 'One system with a webshop per country. Products, categories and attributes are translatable; a new country gets its own language, price list and currency.',
      },
      {
        icon: UserCheck,
        title: 'Partner management with approval',
        description: 'Business sign-ups need admin approval. Partners can have several users tied to their sites, with their own payment methods and terms.',
      },
      {
        icon: Percent,
        title: 'Three-level discount system',
        description: 'Category, product and payment-method discounts with an expiry date. Discounts never stack: the system always applies the one that is better for the customer.',
      },
      {
        icon: ShieldCheck,
        title: 'Automatic VAT handling',
        description: 'VIES VAT number checks, reverse charge for EU businesses and OSS for consumers. Every order records the VAT decision and what it was based on.',
      },
      {
        icon: Banknote,
        title: 'Multiple currencies, daily rates',
        description: 'HUF and EUR invoicing with the daily central bank rate synced automatically. The rate is locked in when the order is placed.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Faceted catalogue and variations',
        description: 'Filters by brand, product type and application, generated colour × size variations, a RAL colour picker and per-variation images.',
      },
      {
        icon: CreditCard,
        title: 'Checkout and online payment',
        description: 'Card payment (Barion), cash on delivery with fee bands, prepayment with a discount and deferred payment enabled per partner.',
      },
      {
        icon: Truck,
        title: 'Shipping with GLS',
        description: 'Parcel-point selection at checkout, saved labels and proof of delivery, postcode validation and city lookup per country.',
      },
      {
        icon: Receipt,
        title: 'Automatic invoicing',
        description: 'Billingo integration: invoices at the right order status, cancellations, proforma → advance → final invoice, and two-way payment sync.',
      },
      {
        icon: Package,
        title: 'Order workflow',
        description: 'Statuses with a mandatory review step, barcode-scanned picking lists, delivery notes, automatic stock deduction and emails in the order’s language.',
      },
      {
        icon: FileText,
        title: 'Partner portal and document library',
        description: 'Orders and invoice downloads, favourites, and technical and safety data sheets shown only to partners with the right access level.',
      },
      {
        icon: BarChart2,
        title: 'Management dashboard and exports',
        description: 'KPIs, a to-do list, a per-country overview, accounting exports (domestic, OSS) to Excel, GA4 e-commerce tracking and Consent Mode v2 cookies.',
      },
    ],
    images: [
      { src: '/references/helkem/webshop-termekoldal.webp', alt: 'Helkem webshop – product page', caption: 'The Slovak webshop’s product page: price with or without VAT, stock and expected delivery.' },
      { src: '/references/helkem/admin-attekintes.webp', alt: 'Helkem admin – overview', caption: 'The admin overview: KPIs, revenue trend, to-dos and the daily central bank rate.' },
      { src: '/references/helkem/admin-rendeles.webp', alt: 'Helkem admin – order detail', caption: 'Order detail with a progress tracker, next step, invoicing and GLS label.' },
      { src: '/references/helkem/admin-rendelesek.webp', alt: 'Helkem admin – orders', caption: 'Orders with workflow tabs plus region and status filters.' },
      { src: '/references/helkem/webshop-felhasznalasi-teruletek.webp', alt: 'Helkem webshop – application areas', caption: 'Application areas on the webshop homepage.' },
    ],
    outcome:
      'Helkem’s partners, orders, invoicing and shipping now run on their own extensible system, and the Slovak webshop is the first country in line. Opening a new market is a matter of translation and configuration, not another webshop.',
  },
  {
    slug: 'sztanfa',
    name: 'Sztanfa',
    tagline: 'A custom product management app with AI, for a Hungarian and a Romanian webshop',
    category: 'Internal app & webshop',
    year: '2026',
    shape: 'log',
    accentColor: '#d89244',
    gradient: 'linear-gradient(135deg, #b9762d, #d89244, #f6c27a)',
    gradientFrom: '#13241f',
    gradientTo: '#1c342f',
    description:
      'Sztanfa is a timber and planed lumber merchant with a Hungarian and a Romanian webshop. Alongside the webshops we built a custom product management app for phones: the team says or types what should change on a product, AI fills in the fields, and the change goes live in the right webshop after approval.',
    challenge:
      'Timber product data changes often: prices per size, sales, stock, units, images. The WordPress admin is awkward on a phone and was not built for people working in the yard. The goal was a tool anyone can use to report a change in a few sentences, even on site, while the webshop only changes after review, across two separate shops.',
    services: [
      { icon: Smartphone,   label: 'Custom internal app' },
      { icon: Sparkles,     label: 'AI integration' },
      { icon: ShoppingCart, label: 'WooCommerce webshop' },
      { icon: Wrench,       label: 'Ongoing development' },
    ],
    features: [
      {
        icon: Mic,
        title: 'Just say what should change',
        description: 'From one spoken or typed sentence ("the 4 m one is 10,500 now, 9,990 on sale until the end of the month") AI fills in the fields, shows how it understood them, and asks back when something is unclear.',
      },
      {
        icon: ShieldCheck,
        title: 'Approval item by item',
        description: 'Nothing goes live on its own. The approver ticks each field, can correct values before publishing, or rejects the request with a reason.',
      },
      {
        icon: RotateCcw,
        title: 'Conflict checks and undo',
        description: 'If a field was edited in the admin in the meantime, the app flags it instead of overwriting it. After publishing, the exact previous values can be restored, and every step is logged.',
      },
      {
        icon: Languages,
        title: 'Two webshops, one app',
        description: 'Products of the Hungarian and the Romanian shop are managed from the same app over a signed internal connection. In the Romanian shop it works in lei and suggests text fields in Romanian.',
      },
      {
        icon: PackagePlus,
        title: 'New products from a few photos',
        description: 'A few photos and sentences become a product draft with name, category, prices and sizes. After approval it is created in the webshop as a draft, with images and tiered prices.',
      },
      {
        icon: Tag,
        title: 'Full product editing from a phone',
        description: 'Price and unit, quantity tiers, sales with dates, stock, descriptions, category, attributes, images, product video and retiring products, per size where needed.',
      },
      {
        icon: Layers,
        title: 'Bulk publishing',
        description: 'Pending requests can be filtered by category and published together. Anything that changed on the product in the meantime is skipped, and a summary shows the result.',
      },
      {
        icon: Smartphone,
        title: 'Installable app, secure sign-in',
        description: 'It can be added to the phone home screen and uses the webshop login with two-factor authentication. Submitters get a dedicated role with no access to the WordPress admin.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Filterable product catalogue',
        description: 'Filters by category, length and size with live counts, search, active filter chips, shareable filtered links and infinite scroll, with a bottom-sheet filter panel on mobile.',
      },
      {
        icon: ShoppingBag,
        title: 'Timber product pages',
        description: 'Size selection by length, prices per piece or per square metre, sale and bulk-stock badges, and delivery information on the homepage.',
      },
    ],
    images: [
      { src: '/references/sztanfa/app-ai-ertelmezes.webp', alt: 'Sztanfa product app – AI interpretation', caption: 'The product app: home screen, the "Just say it" input and the "Here is what I understood" summary (demo data).' },
      { src: '/references/sztanfa/app-jovahagyas.webp', alt: 'Sztanfa product app – approval', caption: 'Approval: pending requests with category filters, per-item ticks and conflict warnings (demo data).' },
      { src: '/references/sztanfa/webshop-fooldal.webp', alt: 'Sztanfa webshop – homepage', caption: 'The webshop homepage with delivery information.' },
      { src: '/references/sztanfa/webshop-termekek.webp', alt: 'Sztanfa webshop – products', caption: 'Product catalogue with length and size filters.' },
      { src: '/references/sztanfa/webshop-termekoldal.webp', alt: 'Sztanfa webshop – product page', caption: 'Product page with size selection by length.' },
    ],
    outcome:
      "Product data is now maintained from the team's phones: one sentence from the yard, one approval from the office, and the change is live in the Hungarian or the Romanian webshop. The WordPress admin stays with the approver.",
  },
  {
    slug: 'nadas-padel',
    name: 'Nádas Padel Club',
    tagline: 'A website and custom online court booking system for a padel club in Békéscsaba',
    category: 'Booking system',
    year: '2026',
    shape: 'padel',
    url: 'https://nadaspadel.hu',
    accentColor: '#add636',
    gradient: 'linear-gradient(135deg, #7fa31f, #add636, #d4f07a)',
    gradientFrom: '#0b0b0b',
    gradientTo: '#2c3a0c',
    description:
      'Nádas Padel Club runs four outdoor padel courts in Békéscsaba, Hungary. We built them a new website and a custom online court booking system: players pick the day, the court and the hours in a few taps, the booking is confirmed instantly by e-mail, and the club manages bookings, opening hours and prices in an admin panel.',
    challenge:
      'The goal was a booking system where players book in minutes without signing up, free slots are always up to date, double bookings cannot happen and cancelling is self-service, while the club can change opening hours, prices and blocked slots without a developer.',
    services: [
      { icon: Globe,           label: 'Website' },
      { icon: Calendar,        label: 'Online booking system' },
      { icon: LayoutDashboard, label: 'Admin panel' },
      { icon: Mail,            label: 'E-mail automation' },
    ],
    features: [
      {
        icon: Calendar,
        title: 'Online court booking',
        description: 'Day, court and hours on one page, several hours at once. Single (2 players) and standard (4 players) courts, a live summary with the total, and no sign-up needed.',
      },
      {
        icon: ShieldCheck,
        title: 'No double bookings',
        description: 'The database checks and records each booking in one step. Taken, past or out-of-hours slots are refused, even when two people click at the same moment.',
      },
      {
        icon: Mail,
        title: 'Automatic e-mails',
        description: 'Confirmation with directions and a cancel button, a reminder the day before, and a notification to the club for every new booking and cancellation.',
      },
      {
        icon: RotateCcw,
        title: 'Self-service cancellation',
        description: 'Players cancel with the unique link in their e-mail, the slot is freed instantly, and the club is notified.',
      },
      {
        icon: LayoutDashboard,
        title: 'Admin panel',
        description: 'A daily view per court, a list of upcoming bookings, cancellation with notification, and blocking individual slots, for example for training or maintenance.',
      },
      {
        icon: Settings,
        title: 'Opening hours and prices in the admin',
        description: 'Default opening hours, daily, weekly or monthly exceptions and closures, plus court fees and racket and ball rental prices, all in the club’s hands.',
      },
      {
        icon: Package,
        title: 'Equipment rental in the booking',
        description: 'Rackets and balls can be requested while booking, they are included in the summary, and payment is made on site.',
      },
      {
        icon: Images,
        title: 'Club website',
        description: 'Courts and fees, a gallery with the club’s own photos, a booking guide and contact details, designed for mobile.',
      },
    ],
    images: [
      { src: '/references/nadas-padel/foglalas.webp', alt: 'Nádas Padel Club – online booking', caption: 'Online booking: day, court and hours, with a live summary.' },
      { src: '/references/nadas-padel/fooldal.webp', alt: 'Nádas Padel Club – homepage', caption: 'The website homepage.' },
      { src: '/references/nadas-padel/email-visszaigazolas.webp', alt: 'Nádas Padel Club – confirmation e-mail', caption: 'The confirmation e-mail with directions and a cancel button (demo data).' },
      { src: '/references/nadas-padel/foglalas-lepesek.webp', alt: 'Nádas Padel Club – booking guide', caption: 'A three-step booking guide.' },
      { src: '/references/nadas-padel/palyak.webp', alt: 'Nádas Padel Club – courts', caption: 'Courts, fees and equipment rental.' },
    ],
    outcome:
      'Nádas Padel Club players book a court in minutes at any time of day, the club is notified of every booking instantly and sees its whole day in one place. Opening hours, prices and blocked slots are set by the club itself.',
  },
  {
    slug: 'visitkigyos',
    name: 'VisitKígyós',
    tagline: 'A modern tourism website showcasing the town',
    category: 'Tourism',
    year: '2025',
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
    gradientFrom: '#064e3b',
    gradientTo: '#065f46',
    description:
      "We created a modern, responsive tourism website for Visit Kígyós that brings the town's sights, events, accommodation and services together in one place.",
    challenge:
      "The goal was a fast, attractive and easy-to-manage website that gives visitors useful information while strengthening the town's online presence.",
    services: [
      { icon: Globe,    label: 'Custom tourism website' },
      { icon: Search,   label: 'SEO optimisation' },
      { icon: Wrench,   label: 'Maintenance and support' },
    ],
    features: [
      {
        icon: Map,
        title: 'Modern, custom look',
        description: "A fully custom design that reflects the town's identity, not a template-based solution.",
      },
      {
        icon: PartyPopper,
        title: 'Events and programmes',
        description: 'Upcoming events are easy to manage and clearly presented to visitors.',
      },
      {
        icon: Landmark,
        title: 'Sights and attractions',
        description: "Detailed write-ups of the town's landmarks, with photos and well-structured information.",
      },
      {
        icon: BedDouble,
        title: 'Accommodation listings',
        description: 'Local accommodation providers in one place, with contact details and photo galleries.',
      },
      {
        icon: Store,
        title: 'Local businesses',
        description: 'Local businesses and services presented in a consistent, organised way.',
      },
      {
        icon: Images,
        title: 'Photo galleries',
        description: "Eye-catching galleries that capture the town's atmosphere and events.",
      },
      {
        icon: Mail,
        title: 'Contact and enquiry forms',
        description: 'An easy way for visitors to get in touch, with spam protection built in.',
      },
      {
        icon: Smartphone,
        title: 'Responsive design',
        description: 'Works flawlessly on phones, tablets and desktops alike.',
      },
      {
        icon: Search,
        title: 'SEO-optimised structure',
        description: 'A search-friendly technical foundation and metadata for better online visibility.',
      },
      {
        icon: Zap,
        title: 'Fast and secure',
        description: 'Optimised performance and a reliable technical foundation with continuous availability.',
      },
      {
        icon: Settings,
        title: 'Simple content management',
        description: 'Content can be updated quickly and easily from the admin panel, no technical knowledge needed.',
      },
      {
        icon: Wrench,
        title: 'Ongoing maintenance and support',
        description: 'The website continues to receive maintenance, security updates and improvements after launch.',
      },
    ],
    outcome:
      "The Visit Kígyós website has become a modern tourist information hub that clearly presents the town's highlights, events and services, and makes it easier for visitors to find their way around.",
  },
  {
    slug: 'csabai-piac',
    name: 'Csabai Piac',
    tagline: 'A website with an interactive market map, vendor profiles and recipes for the market of Békéscsaba',
    category: 'Website and market map',
    year: '2025',
    shape: 'market',
    url: 'https://csabaipiac.hu',
    accentColor: '#e8813a',
    gradient: 'linear-gradient(135deg, #d9692a, #e8813a, #7aa97c)',
    gradientFrom: '#13231a',
    gradientTo: '#2a3f2e',
    description:
      'Csabai Piac is one of the liveliest spots in Békéscsaba, Hungary: farmers, craftspeople, food stalls and the makers of the famous Csabai sausage in one place. We built them a new website centred on an interactive market map. Visitors search for a vendor or a product, filter by category, and see straight away which stall has what they are looking for.',
    challenge:
      'A large market spread over several halls and pavilions is hard to find your way around, and the question visitors ask most is who sells Csabai sausage and where. The goal was a site that answers this in a few taps, on mobile too, while the market’s staff update vendors, news and events without a developer.',
    services: [
      { icon: Globe,    label: 'Custom website development' },
      { icon: Map,      label: 'Interactive market map' },
      { icon: Settings, label: 'Content management system' },
      { icon: Wrench,   label: 'Maintenance and support' },
    ],
    features: [
      {
        icon: Map,
        title: 'Interactive market map',
        description: 'The full market layout on a zoomable, searchable map. Vendor or product search and category filters highlight the results on the map and in the vendor list beside it at the same time.',
      },
      {
        icon: Store,
        title: 'Where to buy Csabai sausage?',
        description: 'A dedicated page for the sausage makers, with an expandable card for each. On the map, sausage vendors and tasting spots are highlighted in their own colours.',
      },
      {
        icon: Users,
        title: 'Vendor profiles',
        description: 'Every vendor gets a profile with a photo, their range and contact details, and the map and list work from the same data.',
      },
      {
        icon: ChefHat,
        title: 'Recipes',
        description: 'A recipe collection built on the market’s produce, with tags and search by recipe or ingredient.',
      },
      {
        icon: Newspaper,
        title: 'News and events',
        description: 'Announcements, events and programmes, easy to update from the admin.',
      },
      {
        icon: Info,
        title: 'Opening hours always in view',
        description: 'Opening hours by day, the phone number and the e-mail address sit at the top of every page.',
      },
      {
        icon: Images,
        title: 'Gallery',
        description: 'Photos of the market’s life, atmosphere and events.',
      },
      {
        icon: Settings,
        title: 'Admin panel',
        description: 'Vendors, news, events and recipes are managed without a developer.',
      },
      {
        icon: Smartphone,
        title: 'Responsive design',
        description: 'The map and search work comfortably on mobile, right where visitors are walking around the market.',
      },
      {
        icon: Search,
        title: 'SEO-optimised structure',
        description: 'Search-friendly technical foundations and metadata for better online visibility.',
      },
    ],
    images: [
      { src: '/references/csabai-piac/piacterkep.webp', alt: 'Csabai Piac – interactive market map', caption: 'Interactive market map with search, category filters and a vendor list.' },
      { src: '/references/csabai-piac/kolbasz-arusok.webp', alt: 'Csabai Piac – where to buy Csabai sausage', caption: 'The Csabai sausage makers on one page.' },
      { src: '/references/csabai-piac/fooldal.webp', alt: 'Csabai Piac – homepage', caption: 'The homepage, with opening hours at the top.' },
      { src: '/references/csabai-piac/receptek.webp', alt: 'Csabai Piac – recipes', caption: 'Recipes with tags and search.' },
      { src: '/references/csabai-piac/a-piacrol.webp', alt: 'Csabai Piac – about the market', caption: 'About the market.' },
    ],
    outcome:
      'Csabai Piac visitors find who sells Csabai sausage, or anything else, and where, in a few taps, while the market’s staff keep vendors, news and events up to date themselves.',
  },
  {
    slug: 'hello-roar',
    name: 'Hello Roar',
    tagline: 'A modern corporate website for insurance advisors',
    category: 'Corporate website',
    year: '2025',
    accentColor: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6, #a78bfa)',
    gradientFrom: '#2e1065',
    gradientTo: '#4c1d95',
    description:
      'Commissioned by Palm Group, we created a custom corporate website for Hello Roar that supports brand building, client acquisition and the recruitment of new advisors.',
    challenge:
      "We paid close attention to a distinctive visual identity, user experience and a clear content structure. The aim was a professional platform that reflects the company's character.",
    services: [
      { icon: Globe,     label: 'Custom corporate website' },
      { icon: Briefcase, label: 'Careers page and recruitment' },
      { icon: Wrench,    label: 'Maintenance and support' },
    ],
    features: [
      {
        icon: Sparkles,
        title: 'Custom web design',
        description: 'A fully custom visual design built around the brand identity, not a template-based solution.',
      },
      {
        icon: Building2,
        title: 'Corporate presentation site',
        description: "A professional, clear presentation of the company, its services and its values.",
      },
      {
        icon: FileText,
        title: 'Service pages',
        description: 'Insurance solutions explained in detail, in a structured, easy-to-scan format.',
      },
      {
        icon: Briefcase,
        title: 'Careers page',
        description: 'A dedicated page for recruiting new advisors, introducing the team and encouraging applications.',
      },
      {
        icon: Newspaper,
        title: 'Blog',
        description: 'An easy-to-manage blog for regularly publishing expert content, news and articles.',
      },
      {
        icon: Mail,
        title: 'Contact forms',
        description: 'Quick contact and quote request forms, with spam protection built in.',
      },
      {
        icon: MousePointerClick,
        title: 'Custom animations and interactions',
        description: 'Modern visual touches and micro-interactions that improve the user experience.',
      },
      {
        icon: Settings,
        title: 'Content management system',
        description: 'The team can easily update the website content without bringing in a developer.',
      },
      {
        icon: Smartphone,
        title: 'Responsive design',
        description: 'Works flawlessly on phones, tablets and desktop computers alike.',
      },
      {
        icon: Search,
        title: 'SEO-optimised structure',
        description: 'A search-friendly technical foundation, structured data and metadata for better visibility.',
      },
      {
        icon: Zap,
        title: 'Fast and optimised',
        description: 'A modern technology stack with optimised load times on every device.',
      },
      {
        icon: Wrench,
        title: 'Ongoing support and maintenance',
        description: 'The website continues to receive maintenance, improvements and security updates after launch.',
      },
    ],
    outcome:
      "Hello Roar's website has become a modern corporate platform with a strong visual character, supporting brand building, showcasing services and reaching new advisors. Its distinctive look and clear structure give the company a professional online presence.",
  },
]
