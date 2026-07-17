import React from "react";
import { X, Sparkles, Layout, ShoppingBag, User, Calendar, Smartphone, ChevronRight } from "lucide-react";
import { LandingPage } from "../types";
import { templates } from "../data/templates";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: LandingPage) => void;
}

export default function TemplatesModal({
  isOpen,
  onClose,
  onSelectTemplate
}: TemplatesModalProps) {
  if (!isOpen) return null;

  // Map category icons
  const getTemplateIcon = (id: string) => {
    switch (id) {
      case "tpl_saas":
        return <Layout className="w-4 h-4 text-indigo-600" />;
      case "tpl_ecommerce":
        return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case "tpl_portfolio":
        return <User className="w-4 h-4 text-slate-700" />;
      case "tpl_event":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case "tpl_app":
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  // Map category badges
  const getCategoryBadge = (id: string) => {
    switch (id) {
      case "tpl_saas":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "tpl_ecommerce":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "tpl_portfolio":
        return "bg-slate-50 text-slate-700 border-slate-200";
      case "tpl_event":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "tpl_app":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getThemeLabel = (theme: string) => {
    switch (theme) {
      case "indigo": return "Modern Indigo";
      case "amber": return "Amber Wood";
      case "brutalist": return "Brutalist Slate";
      case "cyberpunk": return "Dark Cyberpunk";
      case "emerald": return "Soft Emerald";
      default: return theme;
    }
  };

  const handleSelect = (tpl: LandingPage) => {
    // Generate a fresh unique ID for this loaded instance so we don't conflict
    const loadedTpl = {
      ...tpl,
      id: "lp_" + Math.random().toString(36).substring(2, 11)
    };
    onSelectTemplate(loadedTpl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="templates-modal-root">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100/50 rounded-md px-2 py-0.5 tracking-widest uppercase">
                Ready to Deploy
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400 font-semibold">5 Diverse Blueprints</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Starting Templates</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
            Select an expert-designed starting structure with complete copies, stats, pricing tables, and FAQs. You can fully personalize the color palettes and rewrite sections using our live Gemini API assistant.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {templates.map((tpl) => (
              <div 
                key={tpl.id}
                onClick={() => handleSelect(tpl)}
                className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden flex flex-col shadow-xs hover:shadow-lg hover:border-indigo-400/60 transition-all cursor-pointer hover:scale-[1.01] duration-200"
              >
                {/* Visual Thumbnail Frame */}
                <div className="relative h-32 bg-slate-100 overflow-hidden shrink-0">
                  <img 
                    src={tpl.hero.imageUrl} 
                    alt={tpl.businessName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle color palette preview dots in the corner */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/60 backdrop-blur-xs px-2 py-1 rounded-md">
                    <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: tpl.colors.primary }} />
                    <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: tpl.colors.secondary }} />
                    <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: tpl.colors.background }} />
                    <span className="text-[9px] font-bold text-white/95 uppercase ml-1 font-mono tracking-wider">{getThemeLabel(tpl.theme).split(" ")[0]}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        {getTemplateIcon(tpl.id)}
                        <span className="font-bold text-slate-900 text-sm tracking-tight">{tpl.businessName}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 border rounded uppercase tracking-wider ${getCategoryBadge(tpl.id)}`}>
                        {tpl.id.replace("tpl_", "")}
                      </span>
                    </div>

                    <p className="text-slate-600 font-bold text-xs leading-normal line-clamp-1">
                      {tpl.tagline}
                    </p>
                    <p className="text-slate-400 text-[10px] leading-relaxed font-medium line-clamp-2">
                      {tpl.hero.subheadline}
                    </p>
                  </div>

                  {/* CTA Loader row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono font-medium">
                      {tpl.features.length} features • {tpl.pricing.tiers.length} price tiers
                    </span>
                    <button 
                      className="text-[11px] font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-0.5"
                    >
                      <span>Load Template</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium shrink-0">
          <span>Sandbox environment is loaded with fully authorized payment channels.</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 transition-all cursor-pointer shadow-xs"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
