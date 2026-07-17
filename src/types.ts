export interface CTA {
  label: string;
  action: string;
}

export interface HeroSection {
  headline: string;
  subheadline: string;
  ctaPrimary: CTA;
  ctaSecondary: CTA;
  imageUrl: string;
  imagePrompt: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name, e.g. "Zap", "Shield", "LineChart", "Sparkles"
}

export interface StatItem {
  value: string;
  label: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  stripePriceId?: string;
}

export interface PricingSection {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  copyright: string;
  links: FooterLink[];
}

export interface LandingPage {
  id: string;
  businessName: string;
  tagline: string;
  theme: string; // e.g. "indigo", "cyberpunk", "amber", "brutalist", "emerald", "minimal"
  colors: {
    primary: string; // hex code
    primaryHover: string;
    secondary: string;
    background: string;
    text: string;
    cardBg: string;
    border: string;
  };
  hero: HeroSection;
  features: FeatureItem[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
  pricing: PricingSection;
  faqs: FAQItem[];
  footer: FooterSection;
  ownerId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface GeneratorInput {
  businessName: string;
  category: string;
  description: string;
  audience: string;
  tone: string; // e.g. "professional", "playful", "bold", "technical", "elegant"
  themePreference: string; // e.g. "modern-indigo", "dark-cyberpunk", "warm-amber", "brutalist-mono", "soft-emerald"
}

export interface PremiumState {
  isPremium: boolean;
  unlockedTemplatesCount: number;
  purchasedPagesList: string[]; // Landing page IDs that are premium-unlocked
}
