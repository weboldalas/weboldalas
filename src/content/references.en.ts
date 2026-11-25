import {
  Globe, Calendar, Wrench, Search, BarChart2, Smartphone,
  ShoppingCart, Percent, UserCheck, CreditCard,
  Banknote, SlidersHorizontal, FileText,
  Layers, ShoppingBag, Zap, Package,
  Map, PartyPopper, Landmark, BedDouble, Store, Images, Mail, Settings,
  Newspaper, Users, Tag, Info,
  Briefcase, Sparkles, MousePointerClick,
  Languages, ShieldCheck, Truck, Receipt, LayoutDashboard,
  Mic, RotateCcw, PackagePlus, ChefHat, Waves, Pencil, Accessibility,
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
    slug: 'arpad-furdo',
    name: 'Árpád Thermal Bath and Lido',
    tagline: 'A three-language website with live lane occupancy and the bath’s own on-page editing',
    category: 'Website and admin',
    year: '2026',
    shape: 'sunrise',
    url: 'https://arpadfurdo.hu',
    accentColor: '#1bb3c4',
    gradient: 'linear-gradient(135deg, #0f8796, #1bb3c4, #6fd6e0)',
    gradientFrom: '#0c2830',
    gradientTo: '#14404a',
    description:
      'Árpád Thermal Bath and Lido has been one of the best-loved baths in Békéscsaba, Hungary, since 1922: thermal water, a swimming pool, an outdoor lido and saunas in one place. We built them a new three-language website where visitors see the weekly lane schedule of the pool, prices, opening hours and news at a glance, and the staff edit the site’s content themselves.',
    challenge:
      'The bath is used by everyone from young families to older spa guests, so the site has to be easy to read for all of them, in Hungarian, Romanian and English. The question swimmers ask most is when a lane is free, and the staff need to update news, prices and the lane schedule without a developer.',
    services: [
      { icon: Globe,           label: 'Custom website development' },
      { icon: Languages,       label: 'Three-language content' },
      { icon: LayoutDashboard, label: 'Admin panel' },
      { icon: Accessibility,   label: 'Accessibility' },
    ],
    features: [
      {
        icon: Waves,
        title: 'Live lane occupancy',
        description: 'The weekly schedule of the pool’s 8 lanes, hour by hour: free lanes in the 50 m and 21 m pools, swim club and water polo. A change in the admin shows up for every visitor instantly, without reloading.',
      },
      {
        icon: Pencil,
        title: 'Editing right on the page',
        description: 'Once signed in, staff switch on edit mode and change texts and images on the page itself, separately for each language.',
      },
      {
        icon: Languages,
        title: 'Hungarian, Romanian and English',
        description: 'The whole site, plus the news and events entered in the admin, in three languages. Where a translation is missing, the Hungarian text is shown.',
      },
      {
        icon: Accessibility,
        title: 'Accessibility panel',
        description: 'Four font sizes, high contrast, grayscale, highlighted links, reduced motion and a readable font. The browser remembers the settings.',
      },
      {
        icon: LayoutDashboard,
        title: 'Admin panel',
        description: 'News with a rich text editor, events, price list, gallery and lane schedule, all in one place.',
      },
      {
        icon: UserCheck,
        title: 'Users and permissions',
        description: 'Super admin, admin and editor roles, with staff accounts managed by the bath itself.',
      },
      {
        icon: Newspaper,
        title: 'News ready to share',
        description: 'Every news item shows its own image, title and description when shared on Facebook or other social networks.',
      },
      {
        icon: Receipt,
        title: 'Prices and opening hours',
        description: 'Ticket prices, Csaba Card and subsidised healthcare prices, services and opening hours, always up to date.',
      },
      {
        icon: Landmark,
        title: 'History and house rules',
        description: 'The bath’s history with archive photos, the house rules and a detailed look at its services.',
      },
    ],
    images: [
      { src: '/references/arpad-furdo/palyafoglaltsag.webp', alt: 'Árpád Bath – live lane occupancy', caption: 'Live lane occupancy: the schedule of the pool’s 8 lanes by hour and day.' },
      { src: '/references/arpad-furdo/fooldal.webp', alt: 'Árpád Bath – homepage', caption: 'The homepage.' },
      { src: '/references/arpad-furdo/szerkeszto-mod.webp', alt: 'Árpád Bath – edit mode', caption: 'Edit mode: texts and images are changed right on the page, per language.' },
      { src: '/references/arpad-furdo/akadalymentesites.webp', alt: 'Árpád Bath – accessibility', caption: 'The accessibility panel.' },
    ],
    outcome:
      'Visitors to Árpád Bath find their way in three languages on a site they can adjust to their own needs, swimmers see in advance when a lane is free, and the staff keep the site up to date without a developer.',
  },
  {
    slug: 'hello-roar',
    name: 'ROAR.',
    tagline: 'A bold corporate website for a new generation of insurance and financial advisers',
    category: 'Corporate website',
    year: '2025',
    shape: 'lion',
    url: 'https://helloroar.hu',
    accentColor: '#3ee69a',
    gradient: 'linear-gradient(135deg, #e0479e, #3ee69a, #9ff5c9)',
    gradientFrom: '#0e2a1f',
    gradientTo: '#173f2e',
    description:
      'ROAR. is a new generation of insurance and financial advisers, part of Palm Group. We built them a custom corporate website around the brand’s bold low-poly lion identity, serving brand building, client acquisition and adviser recruitment at the same time.',
    challenge:
      'Insurance is a dry topic for many people, but ROAR. speaks in a young, direct voice. The goal was a site that starts from life situations (a home, a car, a new job, starting a family), explains the solutions clearly and keeps the free consultation within reach on every page, while the careers page speaks to new colleagues.',
    services: [
      { icon: Globe,     label: 'Custom corporate website' },
      { icon: Sparkles,  label: 'Brand-led web design' },
      { icon: Briefcase, label: 'Careers page and recruitment' },
      { icon: Wrench,    label: 'Maintenance and support' },
    ],
    features: [
      {
        icon: Sparkles,
        title: 'Brand-led design',
        description: 'The low-poly lion masks, the green and pink palette and the paint clouds run through the whole site. A distinctive look, not a template.',
      },
      {
        icon: UserCheck,
        title: 'Solutions by life situation',
        description: 'A home, a car, a new job or starting a family: visitors find the right insurance starting from their own situation.',
      },
      {
        icon: Layers,
        title: 'Solutions organised by topic',
        description: 'Self-provision, savings, private health insurance, pensions, vehicle and bicycle insurance, each on its own clear page.',
      },
      {
        icon: MousePointerClick,
        title: 'Free consultation always within reach',
        description: 'The “free consultation” button is on every page, and getting in touch takes a few clicks.',
      },
      {
        icon: Briefcase,
        title: 'Careers page',
        description: 'A dedicated “work with us” page to recruit new advisers and introduce the team.',
      },
      {
        icon: Newspaper,
        title: 'Blog',
        description: 'Professional articles and news, easy to publish in the brand’s voice.',
      },
      {
        icon: Mail,
        title: 'Contact and quote forms',
        description: 'Quick contact and quote requests, protected from spam.',
      },
      {
        icon: Settings,
        title: 'Content management',
        description: 'The team updates the solutions, the blog and the careers page without a developer.',
      },
      {
        icon: Smartphone,
        title: 'Responsive design',
        description: 'The distinctive look works on mobile, tablet and desktop alike.',
      },
      {
        icon: Search,
        title: 'SEO-optimised structure',
        description: 'Search-friendly technical foundations, structured data and metadata for better visibility.',
      },
    ],
    images: [
      { src: '/references/hello-roar/fooldal.webp', alt: 'ROAR. – homepage', caption: 'The homepage with the brand’s lion-mask identity.' },
      { src: '/references/hello-roar/megoldasok.webp', alt: 'ROAR. – solutions', caption: 'Solutions by life situation.' },
      { src: '/references/hello-roar/ongondoskodas.webp', alt: 'ROAR. – self-provision', caption: 'Self-provision: savings, health insurance, pensions.' },
      { src: '/references/hello-roar/jarmu.webp', alt: 'ROAR. – vehicles', caption: 'Vehicle and bicycle insurance.' },
    ],
    outcome:
      'ROAR.’s website is as bold and direct as the brand itself: visitors start from their own life situation, reach the right solution and the free consultation, and the careers page speaks to new advisers too.',
  },
  {
    slug: 'most-koltozom',
    name: 'Most Költözöm',
    tagline: 'A clean, photo-led website for lightweight timber-frame family homes, with a home configurator and an interactive wall section',
    category: 'Corporate website',
    year: '2026',
    shape: 'house',
    url: 'https://mostkoltozombe.hu',
    accentColor: '#ef8a1e',
    gradient: 'linear-gradient(135deg, #3f9b3a, #ef8a1e, #f7b25a)',
    gradientFrom: '#132416',
    gradientTo: '#25391f',
    description:
      'Most Költözöm Kft. designs and builds lightweight timber-frame family homes, delivered turnkey, in Békéscsaba, Hungary. We built them a new website that presents the planned home with large renders, a floor plan and a room list, explains the wall construction on an interactive diagram, and guides the first enquiry through a five-step configurator.',
    challenge:
      'Having a family home built is a big decision, and buyers want to know what is inside the walls and exactly what they get for their money. The goal was a site that explains the structure and the agreed scope clearly, promises nothing beyond what goes into the contract, and leads visitors to a first meeting in simple steps.',
    services: [
      { icon: Globe, label: 'Custom website development' },
      { icon: Sparkles, label: 'Clean, photo-led web design' },
      { icon: SlidersHorizontal, label: 'Home configurator' },
      { icon: Wrench, label: 'Maintenance and support' },
    ],
    features: [
      {
        icon: Sparkles,
        title: 'Photo-led homepage',
        description: 'Large renders that change slowly, with thumbnails. The slideshow pauses when the visitor hovers over it, and never starts for visitors who prefer reduced motion.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Five-step home configurator',
        description: 'Plot and town, floor area, bedrooms and rooms, extras, timing. At the end a summary and an e-mail pre-filled with the choices, sent in one click.',
      },
      {
        icon: Layers,
        title: 'Interactive wall section',
        description: 'The ten layers of the external wall on a clickable diagram, each with a sentence on what it is for. Keyboard accessible too.',
      },
      {
        icon: FileText,
        title: 'Floor plan and room list',
        description: 'A zoomable preliminary floor plan, a downloadable PDF and the area of every room in a clear table.',
      },
      {
        icon: ShieldCheck,
        title: 'Turnkey scope made clear',
        description: 'Two columns show what is included and what has to be agreed separately.',
      },
      {
        icon: Images,
        title: 'Project gallery',
        description: 'A mosaic of past work with full-screen zoom, browsing by arrows, keyboard and swipe on mobile.',
      },
      {
        icon: Info,
        title: 'Precise, unambiguous copy',
        description: 'Every render is marked as a preliminary design, and the FAQ answers questions about the plot, the turnkey state and the warranty directly.',
      },
      {
        icon: Accessibility,
        title: 'Accessible controls',
        description: 'Gallery, wall section and configurator all work with the keyboard, with a clear focus ring and respect for the reduced-motion setting.',
      },
      {
        icon: Smartphone,
        title: 'Responsive design',
        description: 'On mobile, a menu that floats over the content, rearranged images and explanations set in cards.',
      },
      {
        icon: Search,
        title: 'SEO and sharing',
        description: 'Each page has its own title, description and share image, so it looks right on social networks.',
      },
    ],
    images: [
      { src: '/references/most-koltozom/fooldal.webp', alt: 'Most Költözöm – homepage', caption: 'The photo-led homepage with renders of the house.' },
      { src: '/references/most-koltozom/konfigurator.webp', alt: 'Most Költözöm – home configurator', caption: 'Step two of the five-step home configurator.' },
      { src: '/references/most-koltozom/falretegek.webp', alt: 'Most Költözöm – interactive wall section', caption: 'The layers of the external wall, each explained.' },
      { src: '/references/most-koltozom/kulcsrakesz.webp', alt: 'Most Költözöm – turnkey scope', caption: 'What is included, and how a client gets from the first meeting to handover.' },
    ],
    outcome:
      'The Most Költözöm website presents the planned home and the construction method openly: visitors see what the wall is made of and what the turnkey scope includes, and use the configurator to put together the home they want before they get in touch.',
  },
  {
    slug: 'galeria-invest',
    name: 'Galéria Invest',
    tagline: 'A corporate website for a construction company in Békéscsaba, with three business lines, a project list and news',
    category: 'Corporate website',
    year: '2025',
    shape: 'crane',
    url: 'https://galeriainvest.hu',
    accentColor: '#4bb543',
    gradient: 'linear-gradient(135deg, #2f8f3a, #4bb543, #f39200)',
    gradientFrom: '#0f1f12',
    gradientTo: '#1f3320',
    description:
      'Galéria Invest Kft. is a family-owned company in Békéscsaba, Hungary, working on construction projects since 2004: general contracting, building, civil engineering, roads and landscaping. It also processes construction and demolition waste and sells precast concrete elements. We designed and developed a new WordPress website that presents the three business lines separately and clearly, and keeps projects, news and job openings in one place.',
    challenge:
      'A construction company’s website is visited by very different people: clients looking at past projects, partners who want to deliver waste or buy concrete elements, and job seekers. The goal was a site where everyone quickly finds the part meant for them, and where the company can post news about ongoing work itself.',
    services: [
      { icon: Globe, label: 'Corporate website' },
      { icon: Sparkles, label: 'Custom web design' },
      { icon: Settings, label: 'WordPress development' },
      { icon: Layers, label: 'Content structure for three business lines' },
    ],
    features: [
      {
        icon: Layers,
        title: 'Three business lines, three pages',
        description: 'Construction services, waste management and trade each get their own page, so every visitor goes straight to the part meant for them.',
      },
      {
        icon: Wrench,
        title: 'Services by category',
        description: 'Building, civil engineering, road building and landscaping, each with a list of specific works and photos.',
      },
      {
        icon: Landmark,
        title: 'Project list',
        description: 'Completed projects with location, type of work, client and year of handover, from smaller renovations to public buildings.',
      },
      {
        icon: Newspaper,
        title: 'News from ongoing work',
        description: 'Regular updates from the construction sites with photo galleries, and search across the news.',
      },
      {
        icon: Info,
        title: 'Waste intake made clear',
        description: 'What is accepted and what is not, on what conditions, and which recycled materials can be bought, all on one page.',
      },
      {
        icon: Package,
        title: 'Precast concrete trade',
        description: 'Concrete pipes, retaining-wall and drainage elements, manhole rings and covers, with prices and pickup terms on request.',
      },
      {
        icon: Briefcase,
        title: 'Careers page',
        description: 'Open positions and general applications, with a list of the documents to send.',
      },
      {
        icon: Map,
        title: 'Contact with a map',
        description: 'A contact form, department contacts and an embedded map.',
      },
      {
        icon: ShieldCheck,
        title: 'Cookie consent',
        description: 'A consent bar: analytics load only with the visitor’s permission.',
      },
    ],
    outcome:
      'On the Galéria Invest website the three business lines are clearly separated: clients see the company’s work in the project list and the news, partners delivering waste know in advance what is accepted and on what terms, and job seekers reach the careers page in one click.',
  },
]
