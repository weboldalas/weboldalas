import {
  Globe, Calendar, Wrench, Search, BarChart2, Smartphone,
  ShoppingCart, Percent, UserCheck, Building2, CreditCard,
  Clock, Banknote, SlidersHorizontal, FileText, Calculator,
  Layers, ShoppingBag, Zap, Package,
  Map, PartyPopper, Landmark, BedDouble, Store, Images, Mail, Settings,
  Newspaper, Users, Tag, Info,
  Briefcase, Sparkles, MousePointerClick,
} from 'lucide-react'
import type { Reference } from '@/app/(public)/referenciak/references'

export const REFERENCES_EN: Reference[] = [
  {
    slug: 'helkem',
    name: 'Helkem',
    tagline: 'Custom B2B/B2C webshop with partner management',
    category: 'Webshop',
    year: '2025',
    accentColor: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0284c7, #0ea5e9, #06b6d4)',
    gradientFrom: '#0c4a6e',
    gradientTo: '#0369a1',
    description:
      'We built Helkem a fully custom B2B/B2C webshop that serves both consumers and business customers. The goal was a fast, modern system that can grow with the company over the long term and fits the way the business actually works.',
    challenge:
      'The webshop is more than a place to sell online: its automated features support partner management, order handling and day-to-day administration.',
    services: [
      { icon: ShoppingCart, label: 'Custom webshop development' },
      { icon: Building2,    label: 'B2B partner management' },
      { icon: Wrench,       label: 'Ongoing maintenance' },
    ],
    features: [
      {
        icon: ShoppingCart,
        title: 'Custom B2B/B2C webshop',
        description: 'Consumers and business customers are handled in one system, each with their own permissions and completely separate logic.',
      },
      {
        icon: Percent,
        title: 'Partner-specific pricing',
        description: 'Every partner gets their own prices and discounts, applied automatically at checkout with no manual work.',
      },
      {
        icon: UserCheck,
        title: 'Business sign-up with approval',
        description: 'New business accounts need administrator approval, so no one gets access to B2B prices automatically.',
      },
      {
        icon: Building2,
        title: 'Business customer management',
        description: 'Partner details, sites, discounts and permissions are managed in one place, in a clear structure.',
      },
      {
        icon: CreditCard,
        title: 'Tailored checkout',
        description: "A fully custom WooCommerce ordering and payment flow, built around Helkem's internal processes.",
      },
      {
        icon: Clock,
        title: 'Deferred payment options',
        description: '8, 15 and 30-day payment terms, configurable per partner and tracked automatically.',
      },
      {
        icon: Banknote,
        title: 'Multiple currencies, net/gross prices',
        description: 'HUF and EUR support, with switchable net/gross price display on the site and on invoices.',
      },
      {
        icon: SlidersHorizontal,
        title: 'Smart product filters',
        description: 'Fast search and filtering by product attributes, even across a large catalogue.',
      },
      {
        icon: FileText,
        title: 'Technical document library',
        description: 'Technical data sheets, safety data sheets and other documents available directly on the product pages.',
      },
      {
        icon: Calculator,
        title: 'Material calculators',
        description: 'Built-in calculators work out the quantity needed, cutting down on returns and wrong orders.',
      },
      {
        icon: BarChart2,
        title: 'Analytics and Ads integration',
        description: 'Google Analytics and Google Ads conversion tracking, marketing event tracking and remarketing list management.',
      },
      {
        icon: Smartphone,
        title: 'Responsive, fast, SEO-optimised',
        description: 'A modern technical foundation, Core Web Vitals-optimised performance and search optimisation on every device.',
      },
      {
        icon: Wrench,
        title: 'Ongoing development and maintenance',
        description: 'The system keeps improving after launch, with regular new features, automations and security updates.',
      },
    ],
    outcome:
      "Helkem's webshop is now far more than an online store: it is a complete B2B sales system that has made the company's online sales and partner management faster, clearer and more efficient.",
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
