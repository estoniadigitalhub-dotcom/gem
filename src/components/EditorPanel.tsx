import React, { useState } from "react";
import { Sparkles, Wand2, Palette, Crown, Lock, CheckCircle2, Download, RefreshCw } from "lucide-react";
import { GeneratorInput, LandingPage } from "../types";

interface EditorPanelProps {
  input: GeneratorInput;
  onChangeInput: (input: GeneratorInput) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  landingPage: LandingPage | null;
  onUpdatePage: (updated: LandingPage) => void;
  isPremium: boolean;
  onUpgradeStripe: () => void;
  onOpenExport: () => void;
  upgradeLoading: boolean;
}

export default function EditorPanel({
  input,
  onChangeInput,
  onGenerate,
  isGenerating,
  landingPage,
  onUpdatePage,
  isPremium,
  onUpgradeStripe,
  onOpenExport,
  upgradeLoading
}: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<"generate" | "customize">("generate");

  const handleInputChange = (key: keyof GeneratorInput, value: string) => {
    onChangeInput({
      ...input,
      [key]: value
    });
  };

  const updateColor = (colorKey: string, val: string) => {
    if (!landingPage) return;
    const updated = {
      ...landingPage,
      colors: {
        ...landingPage.colors,
        [colorKey]: val
      }
    };
    // Sync primaryHover if updating primary
    if (colorKey === "primary") {
      updated.colors.primaryHover = val + "dd"; // slightly transparent representation of hover
    }
    onUpdatePage(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <div className="w-full lg:w-[380px] border-r border-slate-200 bg-slate-50 flex flex-col h-full shrink-0" id="editor-sidebar">
      {/* Sidebar Header Block */}
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Layout Blocks</span>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-none">Element Settings</h2>
        </div>
        {landingPage && (
          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-55/10 border border-indigo-100 rounded px-1.5 py-0.5 uppercase tracking-wider">
            Stripe Connected
          </span>
        )}
      </div>

      {/* Tabs Container */}
      <div className="flex border-b border-slate-200 p-1.5 bg-slate-100/50 gap-1 shrink-0">
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeTab === "generate"
              ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Generator Form</span>
        </button>
        <button
          onClick={() => {
            if (landingPage) setActiveTab("customize");
          }}
          disabled={!landingPage}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeTab === "customize"
              ? "bg-white text-indigo-600 shadow-xs border border-slate-200/40"
              : "text-slate-400 cursor-not-allowed"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Palette Controls</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "generate" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Business / Product Name
              </label>
              <input
                type="text"
                value={input.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                placeholder="e.g. Tasky Flow"
                required
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-xs"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Industry Category
              </label>
              <select
                value={input.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all font-medium shadow-xs"
              >
                <option value="SaaS / Software Product">SaaS / Software Product</option>
                <option value="E-commerce Store">E-commerce Store</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Creative Agency & Consultancy">Creative Agency & Consultancy</option>
                <option value="E-Learning & Online Course">E-Learning & Online Course</option>
                <option value="Real Estate Platform">Real Estate Platform</option>
                <option value="Health & Wellness App">Health & Wellness App</option>
              </select>
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                What does your business do?
              </label>
              <textarea
                value={input.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Provide details about features, services, and why customers choose you..."
                required
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-xs resize-none"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Target Customer Segment
              </label>
              <input
                type="text"
                value={input.audience}
                onChange={(e) => handleInputChange("audience", e.target.value)}
                placeholder="e.g. Remote freelancers & solo developers"
                required
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium shadow-xs"
              />
            </div>

            {/* Branding Tone */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Brand Tone of Voice
              </label>
              <select
                value={input.tone}
                onChange={(e) => handleInputChange("tone", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all font-medium shadow-xs"
              >
                <option value="professional & authoritative">Professional & Authoritative</option>
                <option value="playful & warm">Playful & Warm</option>
                <option value="bold, high-converting copywriter style">Bold & Persuasive</option>
                <option value="minimalist, high-end editorial style">Minimalist & Luxury</option>
                <option value="high-tech & modern developer focus">High-Tech & Technical</option>
              </select>
            </div>

            {/* Layout Theme Presets */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Layout Theme Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "modern-indigo", name: "Indigo", color: "bg-indigo-600" },
                  { id: "dark-cyberpunk", name: "Cyberpunk", color: "bg-purple-900" },
                  { id: "warm-amber", name: "Amber Wood", color: "bg-amber-600" },
                  { id: "brutalist-mono", name: "Brutalist", color: "bg-zinc-850" },
                  { id: "soft-emerald", name: "Emerald", color: "bg-emerald-600" }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleInputChange("themePreference", preset.id)}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-all text-left ${
                      input.themePreference === preset.id
                        ? "border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-50 text-indigo-950"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${preset.color} shrink-0`}></span>
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Trigger */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-400 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] mt-2 h-11"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Structuring design copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Landing Page</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Style & Palette Controls */
          <div className="space-y-6">
            {landingPage ? (
              <>
                <div className="bg-indigo-50/40 p-4 border border-indigo-100/50 rounded-xl">
                  <h3 className="text-xs font-bold text-indigo-900 mb-1 flex items-center space-x-1.5">
                    <Palette className="w-4 h-4 text-indigo-600" />
                    <span>Real-time Visual Styling</span>
                  </h3>
                  <p className="text-[10px] text-indigo-700/80 leading-normal">
                    Modifying colors instantly propagates to the preview viewport.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Primary color */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                      <span>Primary Accent Color</span>
                      <span className="font-mono text-[10px] text-indigo-600 font-bold">{landingPage.colors.primary}</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={landingPage.colors.primary}
                        onChange={(e) => updateColor("primary", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0 overflow-hidden shrink-0"
                      />
                      <input
                        type="text"
                        value={landingPage.colors.primary}
                        onChange={(e) => updateColor("primary", e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Secondary color */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                      <span>Secondary Color</span>
                      <span className="font-mono text-[10px] text-gray-600">{landingPage.colors.secondary}</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={landingPage.colors.secondary}
                        onChange={(e) => updateColor("secondary", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0 overflow-hidden shrink-0"
                      />
                      <input
                        type="text"
                        value={landingPage.colors.secondary}
                        onChange={(e) => updateColor("secondary", e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Background color */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                      <span>Ambient Background Color</span>
                      <span className="font-mono text-[10px] text-gray-600">{landingPage.colors.background}</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={landingPage.colors.background}
                        onChange={(e) => updateColor("background", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0 overflow-hidden shrink-0"
                      />
                      <input
                        type="text"
                        value={landingPage.colors.background}
                        onChange={(e) => updateColor("background", e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                      <span>Rich Contrast Text</span>
                      <span className="font-mono text-[10px] text-gray-600">{landingPage.colors.text}</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={landingPage.colors.text}
                        onChange={(e) => updateColor("text", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0 overflow-hidden shrink-0"
                      />
                      <input
                        type="text"
                        value={landingPage.colors.text}
                        onChange={(e) => updateColor("text", e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6 font-medium">Please generate a landing page first.</p>
            )}
          </div>
        )}
      </div>

      {/* Premium Stripe widget footer */}
      {landingPage && (
        <div className="p-5 border-t border-slate-200 bg-slate-50 shrink-0">
          {isPremium ? (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start space-x-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-650 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950 leading-none">Developer Pack Active</h4>
                <p className="text-[10px] text-emerald-700 mt-1.5 leading-relaxed font-medium">
                  Stripe transaction verified. You have full code exporting privileges.
                </p>
                <button
                  onClick={onOpenExport}
                  className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Code Templates</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-md shadow-indigo-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-indigo-100 tracking-widest uppercase flex items-center space-x-1">
                  <Crown className="w-3 h-3 fill-white" />
                  <span>Upgrade Platform</span>
                </span>
                <span className="text-xs font-extrabold bg-indigo-500/80 px-2 py-0.5 rounded font-mono">$19.00</span>
              </div>
              <p className="text-[11px] text-indigo-100 mb-3.5 leading-relaxed font-medium">
                Unlock lifetime access to compile fully functional static HTML & React modules of your designs.
              </p>
              <button
                onClick={onUpgradeStripe}
                disabled={upgradeLoading}
                className="w-full py-2 bg-white text-indigo-600 hover:bg-indigo-50 disabled:bg-gray-100 disabled:text-gray-400 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs h-9"
              >
                {upgradeLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock Export (Stripe)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
