import { LandingPage } from "../types";

export const templates: LandingPage[] = [
  {
    id: "tpl_saas",
    businessName: "ApexAnalytics",
    tagline: "Unify your business metrics in real-time dashboards",
    theme: "indigo",
    colors: {
      primary: "#4f46e5",
      primaryHover: "#4338ca",
      secondary: "#10b981",
      background: "#f8fafc",
      text: "#0f172a",
      cardBg: "#ffffff",
      border: "#e2e8f0"
    },
    hero: {
      headline: "The modern data stack for fast-growing SaaS teams",
      subheadline: "Connect your databases, Stripe billing, and user tracking in under five minutes. Run complex analytics queries without writing SQL.",
      ctaPrimary: {
        label: "Start Free Trial",
        action: "pricing"
      },
      ctaSecondary: {
        label: "Book a Demo",
        action: "features"
      },
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop",
      imagePrompt: "Sleek dark mode digital SaaS interface displaying multiple interactive line charts, progress gauges, and real-time revenue stats with modern glassmorphism aesthetic."
    },
    features: [
      {
        id: "feat_1",
        title: "Real-time pipeline syncing",
        description: "Zero latency ETL channels stream your database changes, Stripe webhooks, and Google Analytics directly into standard visual aggregates.",
        icon: "Zap"
      },
      {
        id: "feat_2",
        title: "Enterprise security standard",
        description: "Rest easy with SOC2 Type II compliance, end-to-end TLS 1.3 encryption, and robust team role access permissions right out of the box.",
        icon: "Shield"
      },
      {
        id: "feat_3",
        title: "AI automated cohorts",
        description: "Our machine learning analyzer auto-clusters your users into retention cohorts and flags active customers at risk of churning soon.",
        icon: "Sparkles"
      },
      {
        id: "feat_4",
        title: "Interactive query builder",
        description: "Empower non-technical product managers to filter, slice, and group events cleanly without bogging down senior database engineers.",
        icon: "LineChart"
      }
    ],
    stats: [
      { value: "48%", label: "Churn Reduction" },
      { value: "$12M+", label: "Daily Revenue Tracked" },
      { value: "15 min", label: "Average Setup Time" }
    ],
    testimonials: [
      {
        quote: "ApexAnalytics changed how we run our product syncs. I can see customer lifetime value trends over cohort dates in seconds instead of making our engineering team run manual queries.",
        author: "Sarah Jenkins",
        role: "VP of Product, MailRapid",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
      },
      {
        quote: "The Stripe integration is exceptionally solid. We synced our historical subscription events and found over twenty thousand dollars in leaked credit card failures instantly.",
        author: "Marcus Vance",
        role: "Co-Founder & CTO, DraftFlow",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
      }
    ],
    pricing: {
      title: "Simple, transparent pricing built for scale",
      subtitle: "Choose the pricing model that fits your current volume. Scale up effortlessly as your analytics requirements expand.",
      tiers: [
        {
          id: "tier_saas_starter",
          name: "Starter",
          price: "$29",
          period: "/mo",
          description: "Ideal for early-stage bootstrapped builders tracking basic cohorts.",
          features: [
            "Up to 50,000 tracked monthly events",
            "3 core database integrations",
            "14-day data retention history",
            "Email-only developer support"
          ],
          isPopular: false,
          stripePriceId: "price_saas_starter_29"
        },
        {
          id: "tier_saas_pro",
          name: "Growth",
          price: "$79",
          period: "/mo",
          description: "Perfect for scaling startups who need predictive analytics power.",
          features: [
            "Up to 500,000 monthly events",
            "Unlimited connected databases",
            "Full cohort builder & AI flags",
            "Stripe real-time revenue analytics",
            "Priority Slack workspace support"
          ],
          isPopular: true,
          stripePriceId: "price_saas_pro_79"
        },
        {
          id: "tier_saas_ent",
          name: "Enterprise",
          price: "$249",
          period: "/mo",
          description: "Designed for heavy production workloads with strict compliance standards.",
          features: [
            "Unlimited tracking events",
            "Custom data retention SLAs",
            "Dedicated PostgreSQL read-replica",
            "Signed SOC2 compliance package",
            "Dedicated technical account manager"
          ],
          isPopular: false,
          stripePriceId: "price_saas_ent_249"
        }
      ]
    },
    faqs: [
      {
        question: "How difficult is the initial installation process?",
        answer: "Extremely simple. We provide pre-built client SDK snippets for React, Vue, Node.js, and Python. You can also sync directly by pasting your database connection string securely."
      },
      {
        question: "Is our database connection data secure with Apex?",
        answer: "Yes, entirely. We use write-only proxy relays and store credential tokens using AES-256 vault structures. We never write to your records—we only run optimized read transactions."
      },
      {
        question: "Can we export our analytics data raw?",
        answer: "Absolutely. You can request a full CSV/JSON export via the console or use our standard paginated REST API to query records dynamically."
      },
      {
        question: "Do you offer a sandbox or free trial?",
        answer: "We offer a 14-day trial of our Growth plan. No credit card is required to sign up, and you can downgrade to a free sandbox environment at any point."
      }
    ],
    footer: {
      copyright: "© 2026 ApexAnalytics Inc. All rights reserved.",
      links: [
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Security", href: "#" },
        { label: "Contact", href: "#" }
      ]
    }
  },
  {
    id: "tpl_ecommerce",
    businessName: "Solace Threads",
    tagline: "Eco-conscious organic activewear for mindful movement",
    theme: "amber",
    colors: {
      primary: "#b45309",
      primaryHover: "#92400e",
      secondary: "#78350f",
      background: "#fffbeb",
      text: "#1e293b",
      cardBg: "#ffffff",
      border: "#fed7aa"
    },
    hero: {
      headline: "Made to move. Designed to last.",
      subheadline: "Breathable, recycled activewear woven entirely from organic bamboo fibers and certified ocean-bound plastics. Gentle on your skin, gentler on the planet.",
      ctaPrimary: {
        label: "Shop Summer Collection",
        action: "pricing"
      },
      ctaSecondary: {
        label: "Our Sustainability Oath",
        action: "features"
      },
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
      imagePrompt: "A bright minimalist earthy clothing boutique display containing cream-colored linen hoodies and beige activewear hanging beautifully on raw wooden garment racks."
    },
    features: [
      {
        id: "ec_feat_1",
        title: "100% GOTS Organic Bamboo",
        description: "Naturally hypoallergenic, thermal-regulating, and incredibly soft fibers grown without toxic pesticides or intensive irrigation cycles.",
        icon: "Heart"
      },
      {
        id: "ec_feat_2",
        title: "Ocean-Bound Recyclables",
        description: "Our signature high-stretch yarn utilizes double-spun certified ocean plastics collected by coastal communities in Southeast Asia.",
        icon: "Globe"
      },
      {
        id: "ec_feat_3",
        title: "Ethically sewn workshops",
        description: "We work exclusively with family-owned fair trade textile plants in Portugal that guarantee living wages and safe working environments.",
        icon: "Award"
      },
      {
        id: "ec_feat_4",
        title: "Circular return program",
        description: "Send any worn-out Solace gear back to us after years of use, and we will recycle it into new collections and give you 20% off.",
        icon: "RefreshCw"
      }
    ],
    stats: [
      { value: "142k", label: "Water Bottles Reclaimed" },
      { value: "100%", label: "Carbon-Neutral Shipping" },
      { value: "4.9★", label: "From 12,000+ Movers" }
    ],
    testimonials: [
      {
        quote: "These are by far the most comfortable yoga leggings I've ever owned. They hold their shape perfectly through high-intensity pilates and endless wash cycles. I love knowing they are recycled.",
        author: "Aria Montgomery",
        role: "Vinyasa Yoga Instructor, San Diego",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
      },
      {
        quote: "Incredible material craftsmanship. Extremely lightweight, completely moisture-wicking, and they do not have that stiff chemical smell common with standard sports apparel brands.",
        author: "Ethan Reynolds",
        role: "Outdoor Enthusiast & Climber",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
      }
    ],
    pricing: {
      title: "Handcrafted packages designed for everyday motion",
      subtitle: "Invest in high-performance circular activewear bundles. Save up to 25% compared to purchasing items individually.",
      tiers: [
        {
          id: "tier_ec_single",
          name: "Essentials Bundle",
          price: "$85",
          period: " / kit",
          description: "Perfect introduction containing our signature high-stretch tee and organic movement shorts.",
          features: [
            "1x Bamboo Performance Tee",
            "1x Recycled Athletic Shorts",
            "Biodegradable cotton storage pouch",
            "Free carbon-neutral shipping"
          ],
          isPopular: false,
          stripePriceId: "price_solace_essential_85"
        },
        {
          id: "tier_ec_mover",
          name: "Daily Mover Set",
          price: "$145",
          period: " / kit",
          description: "Our top-rated performance combination of seamless leggings, support crop, and bamboo layer.",
          features: [
            "1x Seamless Recycled Leggings",
            "1x Medium-Support Sports Crop",
            "1x Eco-bamboo flow outer jacket",
            "Solace metal water bottle included",
            "Free priority exchanges & returns"
          ],
          isPopular: true,
          stripePriceId: "price_solace_mover_145"
        },
        {
          id: "tier_ec_luxe",
          name: "Full Capsule Wardrobe",
          price: "$290",
          period: " / kit",
          description: "A complete 6-piece activewear collection designed for a seamless, sustainable weekly routine.",
          features: [
            "2x Seamless Leggings or Pants",
            "2x Organic Performance Tees",
            "1x Recycled Windbreaker hoodie",
            "1x Bamboo lounge pants",
            "Premium laundry wash bag for plastics",
            "Lifetime seam repair warranty"
          ],
          isPopular: false,
          stripePriceId: "price_solace_capsule_290"
        }
      ]
    },
    faqs: [
      {
        question: "How should I wash and care for my bamboo clothes?",
        answer: "Machine wash cold on a gentle cycle with like colors using mild detergent. Tumble dry low or hang dry to preserve elasticity. Avoid chlorine bleach or fabric softeners."
      },
      {
        question: "How does the Circular Return Program work?",
        answer: "When your Solace apparel reaches the end of its life, download a pre-paid shipping label from our returns page, drop it in the mail, and we will automatically email you a 20% discount code."
      },
      {
        question: "What is your return and exchange policy?",
        answer: "We offer free return shipping and exchanges on all unworn items in original condition within 30 days of purchase. No questions asked."
      }
    ],
    footer: {
      copyright: "© 2026 Solace Threads Co. Woven ethically, shipped consciously.",
      links: [
        { label: "Shop All", href: "#" },
        { label: "Sustainability", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Sizing Guide", href: "#" }
      ]
    }
  },
  {
    id: "tpl_portfolio",
    businessName: "Devon Cole Studio",
    tagline: "High-end product design & interactive development for luxury startups",
    theme: "brutalist",
    colors: {
      primary: "#18181b",
      primaryHover: "#27272a",
      secondary: "#71717a",
      background: "#fafafa",
      text: "#09090b",
      cardBg: "#ffffff",
      border: "#d4d4d8"
    },
    hero: {
      headline: "Crafting digital experiences that command attention",
      subheadline: "I build award-winning mobile user interfaces, high-performance WebGL graphics engines, and responsive brand identities for top-tier startups.",
      ctaPrimary: {
        label: "Book Consulting Call",
        action: "pricing"
      },
      ctaSecondary: {
        label: "Explore Case Studies",
        action: "features"
      },
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      imagePrompt: "Elegant high-contrast black and white photography of a modern luxury workspace, with clean designer furniture, abstract stone sculptures, and a high-end metal computer display."
    },
    features: [
      {
        id: "port_feat_1",
        title: "Artistic UI design",
        description: "Bespoke, premium typography hierarchy and layouts designed specifically to emphasize exclusivity and elite brand value.",
        icon: "Target"
      },
      {
        id: "port_feat_2",
        title: "High-performance code",
        description: "Zero bloated frameworks. Hand-crafted, lightweight CSS/JS code that achieves a perfect 100/100 Lighthouse performance rating.",
        icon: "Cpu"
      },
      {
        id: "port_feat_3",
        title: "Immersive interaction",
        description: "Custom smooth-scroll logic, interactive canvas particles, and physics-based micro-animations that engage visitors deeply.",
        icon: "Sparkles"
      },
      {
        id: "port_feat_4",
        title: "Direct partner access",
        description: "No junior project managers or agency fluff. You work directly with me from kickoff discovery to final deployment launch.",
        icon: "Users"
      }
    ],
    stats: [
      { value: "4x", label: "Awwwards Site of the Day" },
      { value: "100%", label: "On-Time Launch Rate" },
      { value: "$140M", label: "Client Funding Assisted" }
    ],
    testimonials: [
      {
        quote: "Devon is a rare breed of designer who writes flawless engineering-grade code. He completely reimagined our fintech dashboard and delivered a polished asset in record time.",
        author: "Regina Thorne",
        role: "CEO, Sterling Finance",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
      },
      {
        quote: "The interactive WebGL animations Devon integrated into our landing page increased our newsletter signups by over seventy percent in the first three weeks alone.",
        author: "Julian Vance",
        role: "Creative Director, HyperForm",
        avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop"
      }
    ],
    pricing: {
      title: "Structured, predictable consulting rates",
      subtitle: "Clear monthly retainers or fixed-price project scope. Zero hidden charges or surprise budget inflation.",
      tiers: [
        {
          id: "tier_port_project",
          name: "Sprint Launch",
          price: "$8,500",
          period: " / project",
          description: "Full-stack conversion of your mockup into a fully interactive production-ready Webflow or React page.",
          features: [
            "Single-page design refinement",
            "High-fidelity desktop/mobile responsive build",
            "Interactive motion design sequences",
            "3 rounds of revision rounds",
            "7-day post-launch code support"
          ],
          isPopular: false,
          stripePriceId: "price_port_sprint_8500"
        },
        {
          id: "tier_port_retainer",
          name: "Monthly Partner",
          price: "$12,000",
          period: " / mo",
          description: "Dedicated designer & developer bandwidth for fast-growing product teams requiring ongoing iteration.",
          features: [
            "Up to 30 hours of direct design & code work",
            "Direct Slack & weekly sync pipeline",
            "User testing & CRO conversion audits",
            "Full React/Vite layout engineering",
            "Unlimited quick-fix requests"
          ],
          isPopular: true,
          stripePriceId: "price_port_partner_12000"
        }
      ]
    },
    faqs: [
      {
        question: "Which web development technologies do you use?",
        answer: "I build fully native frontends using React 19, TypeScript, Next.js, and Tailwind CSS. For interactive motion graphics, I use Framer Motion, GSAP, and Three.js / WebGL."
      },
      {
        question: "How long does a standard landing page build take?",
        answer: "A standard project kickoff to launch takes roughly 3 to 4 weeks. This includes wireframing, high-fidelity copy writing, responsive coding, and live hosting optimization."
      },
      {
        question: "Do you sign non-disclosure agreements?",
        answer: "Absolutely. I regularly work with stealth-stage venture startups and keep all intellectual property and strategic communications strictly confidential."
      }
    ],
    footer: {
      copyright: "© 2026 Devon Cole. Curating high-end digital design from London.",
      links: [
        { label: "Email Me", href: "mailto:devon@cole.design" },
        { label: "Twitter", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "Dribbble", href: "#" }
      ]
    }
  },
  {
    id: "tpl_event",
    businessName: "SaaS Summit 2026",
    tagline: "The premier gathering for SaaS founders, product thinkers, and operators",
    theme: "cyberpunk",
    colors: {
      primary: "#9333ea",
      primaryHover: "#7e22ce",
      secondary: "#ec4899",
      background: "#090514",
      text: "#f3e8ff",
      cardBg: "#120b24",
      border: "#2e1065"
    },
    hero: {
      headline: "The future of software is being built here",
      subheadline: "Join 1,200 executive tech founders, seed investors, and marketing visionaries in Austin, Texas. Two tracks, thirty sessions, and a lifetime of high-leverage relationships.",
      ctaPrimary: {
        label: "Secure Your Pass",
        action: "pricing"
      },
      ctaSecondary: {
        label: "View Speaker Lineup",
        action: "features"
      },
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      imagePrompt: "Immersive futuristic neon-lit tech conference stage, dark background with purple and pink glowing lasers, deep purple stadium seating, and a massive dynamic LED screen."
    },
    features: [
      {
        id: "ev_feat_1",
        title: "30+ Main-stage sessions",
        description: "Learn actionable strategies directly from unicorns who scaled past 50 million in annual recurring revenue. No promotional fluff.",
        icon: "Globe"
      },
      {
        id: "ev_feat_2",
        title: "VC Speed-dating rounds",
        description: "Match with thirty of the globe's top pre-seed, Series A, and growth equity funds in rapid pitch roundtables.",
        icon: "ArrowUpRight"
      },
      {
        id: "ev_feat_3",
        title: "Founder Masterminds",
        description: "Intimate, closed-door breakout workshops divided strictly by scaling stage to discuss hard operational truths.",
        icon: "Users"
      },
      {
        id: "ev_feat_4",
        title: "Sunset VIP Mixer",
        description: "Wind down with premium open-bar craft cocktails and sweeping views of Lady Bird Lake at our private executive reception.",
        icon: "Sparkles"
      }
    ],
    stats: [
      { value: "45+", label: "Unicorn Founders Speaking" },
      { value: "$3.2B", label: "Dry Powder Represented" },
      { value: "1,200", label: "Active Attendees" }
    ],
    testimonials: [
      {
        quote: "SaaS Summit is the single highest ROI conference I attend every year. I met our Series A lead investor during a breakout session and closed the round in thirty days.",
        author: "Devin Zhao",
        role: "Co-Founder, HydraAI",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
      },
      {
        quote: "The tactical playbooks shared in the customer acquisition track alone saved us six months of expensive paid advertising trial and error.",
        author: "Elena Petrova",
        role: "Chief Growth Officer, AppStream",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop"
      }
    ],
    pricing: {
      title: "Secure your reservation at our early tier rates",
      subtitle: "Prices increase as the venue capacity approaches limits. Group packages available for executive product teams.",
      tiers: [
        {
          id: "tier_ev_early",
          name: "Early Bird",
          price: "$499",
          period: " / pass",
          description: "Full access to both key tracks, standard workshops, and the primary networking expo hall.",
          features: [
            "All 30+ main-stage sessions",
            "Access to community networking app",
            "Complimentary lunch and coffee bars",
            "Official 2026 Summit Swag Kit"
          ],
          isPopular: false,
          stripePriceId: "price_ev_early_499"
        },
        {
          id: "tier_ev_pro",
          name: "All-Access Founder",
          price: "$899",
          period: " / pass",
          description: "The ideal ticket for builders actively fundraising or looking to establish partnerships.",
          features: [
            "Everything in Early Bird tier",
            "Guaranteed VC Round Match",
            "Access to closed-door Founder masterminds",
            "Invitation to Sunset VIP Mixer",
            "Recorded high-definition video package of all tracks"
          ],
          isPopular: true,
          stripePriceId: "price_ev_founder_899"
        }
      ]
    },
    faqs: [
      {
        question: "When and where is the event located?",
        answer: "SaaS Summit 2026 takes place on October 14-16, 2026, at the Palmer Events Center in Austin, Texas."
      },
      {
        question: "Are tickets refundable if our schedule changes?",
        answer: "Yes, fully refundable up to 45 days prior to the event start. Within 45 days, you can transfer your ticket to a team member at zero cost."
      },
      {
        question: "Do you offer group discounts for multiple team members?",
        answer: "We offer 15% off packages for teams of 3 or more. Shoot us a ping at team@saassummit.co to receive your custom group coupon."
      }
    ],
    footer: {
      copyright: "© 2026 SaaS Summit. Empowering modern software ecosystems globally.",
      links: [
        { label: "Sponsorships", href: "#" },
        { label: "Volunteer", href: "#" },
        { label: "Code of Conduct", href: "#" },
        { label: "Contact Support", href: "#" }
      ]
    }
  },
  {
    id: "tpl_app",
    businessName: "FitPulse App",
    tagline: "Mindful physical tracking powered by biometric analytics",
    theme: "emerald",
    colors: {
      primary: "#059669",
      primaryHover: "#047857",
      secondary: "#065f46",
      background: "#f0fdf4",
      text: "#064e3b",
      cardBg: "#ffffff",
      border: "#bbf7d0"
    },
    hero: {
      headline: "Listen to your body. Track with purpose.",
      subheadline: "FitPulse connects directly to your wearable device to translate raw HRV, heart rate, and sleep metrics into beautiful, actionable daily energy plans.",
      ctaPrimary: {
        label: "Download on iOS",
        action: "pricing"
      },
      ctaSecondary: {
        label: "Scientific Foundations",
        action: "features"
      },
      imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
      imagePrompt: "Sleek close-up of a modern smartphone resting on a pastel green surface, showing a beautiful health application screen with green heart-rate graphs, sleep scores, and training load meters."
    },
    features: [
      {
        id: "app_feat_1",
        title: "HRV Strain Analysis",
        description: "Our signature algorithm scores your autonomic nervous system fatigue dynamically so you know when to train hard or prioritize sleep.",
        icon: "Heart"
      },
      {
        id: "app_feat_2",
        title: "Wearable auto-syncing",
        description: "Seamless background data integration with Apple Health, Garmin Connect, Oura Ring, and Fitbit. Never log a workout manually again.",
        icon: "RefreshCw"
      },
      {
        id: "app_feat_3",
        title: "Adaptive recovery cues",
        description: "Get subtle, personalized micro-habit advice throughout the day like optimal hydration windows or guided breathing reminders.",
        icon: "Sparkles"
      },
      {
        id: "app_feat_4",
        title: "Privacy first encryption",
        description: "Your health metrics belong to you. We store all bio-telemetry utilizing end-to-end local keychain encryption and never sell data.",
        icon: "Shield"
      }
    ],
    stats: [
      { value: "4.8★", label: "App Store User Rating" },
      { value: "84%", label: "Report Improved Sleep" },
      { value: "2M+", label: "Workout Sessions Tracked" }
    ],
    testimonials: [
      {
        quote: "The sleep analysis is mindblowing. FitPulse showed me exactly how eating dinner two hours earlier improved my deep sleep phase by almost forty percent. I feel ten times more energized.",
        author: "Clara West",
        role: "Marathon Runner & Athlete",
        avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop"
      },
      {
        quote: "As a busy executive, FitPulse prevents me from burning out. By looking at my Daily Readiness score, I know exactly when to push through a tough workday or schedule a recovery routine.",
        author: "Derrick Vance",
        role: "Managing Partner, Valor Growth",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
      }
    ],
    pricing: {
      title: "Your biological dashboard, unlocked",
      subtitle: "Join the premium community of bio-trackers. Choose a flexible billing option with a 7-day risk-free sandbox trial.",
      tiers: [
        {
          id: "tier_app_monthly",
          name: "Monthly Pass",
          price: "$9.99",
          period: " / mo",
          description: "Flexible month-to-month access to our core strain dashboards and biometric analysis engine.",
          features: [
            "All core wearable API syncs",
            "Daily Readiness & HRV scoring",
            "Personalized daily habit reminders",
            "Unlimited historical data retention"
          ],
          isPopular: false,
          stripePriceId: "price_fitpulse_monthly_10"
        },
        {
          id: "tier_app_annual",
          name: "Annual Champion",
          price: "$69",
          period: " / yr",
          description: "Get the full health experience for under six dollars a month. Includes our advanced cognitive stress tracker.",
          features: [
            "Everything in Monthly Pass",
            "Advanced Cognitive Stress Analysis",
            "Custom workout trend spreadsheets",
            "2 months of premium subscription free",
            "FitPulse premium community forum badge"
          ],
          isPopular: true,
          stripePriceId: "price_fitpulse_annual_69"
        }
      ]
    },
    faqs: [
      {
        question: "Which smartwatches or fitness trackers are compatible?",
        answer: "We support Apple Watch, Oura Ring (Gen 2 & 3), Garmin (all modern watches), Fitbit, Whoop, and any wearable that pushes data to Apple Health or Google Fit."
      },
      {
        question: "Can I use the app without a wearable tracker?",
        answer: "Yes, but some features like real-time HRV strain scoring won't be active. You can still input logs manually and track workouts, sleep, and mood trends."
      },
      {
        question: "Is my personal biometric data safe?",
        answer: "Absolutely. We utilize state-of-the-art secure localized key storage. We never share, sell, or rent your health data to third-party advertisers or insurance providers."
      }
    ],
    footer: {
      copyright: "© 2026 FitPulse Health Technologies. Formulated scientifically for health.",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Medical Disclaimer", href: "#" },
        { label: "Contact Biometric Lab", href: "#" }
      ]
    }
  }
];
