// ============================================================
// Dot Direction - Centralized Dynamic Data Layer
// All content that was previously hardcoded in the HTML now lives here.
// Edit this file to update site content without touching templates.
// ============================================================

const BASE_URL = 'https://dotdirections.com';
const PLACEHOLDER = 'https://placehold.co';

module.exports = {
  // Site-wide configuration
  site: {
    name: 'Dot Direction',
    tagline: "Capturing Life's Best Moments Across India",
    homeTitle: "Dot Directions | Capturing Life's Best Moments Across India",
    promoCode: 'DOT10',
    promoText: 'Covering all of India. Get 10% off your first booking with code',
    callNowPhone: '+916398962566',
    callNowHref: 'tel:+916398962566',
    whatsappNumber: '916398962566',
    photosUrl: 'https://mystudioitsolutions.com/login?event_code=PS6256HID&date=1780486485523',
    logoBlue: `${BASE_URL}/logo-blue.png`,
    logoWhite: `${BASE_URL}/logo-white.png`,
    logoFallbackBlue: `${PLACEHOLDER}/240x80/ffffff/333333?text=Dot+Direction&font=Playfair+Display`,
    logoFallbackWhite: `${PLACEHOLDER}/240x80/1b222a/9ba6b5?text=Dot+Direction&font=Playfair+Display`
  },

  contact: {
    phoneDisplay: '+91 639 896 2566',
    email: 'dotdirection.in@gmail.com'
  },

  socials: [
    { name: 'WhatsApp', href: 'https://wa.me/+916398962566', hoverClass: 'hover:text-[#25D366]', title: 'WhatsApp', icon: 'whatsapp' },
    { name: 'Facebook', href: 'https://www.facebook.com/DotDirection.photography', hoverClass: 'hover:text-[#1877F2]', title: 'Facebook', icon: 'facebook' },
    { name: 'Instagram', href: 'https://www.instagram.com/dot_direction/', hoverClass: 'hover:text-[#E4405F]', title: 'Instagram', icon: 'instagram' },
    { name: 'Gmail', href: 'mailto:dotdirection.in@gmail.com', hoverClass: 'hover:text-[#EA4335]', title: 'Email Us', icon: 'gmail' }
  ],

  navLinks: [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Services', href: '/#services' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Apply to Join', href: '/join-as-photographer' }
  ],

  // Hero image slider (right side)
  heroSlides: [
    { src: `${BASE_URL}/image%20(5).jpg`, alt: 'Professional photography' },
    { src: `${BASE_URL}/image%20(28).jpg`, alt: 'Wedding photography' },
    { src: `${BASE_URL}/image%20(12).jpg`, alt: 'Corporate photography' },
    { src: `${BASE_URL}/image%20(10).jpg`, alt: 'Product photography' }
  ],

  // Fullscreen image slider
  fullscreenSlides: [1, 2, 3, 4, 5, 6, 7].map(i => ({
    src: `${BASE_URL}/slider%20(${i}).jpeg`,
    fallback: `${BASE_URL}/slider%20(${i}).jpg`
  })),

  // Service categories (Personal & Business tabs)
  services: [
    // Personal (B2C)
    { tab: 'personal', title: 'Wedding', image: `${BASE_URL}/image%20(8).jpg` },
    { tab: 'personal', title: 'Engagement', image: `${BASE_URL}/image%20(23).jpg` },
    { tab: 'personal', title: 'Family', image: `${BASE_URL}/image%20(38).jpg` },
    { tab: 'personal', title: 'Personal', image: `${BASE_URL}/image%20(9).jpg` },
    { tab: 'personal', title: 'Graduation', image: `${BASE_URL}/Graduation.jpeg` },
    { tab: 'personal', title: 'Travel', image: `${BASE_URL}/Travel.jpeg` },
    { tab: 'personal', title: 'Couple', image: `${BASE_URL}/Couple.jpeg` },
    { tab: 'personal', title: 'Baby', image: `${BASE_URL}/Baby.jpeg` },
    { tab: 'personal', title: 'Maternity', image: `${BASE_URL}/Maternity.jpeg` },
    { tab: 'personal', title: 'Kids Party', image: 'https://images.pexels.com/photos/7099921/pexels-photo-7099921.jpeg' },
    { tab: 'personal', title: 'Parties', image: `${BASE_URL}/Party.jpeg` },
    { tab: 'personal', title: 'Pet', image: 'https://images.pexels.com/photos/1294062/pexels-photo-1294062.jpeg' },

    // Business (B2B)
    { tab: 'business', title: 'Business Events', image: 'https://images.pexels.com/photos/8349344/pexels-photo-8349344.jpeg' },
    { tab: 'business', title: 'Headshots', image: 'https://images.pexels.com/photos/3797438/pexels-photo-3797438.jpeg' },
    { tab: 'business', title: 'Corporate', image: 'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg' },
    { tab: 'business', title: 'Property', image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg' },
    { tab: 'business', title: 'Food', image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg' },
    { tab: 'business', title: 'Product', image: 'https://images.pexels.com/photos/8101532/pexels-photo-8101532.jpeg' },
    { tab: 'business', title: 'Lifestyle', image: 'https://images.pexels.com/photos/247616/pexels-photo-247616.jpeg' },
    { tab: 'business', title: 'Volume Pricing', image: 'https://images.pexels.com/photos/5668839/pexels-photo-5668839.jpeg' }
  ],

  // Availability form dropdown service options
  availabilityServices: [
    { value: 'Wedding Photography', name: 'Wedding Photography', desc: 'Full wedding day coverage', icon: 'heart', colorClass: 'text-orange-500', hoverClass: 'hover:bg-orange-50 hover:border-orange-200' },
    { value: 'Pre-Wedding / Couple Shoot', name: 'Pre-Wedding / Couple Shoot', desc: 'Engagement & couple sessions', icon: 'camera', colorClass: 'text-orange-500', hoverClass: 'hover:bg-orange-50 hover:border-orange-200' },
    { value: 'Maternity / Newborn', name: 'Maternity / Newborn', desc: 'Maternity & newborn sessions', icon: 'baby', colorClass: 'text-orange-500', hoverClass: 'hover:bg-orange-50 hover:border-orange-200' },
    { value: 'Birthday / Private Party', name: 'Birthday / Private Party', desc: 'Birthdays & private celebrations', icon: 'cake', colorClass: 'text-orange-500', hoverClass: 'hover:bg-orange-50 hover:border-orange-200' },
    { value: 'Corporate Event', name: 'Corporate Event', desc: 'Conferences & corporate functions', icon: 'briefcase', colorClass: 'text-blue-600', hoverClass: 'hover:bg-blue-50 hover:border-blue-200' },
    { value: 'Product / Commercial', name: 'Product / Commercial', desc: 'Catalog & commercial photography', icon: 'image', colorClass: 'text-blue-600', hoverClass: 'hover:bg-blue-50 hover:border-blue-200' },
    { value: 'Videography / Cinematography', name: 'Videography / Cinematography', desc: 'Cinematic video coverage', icon: 'video', colorClass: 'text-blue-600', hoverClass: 'hover:bg-blue-50 hover:border-blue-200' },
    { value: 'Drone / Aerial Coverage', name: 'Drone / Aerial Coverage', desc: 'Aerial shots & drone footage', icon: 'plane', colorClass: 'text-blue-600', hoverClass: 'hover:bg-blue-50 hover:border-blue-200' }
  ],

  // Brand logos (social proof strip)
  brandLogos: [
    { text: 'pepperfry', className: 'text-2xl font-bold tracking-tight text-orange-600' },
    { text: 'Alberto Torresi', className: 'text-lg font-serif tracking-widest uppercase text-gray-800' },
    { text: 'amazon prime', className: 'text-xl font-bold lowercase tracking-tighter text-blue-600', suffix: { text: 'prime', className: 'text-cyan-500 font-normal' } },
    { text: 'BGMI', className: 'text-xl font-black italic uppercase tracking-wider text-yellow-600' },
    { text: 'Humans of Bombay', className: 'text-xl font-serif italic text-gray-800' }
  ],

  // "How it works" process steps
  processSteps: [
    {
      id: 'phase-1-content',
      phaseLabel: 'Phase 1',
      title: 'Discovery & Matching',
      active: true,
      cards: [
        {
          step: 'Step 1',
          icon: 'clipboard-list',
          iconBg: 'bg-gray-50',
          iconColor: 'text-metallic',
          gradient: 'from-gray-200 to-metallic/50',
          heading: 'Unified Platform Entry',
          body: "Clients seamlessly submit specific requirements (Event Type, Location, Budget, Style) directly into our centralized data pipeline via search, social, or referral funnels."
        },
        {
          step: 'Step 2',
          icon: 'cpu',
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-500',
          gradient: 'from-metallic/50 to-blue-400',
          heading: 'Algorithmic Availability Check',
          body: 'Our proprietary system instantly queries our vetted database, filtering top-tier creative partners against hyper-specific local availability, skill category, and exact budget parameters.'
        }
      ]
    },
    {
      id: 'phase-2-content',
      phaseLabel: 'Phase 2',
      title: 'Consultation & Booking',
      active: false,
      cards: [
        {
          step: 'Step 3',
          icon: 'phone-call',
          iconBg: 'bg-indigo-50',
          iconColor: 'text-indigo-500',
          gradient: 'from-blue-400 to-indigo-500',
          heading: 'Human-in-the-Loop Consultation',
          body: 'The internal DOT team initiates direct contact via preferred channels (WhatsApp/Call/Email). We finalize briefs, understand nuanced creative visions, and confirm optimized package routing.'
        },
        {
          step: 'Step 4',
          icon: 'shield-check',
          iconBg: 'bg-purple-50',
          iconColor: 'text-purple-500',
          gradient: 'from-indigo-500 to-purple-500',
          heading: 'Secure Booking & Dedicated RM',
          body: 'Post-payment confirmation, the booking is secured. An exclusive Relationship Manager (RM) is automatically assigned to oversee total timeline coordination and stress-free project communication.'
        }
      ]
    },
    {
      id: 'phase-3-content',
      phaseLabel: 'Phase 3',
      title: 'Execution & Delivery',
      active: false,
      cards: [
        {
          step: 'Step 5',
          icon: 'camera',
          iconBg: 'bg-pink-50',
          iconColor: 'text-pink-500',
          gradient: 'from-purple-500 to-pink-500',
          heading: 'On-ground Execution',
          body: "Vetted creative partners arrive on-site, executing comprehensive photography and videography flawlessly according to your dedicated RM's brief."
        },
        {
          step: 'Step 6',
          icon: 'check-circle',
          iconBg: 'bg-rose-50',
          iconColor: 'text-rose-500',
          gradient: 'from-pink-500 to-rose-400',
          heading: 'Internal QA Pipeline',
          body: 'Rigorous internal review of all raw outputs. Our specialized editing team steps in to color-grade and ensure strict brand quality standards are met.'
        },
        {
          step: 'Step 7',
          icon: 'cloud-download',
          iconBg: 'bg-orange-50',
          iconColor: 'text-orange-500',
          gradient: 'from-rose-400 to-orange-400',
          heading: 'Cloud Delivery',
          body: 'Delivery of high-resolution, perfected assets via secure Drive links alongside custom physical album options, within our promised timeline.'
        },
        {
          step: 'Step 8',
          icon: 'star',
          iconBg: 'bg-yellow-50',
          iconColor: 'text-yellow-600',
          gradient: 'from-orange-400 to-yellow-500',
          heading: 'CRM Integration & Feedback',
          body: 'Automated post-delivery check-ins collect vital feedback, updating our CRM database and inviting you to our scalable referral program.'
        }
      ]
    }
  ],

  // Gallery images (ethereal masonry gallery)
  galleryImages: [
    ...Array.from({ length: 46 }, (_, i) => `${BASE_URL}/image%20(${i + 1}).jpg`).filter(img => {
      // Skip images named with pattern that might not exist, keep as-is for transparency
      return true;
    })
  ],

  // Value propositions
  valueProps: [
    {
      icon: 'shield-check',
      heading: 'Vetted Partners & QA',
      body: 'We accept only top-tier professionals across India. Plus, our internal team rigorously reviews every output to ensure strict quality standards before delivery.'
    },
    {
      icon: 'phone-call',
      heading: 'Dedicated RM Support',
      body: 'Say goodbye to coordination stress. Every confirmed booking includes a Dedicated Relationship Manager handling timelines, shoot requirements, and seamless communication.'
    },
    {
      icon: 'wallet',
      heading: 'Transparent Pricing',
      body: "From our B2C 'Spark' package to B2B 'Platinum' campaigns, see upfront pricing in INR. No negotiations, hidden fees, or surprise up-sells."
    }
  ],

  // Testimonials / Reviews
  testimonials: [
    { quote: "The process was completely frictionless. The photographer in Delhi captured our brand's essence perfectly, and the photos were ready before we even launched.", name: 'Sneha Sharma', role: 'Corporate Event' },
    { quote: 'We booked last minute for a PR shoot in Mumbai. The pro was punctual, unobtrusive, and delivered stunning shots that elevated our release.', name: 'Rahul Verma', role: 'Corporate Headshots' },
    { quote: 'Dot Direction is a lifesaver. Booking my maternity shoot in Bangalore took 2 minutes. The photographer made me feel beautiful and so comfortable.', name: 'Priya Desai', role: 'Maternity Shoot' },
    { quote: 'Incredible value and quality. We used Dot Direction for our restaurant menu revamp and the photos were simply mouth-watering. Highly recommended!', name: 'Arjun Singh', role: 'Food & Restaurant' },
    { quote: 'Our pre-wedding shoot was magical. The photographer knew exactly where the light hit best in Jaipur. Delivered ahead of time and beautifully edited.', name: 'Vikram Mehta', role: 'Pre-Wedding' },
    { quote: 'Running a D2C brand means constant need for fresh content. Dot Direction makes scaling our product shoots so easy. Top notch service.', name: 'Ananya Rao', role: 'Product Shoot (D2C)' },
    { quote: 'I needed professional headshots for LinkedIn and my portfolio. My photographer guided me on poses and delivered crisp, premium edits.', name: 'Neha Gupta', role: 'Portrait / Headshots' },
    { quote: 'As an architect, getting the right angles is crucial. The real estate photographer booked via Dot Direction had amazing gear and an eye for space.', name: 'Karthik Iyer', role: 'Real Estate' },
    { quote: "Booked a pro for my daughter's first birthday. They captured the most candid, wholesome moments without being intrusive. 10/10.", name: 'Ritu Agarwal', role: 'Birthday Party' },
    { quote: 'We needed high-volume white-background catalog shots for Amazon. Dot Direction handled the bulk perfectly and delivered right on schedule.', name: 'Sameer Jain', role: 'E-Commerce Catalog' }
  ],

  // Pricing plans
  pricingPlans: {
    b2c: [
      {
        name: 'Spark',
        badge: 'B2C',
        bestFor: 'Portraits & Young Couples',
        price: '₹5,000',
        highlight: false,
        features: [
          { icon: 'user', color: 'text-orange-500', text: '1 Photographer' },
          { icon: 'edit-3', color: 'text-orange-500', text: 'Editor Included' }
        ],
        cta: 'Book Spark',
        ctaClass: 'border border-gray-300 text-gray-800 hover:bg-gray-50'
      },
      {
        name: 'Classic',
        badge: 'B2C',
        bestFor: 'Small Functions & Events',
        price: '₹25k - ₹30k',
        highlight: true,
        popular: 'Most Popular',
        features: [
          { icon: 'users', color: 'text-orange-500', text: '2-3 Photographers' },
          { icon: 'briefcase', color: 'text-orange-500', text: 'Project Manager' },
          { icon: 'edit-3', color: 'text-orange-500', text: 'Editor Included' }
        ],
        cta: 'Book Classic',
        ctaClass: 'bg-orange-500 hover:bg-orange-600 text-white'
      },
      {
        name: 'Premium',
        badge: 'B2C',
        bestFor: 'Weddings',
        price: '₹1 Lac+',
        highlight: false,
        features: [
          { icon: 'camera', color: 'text-orange-500', text: '6-7 Photographers' },
          { icon: 'briefcase', color: 'text-orange-500', text: 'Project Manager' },
          { icon: 'edit-3', color: 'text-orange-500', text: 'Editor Included' }
        ],
        cta: 'Book Premium',
        ctaClass: 'border border-gray-300 text-gray-800 hover:bg-gray-50'
      }
    ],
    b2b: [
      {
        name: 'Influencer',
        badge: 'B2B',
        bestFor: 'Influencers & Creators',
        price: '₹4k - ₹7k',
        highlight: false,
        features: [
          { icon: 'user', color: 'text-blue-600', text: '1 Photographer' },
          { icon: 'briefcase', color: 'text-blue-600', text: 'Project Manager' },
          { icon: 'edit-3', color: 'text-blue-600', text: 'Editor Included' }
        ],
        cta: 'Book Influencer',
        ctaClass: 'border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white'
      },
      {
        name: 'Platinum',
        badge: 'B2B',
        bestFor: 'Brands & Agencies',
        price: '₹1 Lac - ₹3 Lac',
        highlight: true,
        popular: null,
        dark: true,
        features: [
          { icon: 'star', color: 'text-metallic-light', text: 'Flagship Photographer' },
          { icon: 'briefcase', color: 'text-metallic-light', text: 'Project Manager' },
          { icon: 'edit-3', color: 'text-metallic-light', text: 'Editor Included' }
        ],
        cta: 'Book Platinum',
        ctaClass: 'bg-white hover:bg-gray-100 text-slate-900 font-bold'
      }
    ],
    alwaysIncluded: [
      { icon: 'shield-check', text: 'Vetted Professionals' },
      { icon: 'image', text: 'High-Res Delivery' },
      { icon: 'calendar-check', text: 'Streamlined Booking' }
    ]
  },

  // Footer links
  footerLinks: {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'How it Works', href: '/#how-it-works' },
      { label: 'Pricing in INR', href: '/#pricing' },
      { label: 'Careers in India', href: '#' }
    ],
    professionals: [
      { label: 'Apply as Talent', href: '/join-as-photographer' },
      { label: 'Pro Dashboard', href: '#' },
      { label: 'Studio Partnerships', href: '#' },
      { label: 'Creator Resources', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' }
    ],
    locations: [
      { label: 'Photographers in Mumbai', href: '#' },
      { label: 'Photographers in Delhi NCR', href: '#' },
      { label: 'Photographers in Bangalore', href: '#' },
      { label: 'Photographers in Pune', href: '#' },
      { label: 'Photographers in Chennai', href: '#' },
      { label: 'Videographers in Hyderabad', href: '#' }
    ],
    occasions: [
      { label: 'Wedding Photography', href: '#' },
      { label: 'Corporate Event Photography', href: '#' },
      { label: 'Real Estate Photography', href: '#' },
      { label: 'Birthday Party Photographers', href: '#' },
      { label: 'Maternity & Newborn Shoots', href: '#' },
      { label: 'E-Commerce Product Shoots', href: '#' }
    ],
    hire: [
      { label: 'Hire a Portrait Photographer', href: '#' },
      { label: 'Hire an Event Videographer', href: '#' },
      { label: 'Hire a Drone Operator', href: '#' },
      { label: 'Hire a Commercial Photographer', href: '#' },
      { label: 'Hire a Food Photographer', href: '#' },
      { label: 'Hire a Photo Editor', href: '#' }
    ],
    guides: [
      { label: '2026 Indian Photography Pricing', href: '#' },
      { label: 'How to Prepare for a Headshot', href: '#' },
      { label: 'Wedding Photography Checklist', href: '#' },
      { label: 'Top Locations for Pre-Wedding Shoots', href: '#' },
      { label: 'Understanding Image Licensing in India', href: '#' },
      { label: 'Tips for Natural Lighting', href: '#' }
    ]
  },

  // Photographer application form options
  experienceOptions: ['0-2 Years', '3-5 Years', '6-10 Years', '10+ Years'],
  categoryOptions: [
    { value: 'Weddings', label: 'Weddings & Pre-Weddings' },
    { value: 'Corporate', label: 'Corporate Events' },
    { value: 'Parties', label: 'Birthdays & Private Parties' },
    { value: 'Commercial', label: 'Commercial / Product' }
  ]
};