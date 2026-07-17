import React, { useState } from "react";
import { X, Copy, Check, Download, Code, FileCode, Database } from "lucide-react";
import { LandingPage } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  landingPage: LandingPage;
}

export default function ExportModal({ isOpen, onClose, landingPage }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<"html" | "react" | "json">("html");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate clean static HTML string
  const generateHTML = () => {
    const iconScripts = `<script src="https://unpkg.com/lucide@latest"></script>`;
    const initLucide = `<script>lucide.createIcons();</script>`;

    const featuresHTML = landingPage.features
      .map(
        (f) => `
        <div class="p-6 bg-white rounded-2xl border border-[${landingPage.colors.border}] shadow-sm flex flex-col items-start">
          <div class="p-3 rounded-xl mb-4" style="background-color: ${landingPage.colors.primary}15; color: ${landingPage.colors.primary}">
            <i data-lucide="${f.icon.toLowerCase()}" class="w-6 h-6"></i>
          </div>
          <h3 class="text-xl font-bold text-[${landingPage.colors.text}] mb-2">${f.title}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">${f.description}</p>
        </div>`
      )
      .join("");

    const statsHTML = landingPage.stats
      .map(
        (s) => `
        <div class="text-center">
          <div class="text-4xl font-extrabold" style="color: ${landingPage.colors.primary}">${s.value}</div>
          <div class="text-gray-500 text-sm mt-1">${s.label}</div>
        </div>`
      )
      .join("");

    const testimonialsHTML = landingPage.testimonials
      .map(
        (t) => `
        <div class="p-8 rounded-2xl bg-white border border-[${landingPage.colors.border}] shadow-sm relative">
          <p class="text-gray-600 italic text-base relative z-10">"${t.quote}"</p>
          <div class="flex items-center space-x-3 mt-6">
            <img class="w-10 h-10 rounded-full object-cover" src="${t.avatarUrl}" alt="${t.author}" />
            <div>
              <div class="font-bold text-sm text-[${landingPage.colors.text}]">${t.author}</div>
              <div class="text-xs text-gray-500">${t.role}</div>
            </div>
          </div>
        </div>`
      )
      .join("");

    const pricingHTML = landingPage.pricing.tiers
      .map(
        (tier) => `
        <div class="p-8 rounded-2xl border flex flex-col justify-between bg-white relative overflow-hidden ${
          tier.isPopular ? `ring-2 ring-indigo-500` : `border-gray-200`
        }">
          ${
            tier.isPopular
              ? `<div class="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">Popular</div>`
              : ""
          }
          <div>
            <h4 class="text-lg font-bold text-gray-900">${tier.name}</h4>
            <p class="text-gray-500 text-sm mt-2">${tier.description}</p>
            <div class="mt-6 flex items-baseline">
              <span class="text-4xl font-extrabold text-gray-900">${tier.price}</span>
              <span class="text-gray-500 text-sm ml-2">/${tier.period}</span>
            </div>
            <ul class="mt-8 space-y-4">
              ${tier.features
                .map(
                  (f) => `
                <li class="flex items-center space-x-3 text-sm text-gray-600">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-500 flex-shrink-0"></i>
                  <span>${f}</span>
                </li>`
                )
                .join("")}
            </ul>
          </div>
          <button class="w-full py-3 mt-8 font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer" 
            style="background-color: ${
              tier.isPopular ? landingPage.colors.primary : "#f3f4f6"
            }; color: ${tier.isPopular ? "#ffffff" : "#1f2937"}">
            Get Started
          </button>
        </div>`
      )
      .join("");

    const faqsHTML = landingPage.faqs
      .map(
        (faq) => `
        <div class="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h4 class="font-bold text-lg text-[${landingPage.colors.text}] mb-2">${faq.question}</h4>
          <p class="text-gray-600 text-sm leading-relaxed">${faq.answer}</p>
        </div>`
      )
      .join("");

    const footerLinksHTML = landingPage.footer.links
      .map((l) => `<a href="${l.href}" class="text-sm text-gray-400 hover:text-white transition-colors">${l.label}</a>`)
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landingPage.businessName} - ${landingPage.tagline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  ${iconScripts}
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gray-50 text-gray-900 scroll-smooth">

  <!-- Navigation Header -->
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white" style="background-color: ${landingPage.colors.primary}">
          ${landingPage.businessName.charAt(0)}
        </span>
        <span class="font-bold text-lg text-gray-900">${landingPage.businessName}</span>
      </div>
      <nav class="hidden md:flex space-x-8">
        <a href="#features" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
        <a href="#pricing" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
        <a href="#faqs" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">FAQs</a>
      </nav>
      <a href="#pricing" class="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-sm" style="background-color: ${landingPage.colors.primary}">
        Get Started
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative overflow-hidden py-20 md:py-32" style="background-color: ${landingPage.colors.background}">
    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <span class="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" style="background-color: ${landingPage.colors.primary}20; color: ${landingPage.colors.primary}">
          Introducing ${landingPage.businessName}
        </span>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 tracking-tight">
          ${landingPage.hero.headline}
        </h1>
        <p class="text-lg text-gray-600 leading-relaxed">
          ${landingPage.hero.subheadline}
        </p>
        <div class="flex flex-wrap gap-4 pt-2">
          <a href="#pricing" class="px-6 py-3 font-semibold text-white rounded-xl transition-all shadow-md cursor-pointer" style="background-color: ${landingPage.colors.primary}">
            ${landingPage.hero.ctaPrimary.label}
          </a>
          <a href="#features" class="px-6 py-3 font-semibold text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
            ${landingPage.hero.ctaSecondary.label}
          </a>
        </div>
      </div>
      <div class="relative">
        <div class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl"></div>
        <img class="relative w-full rounded-2xl shadow-xl border border-gray-100 object-cover aspect-[4/3]" src="${landingPage.hero.imageUrl}" alt="${landingPage.businessName}" />
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="border-y border-gray-100 bg-white py-12">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      ${statsHTML}
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-20 md:py-32">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-2xl mx-auto text-center space-y-4 mb-16 md:mb-24">
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Why Choose Us</h2>
        <p class="text-gray-500 text-lg">Engineered to elevate your productivity and bring your operations to the next level.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        ${featuresHTML}
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="bg-gray-100/50 py-20 md:py-32">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-2xl mx-auto text-center space-y-4 mb-16">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900">Loved by Thousands</h2>
        <p class="text-gray-500">Read inspiring stories from our dedicated customers worldwide.</p>
      </div>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        ${testimonialsHTML}
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section id="pricing" class="py-20 md:py-32">
    <div class="max-w-7xl mx-auto px-6">
      <div class="max-w-2xl mx-auto text-center space-y-4 mb-16 md:mb-24">
        <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">${landingPage.pricing.title}</h2>
        <p class="text-gray-500 text-lg">${landingPage.pricing.subtitle}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
        ${pricingHTML}
      </div>
    </div>
  </section>

  <!-- FAQs -->
  <section id="faqs" class="py-20 md:py-32 bg-gray-50">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center space-y-4 mb-16">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900">Frequently Asked Questions</h2>
        <p class="text-gray-500">Find quick answers to common queries about our platform.</p>
      </div>
      <div class="space-y-6">
        ${faqsHTML}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-900 text-white py-12 border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
      <div class="flex items-center space-x-2">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white" style="background-color: ${landingPage.colors.primary}">
          ${landingPage.businessName.charAt(0)}
        </span>
        <span class="font-bold text-lg">${landingPage.businessName}</span>
      </div>
      <div class="flex space-x-6">
        ${footerLinksHTML}
      </div>
      <div class="text-sm text-gray-400">
        ${landingPage.footer.copyright}
      </div>
    </div>
  </footer>

  ${initLucide}
</body>
</html>`;
  };

  const generateReact = () => {
    return `import React from "react";
import * as Icons from "lucide-react";

export default function LandingPage() {
  const primaryColor = "${landingPage.colors.primary}";
  const secondaryColor = "${landingPage.colors.secondary}";

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white bg-[${landingPage.colors.primary}]">
              ${landingPage.businessName.charAt(0)}
            </span>
            <span className="font-bold text-lg text-gray-900">${landingPage.businessName}</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#pricing" className="hover:text-gray-900">Pricing</a>
            <a href="#faqs" className="hover:text-gray-900">FAQs</a>
          </nav>
          <a href="#pricing" className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm" style={{ backgroundColor: primaryColor }}>
            Get Started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32" style={{ backgroundColor: "${landingPage.colors.background}" }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" style={{ backgroundColor: "${landingPage.colors.primary}20", color: primaryColor }}>
              Introducing ${landingPage.businessName}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              ${landingPage.hero.headline}
            </h1>
            <p className="text-lg text-gray-600">
              ${landingPage.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#pricing" className="px-6 py-3 font-semibold text-white rounded-xl shadow-md transition-all" style={{ backgroundColor: primaryColor }}>
                ${landingPage.hero.ctaPrimary.label}
              </a>
              <a href="#features" className="px-6 py-3 font-semibold text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                ${landingPage.hero.ctaSecondary.label}
              </a>
            </div>
          </div>
          <div className="relative">
            <img className="relative w-full rounded-2xl shadow-xl border border-gray-100 object-cover aspect-[4/3]" src="${landingPage.hero.imageUrl}" alt="Hero Graphic" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Why Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {${JSON.stringify(landingPage.features, null, 2)}.map((feature) => {
              const LucideIcon = Icons[feature.icon as keyof typeof Icons] || Icons.Zap;
              return (
                <div key={feature.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start">
                  <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: primaryColor + "15", color: primaryColor }}>
                    <LucideIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">${landingPage.pricing.title}</h2>
            <p className="text-gray-500 mt-4">${landingPage.pricing.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {${JSON.stringify(landingPage.pricing.tiers, null, 2)}.map((tier) => (
              <div key={tier.id} className={\`p-8 rounded-2xl border flex flex-col justify-between bg-white relative \${tier.isPopular ? "ring-2 ring-indigo-500 border-transparent" : "border-gray-200"}\`}>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{tier.name}</h4>
                  <p className="text-gray-500 text-sm mt-2">{tier.description}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 text-sm ml-2">/{tier.period}</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3 text-sm text-gray-600">
                        <Icons.Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full py-3 mt-8 font-semibold rounded-xl text-sm transition-all shadow-sm" style={{ backgroundColor: tier.isPopular ? primaryColor : "#f3f4f6", color: tier.isPopular ? "#ffffff" : "#1f2937" }}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}`;
  };

  const handleCopy = () => {
    let text = "";
    if (activeTab === "html") text = generateHTML();
    else if (activeTab === "react") text = generateReact();
    else text = JSON.stringify(landingPage, null, 2);

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = "landing-page.html";
    let content = "";

    if (activeTab === "html") {
      content = generateHTML();
    } else if (activeTab === "react") {
      filename = "LandingPage.tsx";
      content = generateReact();
    } else {
      filename = "landing-page.json";
      content = JSON.stringify(landingPage, null, 2);
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="export-modal-overlay">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Export Landing Page</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("html")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                activeTab === "html" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Single HTML File</span>
            </button>
            <button
              onClick={() => setActiveTab("react")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                activeTab === "react" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Code className="w-4 h-4" />
              <span>React Component (TSX)</span>
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                activeTab === "json" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>JSON Payload</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center space-x-1 cursor-pointer transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1 cursor-pointer transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-6 overflow-auto font-mono text-xs bg-[#1e1e1e] text-[#d4d4d4] select-text">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {activeTab === "html" ? generateHTML() : activeTab === "react" ? generateReact() : JSON.stringify(landingPage, null, 2)}
          </pre>
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Your landing page has been fully compiled with Tailwind CSS CDN and ready for direct hosting.</span>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900 font-semibold cursor-pointer">Close</button>
        </div>
      </div>
    </div>
  );
}
