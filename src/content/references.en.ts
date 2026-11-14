import {
  Globe, Calendar, Wrench, Search, BarChart2, Smartphone,
  ShoppingCart, Percent, UserCheck, Building2, CreditCard,
  Banknote, SlidersHorizontal, FileText,
  Layers, ShoppingBag, Zap, Package,
  Map, PartyPopper, Landmark, BedDouble, Store, Images, Mail, Settings,
  Newspaper, Users, Tag, Info,
  Briefcase, Sparkles, MousePointerClick,
  Languages, ShieldCheck, Truck, Receipt, LayoutDashboard,
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
    tagline: 'Custom WooCommerce webshop for timber products',
    category: 'Webshop',
    year: '2025',
    accentColor: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)',
    gradientFrom: '#78350f',
    gradientTo: '#92400e',
    description:
      'We built Sztanfa a modern WooCommerce webshop that makes it easy to showcase and sell premium timber products online. Throughout the project we focused on user experience, clear product pages and a fast checkout.',
    challenge:
      'The result is a fast, clean and easy-to-manage webshop that drives sales and presents the brand professionally on every device.',
    services: [
      { icon: ShoppingCart, label: 'WooCommerce webshop development' },
      { icon: Smartphone,   label: 'Responsive design' },
      { icon: Wrench,       label: 'Ongoing maintenance' },
    ],
    features: [
      {
        icon: ShoppingBag,
        title: 'Custom WooCommerce webshop',
        description: "A webshop designed around the business's needs, built from scratch rather than from a template.",
      },
      {
        icon: Layers,
        title: 'Modern product pages',
        description: 'Clear product presentation with detailed information and strong visuals.',
      },
      {
        icon: Package,
        title: 'Product variations',
        description: 'Customers can easily choose colours, sizes and other product options.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Smart product filters',
        description: 'Fast search by category, attribute and more, even across a large catalogue.',
      },
      {
        icon: ShoppingCart,
        title: 'Custom cart and checkout',
        description: 'A simple, fast and user-friendly buying process with minimal friction.',
      },
      {
        icon: Smartphone,
        title: 'Mobile-friendly design',
        description: 'The webshop works smoothly and comfortably on every screen size.',
      },
      {
        icon: Zap,
        title: 'Fast performance',
        description: 'Optimised load times and a modern technical foundation for the best user experience.',
      },
      {
        icon: Search,
        title: 'SEO-optimised structure',
        description: 'A search-friendly structure and metadata for better online visibility and organic traffic.',
      },
      {
        icon: BarChart2,
        title: 'Analytics and Ads integration',
        description: 'Google Analytics and Google Ads conversion tracking, for accurate insight into visitors and campaign performance.',
      },
      {
        icon: Wrench,
        title: 'Ongoing development and maintenance',
        description: 'The webshop continues to receive support, improvements and security updates after launch.',
      },
    ],
    outcome:
      "Sztanfa's webshop has become a modern, fast and easy-to-use sales channel. Its professional look supports the brand and makes buying simpler for both consumers and business customers.",
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
    tagline: 'A modern website and information system',
    category: 'Website',
    year: '2025',
    accentColor: '#f97316',
    gradient: 'linear-gradient(135deg, #ea580c, #f97316, #fb923c)',
    gradientFrom: '#7c2d12',
    gradientTo: '#9a3412',
    description:
      'We built Csabai Piac a modern, easy-to-manage website that keeps visitors informed quickly and makes content management simple for the market operators.',
    challenge:
      'The website pairs a modern look with an easy-to-use admin system, so the operators can update content without needing a developer.',
    services: [
      { icon: Globe,    label: 'Custom website development' },
      { icon: Settings, label: 'Content management system' },
      { icon: Wrench,   label: 'Maintenance and support' },
    ],
    features: [
      {
        icon: Globe,
        title: 'Custom web design',
        description: "A fully custom look that matches the market's identity, not a template-based solution.",
      },
      {
        icon: Newspaper,
        title: 'News and announcements',
        description: 'An easy-to-manage news section for current information and announcements.',
      },
      {
        icon: Calendar,
        title: 'Programmes and events',
        description: "The market's events are managed and displayed in date order.",
      },
      {
        icon: Users,
        title: 'Vendor profiles',
        description: 'Detailed vendor profiles with contact details, products and photos.',
      },
      {
        icon: Tag,
        title: 'Categories and search',
        description: 'Quick browsing and searching of vendors and products by category.',
      },
      {
        icon: Info,
        title: 'Opening hours and visitor info',
        description: 'Up-to-date opening hours and visitor information, all in one place.',
      },
      {
        icon: Images,
        title: 'Gallery',
        description: "An attractive photo gallery of the market's daily life, atmosphere and events.",
      },
      {
        icon: Mail,
        title: 'Contact form',
        description: 'A simple, spam-protected way for visitors to get in touch.',
      },
      {
        icon: Settings,
        title: 'Admin panel',
        description: 'Content is easy to manage and update without bringing in a developer.',
      },
      {
        icon: Smartphone,
        title: 'Responsive design',
        description: 'A great user experience on phones, tablets and desktops alike.',
      },
      {
        icon: Search,
        title: 'SEO-optimised structure',
        description: 'A search-friendly technical foundation and metadata for better online visibility.',
      },
      {
        icon: Zap,
        title: 'Fast and secure',
        description: 'Optimised performance, a stable system and regular security updates.',
      },
    ],
    outcome:
      "Csabai Piac's new website makes it faster and easier for visitors to find what they need, and has made managing and updating content significantly simpler for the administrators.",
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
