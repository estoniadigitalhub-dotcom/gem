import React, { useState } from "react";
import * as Icons from "lucide-react";
import { LandingPage, FeatureItem, PricingTier, FAQItem } from "../types";

interface PreviewPanelProps {
  landingPage: LandingPage;
  onUpdatePage: (updated: LandingPage) => void;
  onInitiateCheckout: (tier: PricingTier) => void;
  isRegenerating: boolean;
  onRegenerateSection: (sectionType: string, currentContent: any, prompt: string) => Promise<void>;
}

// Helper component to resolve dynamic Lucide icons from AI-generated strings
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} />;
}

export default function PreviewPanel({
  landingPage,
  onUpdatePage,
  onInitiateCheckout,
  isRegenerating,
  onRegenerateSection
}: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editingElement, setEditingElement] = useState<{ section: string; key: string; index?: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [refineSection, setRefineSection] = useState<string | null>(null);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [refineLoading, setRefineLoading] = useState(false);

  // Colors extracted for local style attributes
  const { colors } = landingPage;

  // Handle direct text updates
  const startEditing = (section: string, key: string, initialVal: string, index?: number) => {
    setEditingElement({ section, key, index });
    setEditValue(initialVal);
  };

  const saveEdit = () => {
    if (!editingElement) return;

    const updated = { ...landingPage };
    const { section, key, index } = editingElement;

    if (section === "hero") {
      if (key === "headline") updated.hero.headline = editValue;
      else if (key === "subheadline") updated.hero.subheadline = editValue;
      else if (key === "ctaPrimaryLabel") updated.hero.ctaPrimary.label = editValue;
      else if (key === "ctaSecondaryLabel") updated.hero.ctaSecondary.label = editValue;
    } else if (section === "features" && typeof index === "number") {
      if (key === "title") updated.features[index].title = editValue;
      else if (key === "description") updated.features[index].description = editValue;
    } else if (section === "pricing") {
      if (key === "title") updated.pricing.title = editValue;
      else if (key === "subtitle") updated.pricing.subtitle = editValue;
      else if (key === "tierName" && typeof index === "number") {
        updated.pricing.tiers[index].name = editValue;
      } else if (key === "tierPrice" && typeof index === "number") {
        updated.pricing.tiers[index].price = editValue;
      }
    } else if (section === "faqs" && typeof index === "number") {
      if (key === "question") updated.faqs[index].question = editValue;
      else if (key === "answer") updated.faqs[index].answer = editValue;
    }

    onUpdatePage(updated);
    setEditingElement(null);
  };

  // Run AI refinement for a section
  const handleRefine = async (sectionType: string) => {
    if (!refinePrompt.trim()) return;
    setRefineLoading(true);
    try {
      let currentContent: any = {};
      if (sectionType === "hero") {
        currentContent = landingPage.hero;
      } else if (sectionType === "features") {
        currentContent = landingPage.features;
      } else if (sectionType === "pricing") {
        currentContent = landingPage.pricing;
      }

      await onRegenerateSection(sectionType, currentContent, refinePrompt);
      setRefineSection(null);
      setRefinePrompt("");
    } catch (e) {
      console.error(e);
    } finally {
      setRefineLoading(false);
    }
  };

  // Render inline editor if matching
  const renderInlineEditor = (section: string, key: string, index?: number) => {
    const isEditing =
      editingElement?.section === section &&
      editingElement?.key === key &&
      editingElement?.index === index;

    if (!isEditing) return null;

    return (
      <div className="absolute inset-0 z-40 bg-white/95 flex items-center p-2 rounded-lg shadow-lg border border-indigo-200">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:border-indigo-500 focus:outline-none min-h-[44px] text-gray-800"
        />
        <div className="flex flex-col space-y-1 ml-2">
          <button
            onClick={saveEdit}
            className="p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={() => setEditingElement(null)}
            className="p-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 select-none" id="preview-workspace">
      {/* Top action bar: viewport control */}
      <div className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Interactive Preview Canvas</span>
        </div>

        {/* Viewport selectors */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("desktop")}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === "desktop" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40" : "text-slate-400 hover:text-slate-600"
            }`}
            title="Desktop View"
          >
            <Icons.Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("tablet")}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === "tablet" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40" : "text-slate-400 hover:text-slate-600"
            }`}
            title="Tablet View"
          >
            <Icons.Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === "mobile" ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40" : "text-slate-400 hover:text-slate-600"
            }`}
            title="Mobile View"
          >
            <Icons.Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden md:block">
          {viewMode === "desktop" ? "Desktop Frame (100%)" : viewMode === "tablet" ? "Tablet Frame (768px)" : "Mobile Frame (375px)"}
        </div>
      </div>

      {/* Simulator view frame */}
      <div className="flex-1 p-6 overflow-auto flex justify-center items-start bg-slate-100 relative">
        {/* Transparent global loader for regenerations */}
        {isRegenerating && (
          <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center space-y-3 animate-fade-in">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">Gemini is styling section...</span>
          </div>
        )}

        {/* Scaled Browser Chassis */}
        <div
          className={`bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-200/60 transition-all duration-300 overflow-hidden flex flex-col ${
            viewMode === "desktop" ? "w-full max-w-5xl" : viewMode === "tablet" ? "w-[768px]" : "w-[375px]"
          }`}
          style={{ minHeight: "80vh" }}
          id="simulated-browser-frame"
        >
          {/* Browser header bar */}
          <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 select-none shrink-0">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
            </div>
            <div className="bg-white border border-slate-200 flex-1 mx-4 rounded-md h-6 flex items-center px-3 justify-center text-[10px] text-slate-400 font-mono select-none overflow-hidden">
              <Icons.Lock className="w-3 h-3 text-emerald-500 mr-1.5" />
              <span>https://{landingPage.businessName.toLowerCase().replace(/\s/g, "")}.com</span>
            </div>
          </div>

          {/* Actual landing page content container */}
          <div className="flex-1 overflow-y-auto select-text scroll-smooth" style={{ maxHeight: "75vh" }}>
            
            {/* Landing Page navigation header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between px-6 h-16 shrink-0">
              <div className="flex items-center space-x-2">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: colors.primary }}
                >
                  {landingPage.businessName.charAt(0)}
                </span>
                <span className="font-bold text-base text-slate-900 tracking-tight">{landingPage.businessName}</span>
              </div>
              <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-500">
                <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
                <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
                <a href="#faqs" className="hover:text-gray-900 transition-colors">FAQs</a>
              </nav>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer shadow-xs"
                style={{ backgroundColor: colors.primary }}
                onClick={() => {
                  const el = document.getElementById("pricing-preview-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get Started
              </button>
            </header>

            {/* HERO SECTION */}
            <section
              id="hero-preview-section"
              className="relative py-16 md:py-24 px-8 border-b border-gray-100 overflow-hidden group"
              style={{ backgroundColor: colors.background }}
            >
              {/* Section refiner action */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex space-x-1.5">
                <button
                  onClick={() => setRefineSection(refineSection === "hero" ? null : "hero")}
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:border-indigo-500 text-indigo-600 rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                >
                  <Icons.Wand2 className="w-3 h-3" />
                  <span>AI Rewrite</span>
                </button>
              </div>

              {/* Refinement input drawer */}
              {refineSection === "hero" && (
                <div className="absolute top-12 right-3 z-30 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center space-x-1">
                    <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Instruct Gemini to rewrite Hero:</span>
                  </h4>
                  <textarea
                    placeholder="e.g. Make it sound bolder, or focus on absolute security..."
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg min-h-[60px] focus:outline-none focus:border-indigo-500 text-gray-800"
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => setRefineSection(null)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRefine("hero")}
                      disabled={refineLoading}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {refineLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>Generate</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6 relative">
                  <span
                    className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${colors.primary}18`, color: colors.primary }}
                  >
                    🚀 NEW SOLUTION
                  </span>

                  {/* Headline (Direct Edit) */}
                  <div className="relative group/text rounded hover:bg-black/5 p-1 transition-all cursor-pointer">
                    <h1
                      className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                      style={{ color: colors.text }}
                      onClick={() => startEditing("hero", "headline", landingPage.hero.headline)}
                    >
                      {landingPage.hero.headline}
                    </h1>
                    <div className="absolute top-1 right-1 opacity-0 group-hover/text:opacity-100 text-gray-400 p-0.5 bg-white rounded shadow-xs">
                      <Icons.Edit3 className="w-3 h-3" />
                    </div>
                    {renderInlineEditor("hero", "headline")}
                  </div>

                  {/* Subheadline (Direct Edit) */}
                  <div className="relative group/text rounded hover:bg-black/5 p-1 transition-all cursor-pointer">
                    <p
                      className="text-sm md:text-base text-gray-600 leading-relaxed"
                      onClick={() => startEditing("hero", "subheadline", landingPage.hero.subheadline)}
                    >
                      {landingPage.hero.subheadline}
                    </p>
                    <div className="absolute top-1 right-1 opacity-0 group-hover/text:opacity-100 text-gray-400 p-0.5 bg-white rounded shadow-xs">
                      <Icons.Edit3 className="w-3 h-3" />
                    </div>
                    {renderInlineEditor("hero", "subheadline")}
                  </div>

                  {/* CTA Buttons (Direct edit label) */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="relative group/btn cursor-pointer">
                      <button
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md cursor-pointer"
                        style={{ backgroundColor: colors.primary }}
                        onClick={() => startEditing("hero", "ctaPrimaryLabel", landingPage.hero.ctaPrimary.label)}
                      >
                        {landingPage.hero.ctaPrimary.label}
                      </button>
                      {renderInlineEditor("hero", "ctaPrimaryLabel")}
                    </div>

                    <div className="relative group/btn cursor-pointer">
                      <button
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm cursor-pointer"
                        onClick={() => startEditing("hero", "ctaSecondaryLabel", landingPage.hero.ctaSecondary.label)}
                      >
                        {landingPage.hero.ctaSecondary.label}
                      </button>
                      {renderInlineEditor("hero", "ctaSecondaryLabel")}
                    </div>
                  </div>
                </div>

                {/* Hero graphic */}
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-2xl bg-indigo-500 opacity-10 blur-xl"></div>
                  <img
                    className="relative w-full rounded-2xl shadow-lg border border-gray-100 object-cover aspect-video"
                    src={landingPage.hero.imageUrl.startsWith("http") ? landingPage.hero.imageUrl : `https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop`}
                    alt="Hero Graphics"
                  />
                </div>
              </div>
            </section>

            {/* STATS SECTION */}
            <section className="bg-white border-b border-gray-100 py-10 px-8">
              <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
                {landingPage.stats.map((s, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl md:text-3xl font-extrabold" style={{ color: colors.primary }}>
                      {s.value}
                    </div>
                    <div className="text-[11px] md:text-xs text-gray-500 uppercase tracking-wider mt-1 font-medium">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-16 px-8 bg-gray-50/50 border-b border-gray-100 relative group">
              {/* Section refiner action */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex space-x-1.5">
                <button
                  onClick={() => setRefineSection(refineSection === "features" ? null : "features")}
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:border-indigo-500 text-indigo-600 rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                >
                  <Icons.Wand2 className="w-3 h-3" />
                  <span>AI Rewrite</span>
                </button>
              </div>

              {/* Refinement input drawer */}
              {refineSection === "features" && (
                <div className="absolute top-12 right-3 z-30 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center space-x-1">
                    <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Instruct Gemini to rewrite Features:</span>
                  </h4>
                  <textarea
                    placeholder="e.g. Focus on speed performance and data automation..."
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg min-h-[60px] focus:outline-none focus:border-indigo-500 text-gray-800"
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => setRefineSection(null)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRefine("features")}
                      disabled={refineLoading}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {refineLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>Generate</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">Elite Competitive Advantages</h2>
                  <p className="text-gray-500 text-xs mt-2">Engineered with next-generation technologies to scale your business.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {landingPage.features.map((feature, idx) => (
                    <div
                      key={feature.id}
                      className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col items-start relative group/feat hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div
                        className="p-2.5 rounded-xl mb-4"
                        style={{ backgroundColor: `${colors.primary}18`, color: colors.primary }}
                      >
                        <DynamicIcon name={feature.icon} className="w-5 h-5" />
                      </div>

                      {/* Feature Title */}
                      <div className="relative group/text rounded hover:bg-black/5 p-1 w-full transition-all">
                        <h3
                          className="font-bold text-gray-900 mb-1.5 text-base"
                          onClick={() => startEditing("features", "title", feature.title, idx)}
                        >
                          {feature.title}
                        </h3>
                        {renderInlineEditor("features", "title", idx)}
                      </div>

                      {/* Feature Description */}
                      <div className="relative group/text rounded hover:bg-black/5 p-1 w-full transition-all">
                        <p
                          className="text-gray-500 text-xs leading-relaxed"
                          onClick={() => startEditing("features", "description", feature.description, idx)}
                        >
                          {feature.description}
                        </p>
                        {renderInlineEditor("features", "description", idx)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-16 px-8 bg-white border-b border-gray-100">
              <div className="max-w-4xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">Endorsed by Fast Growing Brands</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {landingPage.testimonials.map((t, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 relative">
                      <p className="text-gray-600 text-xs italic relative z-10">"{t.quote}"</p>
                      <div className="flex items-center space-x-3 mt-4">
                        <img className="w-8 h-8 rounded-full object-cover" src={t.avatarUrl} alt={t.author} />
                        <div>
                          <div className="font-bold text-xs text-gray-900">{t.author}</div>
                          <div className="text-[10px] text-gray-400">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PRICING & STRIPE SECTION */}
            <section id="pricing-preview-section" className="py-16 px-8 bg-gray-50/50 border-b border-gray-100 relative group">
              {/* Section refiner action */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex space-x-1.5">
                <button
                  onClick={() => setRefineSection(refineSection === "pricing" ? null : "pricing")}
                  className="px-2.5 py-1 bg-white border border-gray-200 hover:border-indigo-500 text-indigo-600 rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer shadow-xs"
                >
                  <Icons.Wand2 className="w-3 h-3" />
                  <span>AI Rewrite</span>
                </button>
              </div>

              {/* Refinement input drawer */}
              {refineSection === "pricing" && (
                <div className="absolute top-12 right-3 z-30 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-fade-in">
                  <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center space-x-1">
                    <Icons.Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Instruct Gemini to rewrite Pricing:</span>
                  </h4>
                  <textarea
                    placeholder="e.g. Create a monthly subscription model, adjust names..."
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg min-h-[60px] focus:outline-none focus:border-indigo-500 text-gray-800"
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => setRefineSection(null)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRefine("pricing")}
                      disabled={refineLoading}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {refineLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>Generate</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="relative group/text inline-block rounded hover:bg-black/5 p-1">
                    <h2
                      className="text-2xl font-bold tracking-tight text-gray-900 cursor-pointer"
                      onClick={() => startEditing("pricing", "title", landingPage.pricing.title)}
                    >
                      {landingPage.pricing.title}
                    </h2>
                    {renderInlineEditor("pricing", "title")}
                  </div>

                  <div className="relative group/text rounded hover:bg-black/5 p-1 mt-1">
                    <p
                      className="text-gray-500 text-xs cursor-pointer"
                      onClick={() => startEditing("pricing", "subtitle", landingPage.pricing.subtitle)}
                    >
                      {landingPage.pricing.subtitle}
                    </p>
                    {renderInlineEditor("pricing", "subtitle")}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto items-stretch">
                  {landingPage.pricing.tiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className={`p-6 rounded-2xl border flex flex-col justify-between bg-white relative overflow-hidden transition-all shadow-xs ${
                        tier.isPopular ? "ring-2 ring-indigo-500 border-transparent shadow-md" : "border-gray-200"
                      }`}
                    >
                      {tier.isPopular && (
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-bl-lg uppercase tracking-wider">
                          Recommended
                        </div>
                      )}

                      <div>
                        {/* Tier Name */}
                        <div className="relative group/text rounded hover:bg-black/5 p-1">
                          <h4
                            className="font-bold text-gray-900 text-base cursor-pointer"
                            onClick={() => startEditing("pricing", "tierName", tier.name, idx)}
                          >
                            {tier.name}
                          </h4>
                          {renderInlineEditor("pricing", "tierName", idx)}
                        </div>

                        <p className="text-gray-400 text-[11px] mt-1.5 leading-relaxed">{tier.description}</p>

                        {/* Tier Price */}
                        <div className="relative group/text rounded hover:bg-black/5 p-1 mt-4 flex items-baseline">
                          <span
                            className="text-3xl font-extrabold text-gray-900 cursor-pointer"
                            onClick={() => startEditing("pricing", "tierPrice", tier.price, idx)}
                          >
                            {tier.price}
                          </span>
                          <span className="text-gray-500 text-xs ml-1.5">/{tier.period}</span>
                          {renderInlineEditor("pricing", "tierPrice", idx)}
                        </div>

                        <ul className="mt-6 space-y-3">
                          {tier.features.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-center space-x-2 text-xs text-gray-600">
                              <Icons.Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Simulated Checkout trigger */}
                      <button
                        onClick={() => onInitiateCheckout(tier)}
                        className="w-full py-2.5 mt-8 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                        style={{
                          backgroundColor: tier.isPopular ? colors.primary : "#f1f5f9",
                          color: tier.isPopular ? "#ffffff" : "#1f2937"
                        }}
                      >
                        <Icons.CreditCard className="w-4 h-4" />
                        <span>Select Plan (Checkout)</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQs SECTION */}
            <section id="faqs" className="py-16 px-8 bg-white border-b border-gray-100">
              <div className="max-w-3xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">Questions & Answers</h2>
                  <p className="text-gray-500 text-xs mt-2">Get direct explanations for general concerns.</p>
                </div>

                <div className="space-y-4">
                  {landingPage.faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col">
                      {/* FAQ Question */}
                      <div className="relative group/text rounded hover:bg-black/5 p-1 transition-all cursor-pointer">
                        <h4
                          className="font-bold text-gray-900 text-xs md:text-sm"
                          onClick={() => startEditing("faqs", "question", faq.question, idx)}
                        >
                          {faq.question}
                        </h4>
                        {renderInlineEditor("faqs", "question", idx)}
                      </div>

                      {/* FAQ Answer */}
                      <div className="relative group/text rounded hover:bg-black/5 p-1 mt-1.5 transition-all cursor-pointer">
                        <p
                          className="text-gray-500 text-xs leading-relaxed"
                          onClick={() => startEditing("faqs", "answer", faq.answer, idx)}
                        >
                          {faq.answer}
                        </p>
                        {renderInlineEditor("faqs", "answer", idx)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* LANDING PAGE FOOTER */}
            <footer className="bg-gray-900 text-white py-12 px-8">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {landingPage.businessName.charAt(0)}
                  </span>
                  <span className="font-bold text-base tracking-tight">{landingPage.businessName}</span>
                </div>
                <div className="flex space-x-6 text-xs text-gray-400">
                  {landingPage.footer.links.map((l, idx) => (
                    <a key={idx} href={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </a>
                  ))}
                </div>
                <div className="text-xs text-gray-500">{landingPage.footer.copyright}</div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}
