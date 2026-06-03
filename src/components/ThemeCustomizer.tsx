import React, { useState } from "react";
import { ThemeSettings, ThemeSection } from "../types";
import { 
  Palette, 
  Type, 
  Settings, 
  Sliders, 
  LayoutGrid, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Eye, 
  ChevronRight, 
  Sparkles,
  ShoppingBag,
  Maximize2,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Check,
  Copy,
  Code
} from "lucide-react";

interface ThemeCustomizerProps {
  settings: ThemeSettings;
  onUpdateSettings: (settings: Partial<ThemeSettings>) => void;
  sections: ThemeSection[];
  onUpdateSections: (sections: ThemeSection[]) => void;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  onAddPreset: (type: string) => void;
  activePage: "home" | "product" | "collection" | "cart";
}

export default function ThemeCustomizer({
  settings,
  onUpdateSettings,
  sections,
  onUpdateSections,
  selectedSectionId,
  onSelectSection,
  onAddPreset,
  activePage
}: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState<"sections" | "global" | "mobile-diagnostics">("sections");
  const [isScanning, setIsScanning] = useState(false);
  const [auditCompleted, setAuditCompleted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const startAuditScan = () => {
    setIsScanning(true);
    setAuditCompleted(false);
    setTimeout(() => {
      setIsScanning(false);
      setAuditCompleted(true);
    }, 1200);
  };

  const handleCopyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filter sections by activePage template
  const pageSections = sections.filter(sec => (sec.page || "home") === activePage);

  const moveSection = (pageIndex: number, direction: "up" | "down") => {
    const updatedPageSections = [...pageSections];
    const targetIdx = direction === "up" ? pageIndex - 1 : pageIndex + 1;
    if (targetIdx < 0 || targetIdx >= updatedPageSections.length) return;
    
    const [temp] = updatedPageSections.splice(pageIndex, 1);
    updatedPageSections.splice(targetIdx, 0, temp);

    // Map back to global sections list
    const otherSections = sections.filter(sec => (sec.page || "home") !== activePage);
    onUpdateSections([...otherSections, ...updatedPageSections]);
  };

  const removeSection = (pageIndex: number) => {
    const sectionToRemove = pageSections[pageIndex];
    if (!sectionToRemove) return;
    const updatedPageSections = pageSections.filter((_, i) => i !== pageIndex);
    
    // Map back to global sections list
    const otherSections = sections.filter(sec => (sec.page || "home") !== activePage);
    onUpdateSections([...otherSections, ...updatedPageSections]);

    if (selectedSectionId === sectionToRemove.sectionId) {
      onSelectSection(null);
    }
  };

  const updateSectionText = (id: string, heading: string, subheading: string) => {
    const updated = sections.map(sec => {
      if (sec.sectionId === id) {
        return {
          ...sec,
          visuals: {
            ...sec.visuals,
            heading,
            subheading
          }
        };
      }
      return sec;
    });
    onUpdateSections(updated);
  };

  const selectedSection = sections.find(s => s.sectionId === selectedSectionId);

  return (
    <div id="theme-customizer" className="h-full bg-slate-900 border-r border-slate-800 flex flex-col select-none text-slate-200">
      {/* Visual Workspace Identity Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <ShoppingBag className="w-4.5 h-4.5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-sm font-sans font-bold tracking-tight text-white leading-none">Shopify Studio</h1>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">Live Visual Sandbox</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          LOCAL ENGINE
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="grid grid-cols-3 bg-slate-950/40 p-1 border-b border-slate-800/80 font-sans">
        <button
          onClick={() => setActiveTab("sections")}
          className={`flex flex-col items-center justify-center gap-1 py-2 text-[10px] sm:text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
            activeTab === "sections" 
              ? "bg-slate-800 text-white shadow-sm" 
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Layout</span>
        </button>
        <button
          onClick={() => setActiveTab("global")}
          className={`flex flex-col items-center justify-center gap-1 py-2 text-[10px] sm:text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
            activeTab === "global" 
              ? "bg-slate-800 text-white shadow-sm" 
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Brand</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("mobile-diagnostics");
            if (!auditCompleted && !isScanning) {
              startAuditScan();
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1.5 text-[10px] sm:text-xs font-semibold rounded-md transition-all duration-200 relative cursor-pointer ${
            activeTab === "mobile-diagnostics" 
              ? "bg-slate-800 text-white shadow-sm" 
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
          {(!settings.mobileMenuFixed || !settings.horizontalScrollFixed || !settings.tapTargetsFixed || !settings.fluidImagesFixed || !settings.lazyLoadingSecured) && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scroll">
        {activeTab === "sections" && (
          <>
            {/* Sections List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Active {activePage === "home" ? "Home" : activePage === "product" ? "Product" : activePage === "collection" ? "Collection" : "Cart"} Template
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded-full">{pageSections.length} Active</span>
              </div>

              {pageSections.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500">
                  <Sliders className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="text-xs leading-relaxed">No custom template sections added yet.</p>
                  <p className="text-[10px] mt-1 text-slate-600">Use AI Designer or Preset blocks below to start.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pageSections.map((sec, idx) => {
                    const isSelected = selectedSectionId === sec.sectionId;
                    const isAiGenerated = sec.sectionId.includes("-ai-");

                    return (
                      <div 
                        key={sec.sectionId}
                        className={`group rounded-xl border transition-all duration-200 ${
                          isSelected 
                            ? "bg-slate-800/80 border-emerald-500 shadow-md shadow-emerald-500/5" 
                            : "bg-slate-800/30 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="p-3.5 flex items-center justify-between">
                          <button 
                            onClick={() => onSelectSection(isSelected ? null : sec.sectionId)}
                            className="flex-1 text-left flex items-center gap-2.5 outline-none cursor-pointer"
                          >
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              isSelected ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-slate-600"
                            }`} />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-200 line-clamp-1">{sec.title}</span>
                                {isAiGenerated && (
                                  <span className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono px-1 rounded-sm flex items-center gap-0.5">
                                    <Sparkles className="w-2.5 h-2.5 text-purple-400" /> AI
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 tracking-wider capitalize">{sec.type.replace("-", " ")}</span>
                            </div>
                          </button>

                          {/* Quick Sorting & Delete Suite */}
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all duration-200">
                            <button
                              onClick={() => moveSection(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 hover:bg-slate-700/80 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move section up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveSection(idx, "down")}
                              disabled={idx === sections.length - 1}
                              className="p-1 hover:bg-slate-700/80 rounded text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move section down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeSection(idx)}
                              className="p-1 hover:bg-rose-500/20 rounded text-slate-400 hover:text-rose-400 cursor-pointer"
                              title="Delete Section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Content Customization if Selected */}
                        {isSelected && (
                          <div className="px-4 pb-4 border-t border-slate-700/40 pt-3 space-y-3 bg-slate-900/60 rounded-b-xl">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1 tracking-wider uppercase">Section Header</label>
                              <input 
                                type="text"
                                value={sec.visuals.heading}
                                onChange={(e) => updateSectionText(sec.sectionId, e.target.value, sec.visuals.subheading || "")}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs font-sans text-slate-200 focus:border-emerald-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1 tracking-wider uppercase">Lead Description</label>
                              <textarea
                                value={sec.visuals.subheading || ""}
                                rows={2}
                                onChange={(e) => updateSectionText(sec.sectionId, sec.visuals.heading, e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs font-sans text-slate-200 focus:border-emerald-500 focus:outline-none resize-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <span className="text-[10px] font-mono text-slate-500 leading-normal">
                                Visual styles and layout options are adjusted automatically based on theme properties. Use the Code suite on the right to examine Shopify variables.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Presets Drawer */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Standard Theme Presets</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAddPreset("hero-banner")}
                  className="bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 rounded-lg p-2.5 text-left transition-all duration-150 cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-200">Hero Section</p>
                  <span className="text-[10px] text-slate-500 font-mono">Splash Brand Billboard</span>
                </button>
                <button
                  onClick={() => onAddPreset("featured-collection")}
                  className="bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 rounded-lg p-2.5 text-left transition-all duration-150 cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-200">Products Grid</p>
                  <span className="text-[10px] text-slate-500 font-mono">Collection Showcase</span>
                </button>
                <button
                  onClick={() => onAddPreset("image-with-text")}
                  className="bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 rounded-lg p-2.5 text-left transition-all duration-150 cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-200">Story Box</p>
                  <span className="text-[10px] text-slate-500 font-mono">Split Image & Copy</span>
                </button>
                <button
                  onClick={() => onAddPreset("newsletter")}
                  className="bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 rounded-lg p-2.5 text-left transition-all duration-150 cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-200">Newsletter Form</p>
                  <span className="text-[10px] text-slate-500 font-mono">Customer Sign Up Row</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "global" && (
          /* Global Color and Design Systems Editor */
          <div className="space-y-4">
            <div className="p-3 bg-indigo-950/40 border border-indigo-900/40 rounded-xl">
              <p className="text-xs text-indigo-200 font-medium leading-relaxed">
                Visual brand presets define how elements of your Theme sections adapt in-store! Adjust colors or typography schemas here.
              </p>
            </div>

            {/* Logo Settings */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Store Brand Name</span>
              <input 
                type="text"
                value={settings.logoText}
                onChange={(e) => onUpdateSettings({ logoText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs font-sans text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Typography Palette */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Typography Pairing</span>
              <div className="grid grid-cols-2 gap-1.5">
                {(["Inter", "Space Grotesk", "Playfair Display", "JetBrains Mono"] as const).map(font => (
                  <button
                    key={font}
                    onClick={() => onUpdateSettings({ fontFamily: font })}
                    className={`p-2 border text-left rounded-lg text-xs font-sans transition-all duration-150 cursor-pointer ${
                      settings.fontFamily === font 
                        ? "border-emerald-400 bg-slate-800/70 text-white" 
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <span style={{ fontFamily: font === "Inter" ? "sans-serif" : font }}>{font}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Colors Palette */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Color Palette Definitions</span>
              
              <div className="space-y-2 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Accent Focus</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => onUpdateSettings({ accentColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{settings.accentColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Primary Headers</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => onUpdateSettings({ primaryColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{settings.primaryColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Description Copy</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => onUpdateSettings({ textColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{settings.textColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Default Backdrop</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={settings.bgColor}
                      onChange={(e) => onUpdateSettings({ bgColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{settings.bgColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Design System Details */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Sizing Elements Scale</span>
              <div className="grid grid-cols-3 gap-1 bg-slate-950/40 p-1 rounded-md">
                {(["sm", "base", "lg"] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ fontSizeBase: size })}
                    className={`py-1 text-xs rounded transition-all duration-150 cursor-pointer text-center ${
                      settings.fontSizeBase === size
                        ? "bg-slate-800 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Border Corners Radius</span>
              <div className="grid grid-cols-4 gap-1 bg-slate-950/40 p-1 rounded-md">
                {(["none", "md", "xl", "full"] as const).map(radius => (
                  <button
                    key={radius}
                    onClick={() => onUpdateSettings({ borderRadius: radius })}
                    className={`py-1 text-xs rounded transition-all duration-150 cursor-pointer text-center ${
                      settings.borderRadius === radius
                        ? "bg-slate-800 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {radius === "none" ? "Flat" : radius.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "mobile-diagnostics" && (
          /* Mobile Responsiveness Diagnostics Layout Dashboard */
          <div className="space-y-4 font-sans text-left">
            {/* Header Stats card */}
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 uppercase tracking-widest font-mono">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-405 text-emerald-400" />
                  <span>Shopify Mobile Score</span>
                </div>
                <div className="text-right">
                  <span className={`text-base font-black font-mono px-2 py-0.5 rounded-md ${
                    (settings.mobileMenuFixed && settings.horizontalScrollFixed && settings.tapTargetsFixed && settings.fluidImagesFixed && settings.lazyLoadingSecured)
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                      : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                  }`}>
                    {(() => {
                      let score = 32;
                      if (settings.horizontalScrollFixed) score += 15;
                      if (settings.mobileMenuFixed) score += 20;
                      if (settings.tapTargetsFixed) score += 13;
                      if (settings.fluidImagesFixed) score += 12;
                      if (settings.lazyLoadingSecured) score += 8;
                      return `${score}/100`;
                    })()}
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400"
                  style={{
                    width: (() => {
                      let score = 32;
                      if (settings.horizontalScrollFixed) score += 15;
                      if (settings.mobileMenuFixed) score += 20;
                      if (settings.tapTargetsFixed) score += 13;
                      if (settings.fluidImagesFixed) score += 12;
                      if (settings.lazyLoadingSecured) score += 8;
                      return `${score}%`;
                    })()
                  }}
                />
              </div>

              {isScanning ? (
                <div className="py-2 flex items-center justify-center gap-2 font-mono text-[10px] text-[#D1FF26] bg-[#0A0A0A] border border-zinc-800 rounded">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D1FF26] animate-ping" />
                  <span>COMPILING CSS HOOKS & COMPONENT RATIOS...</span>
                </div>
              ) : (
                <button
                  onClick={startAuditScan}
                  className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10px] uppercase font-bold tracking-widest p-2 rounded-md hover:text-white transition-colors cursor-pointer text-center"
                >
                  Run Responsive Liquid Layout Scan
                </button>
              )}
            </div>

            {/* Diagnostic Bug Lists */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">Diagnosed Mobile Viewport Faults</span>

              {/* Bug 1: Horizontal Scrollbar Overflow */}
              <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5 space-y-3 bg-slate-800/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">
                        CRITICAL FAULT
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono font-bold">FAULT CODE: SHP-M01</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">Horizontal Scrollbar Overflow Trigger</h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-light">
                      Hardcoded grid sizes or fixed pixel boundaries push content past screen margins, causing horizontal user scrolls.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded inline-block ${
                      settings.horizontalScrollFixed ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                    }`}>
                      {settings.horizontalScrollFixed ? "💚 RECTIFIED" : "🔴 UNRESOLVED"}
                    </span>
                  </div>
                </div>

                {settings.horizontalScrollFixed ? (
                  <div className="space-y-1.5 text-left border-t border-slate-800/40 pt-2.5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#D1FF26]">
                      <span>Corrected Liquid CSS Rule (assets/theme.css):</span>
                      <button 
                        onClick={() => handleCopyCode(`html, body {
  overflow-x: hidden !important;
  max-width: 100vw;
  width: 100%;
}
.shopify-section, .container, .page-width {
  box-sizing: border-box !important;
  padding-left: 1.25rem !important;
  padding-right: 1.25rem !important;
  max-width: 100% !important;
}`, "scroll-fix")}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === "scroll-fix" ? "Copied!" : "Copy code"}</span>
                      </button>
                    </div>
                    <pre className="bg-slate-950 p-2 text-[9px] font-mono text-slate-300 overflow-x-auto rounded border border-slate-900 leading-tight">
{`/* Injected Liquid Layout Safety Wrap */
html, body {
  overflow-x: hidden !important;
  max-width: 100vw;
  width: 100%;
}
.shopify-section, .container, .page-width {
  box-sizing: border-box !important;
  padding-left: 1.25rem !important;
  padding-right: 1.25rem !important;
}`}
                    </pre>
                    <button 
                      onClick={() => onUpdateSettings({ horizontalScrollFixed: false })}
                      className="text-[9px] font-mono text-slate-500 hover:text-slate-300 underline cursor-pointer"
                    >
                      Disable fix and reintroduce fault
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onUpdateSettings({ horizontalScrollFixed: true })}
                    className="w-full bg-emerald-400 hover:bg-emerald-350 text-black text-[10px] uppercase font-black tracking-widest py-2 rounded transition-all cursor-pointer text-center"
                  >
                    Apply overflow-x-hidden fluid wrapper
                  </button>
                )}
              </div>

              {/* Bug 2: Mobile Menu slide toggle */}
              <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5 space-y-3 bg-slate-800/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">
                        CRITICAL FAULT
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono font-bold">FAULT CODE: SHP-M02</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">Non-Functional Mobile navigation</h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-light">
                      Mobile hamburger navigation drawer is absent, meaning mobile shoppers cannot load store pages or navigate collections.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded inline-block ${
                      settings.mobileMenuFixed ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                    }`}>
                      {settings.mobileMenuFixed ? "💚 RECTIFIED" : "🔴 UNRESOLVED"}
                    </span>
                  </div>
                </div>

                {settings.mobileMenuFixed ? (
                  <div className="space-y-1.5 text-left border-t border-slate-800/40 pt-2.5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-550">
                      <span>Liquid Template slide-out Drawer (layout/theme.liquid):</span>
                      <button 
                        onClick={() => handleCopyCode(`<!-- snippets/header-mobile-drawer.liquid -->
<button class="mobile-menu-trigger p-3 md:hidden" aria-expanded="false" aria-controls="mobile-nav">
  <span class="hamburger-icon"></span>
</button>
<div id="mobile-nav" class="mobile-drawer fixed inset-y-0 left-0 w-80 bg-black z-[100] transform -translate-x-full transition-transform duration-300">
  <button class="close-drawer p-4 text-white">✕ Close</button>
  <ul class="p-6 space-y-4 font-bold text-white uppercase text-sm">
    <li><a href="/collections/all">Shop Catalog</a></li>
    <li><a href="/collections/new">New Drops</a></li>
  </ul>
</div>
<script>
  document.querySelector('.mobile-menu-trigger').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.remove('-translate-x-full');
  });
  document.querySelector('.close-drawer').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.add('-translate-x-full');
  });
</script>`, "menu-fix")}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === "menu-fix" ? "Copied!" : "Copy code"}</span>
                      </button>
                    </div>
                    <pre className="bg-slate-950 p-2 text-[9px] font-mono text-slate-300 overflow-x-auto rounded border border-slate-900 leading-tight">
{`<!-- Slide Menu Component & JS Toggle -->
<div id="mobile-nav" class="fixed inset-y-0 left-0 w-80 transition-transform ...">
  <button class="close-drawer">✕ Close</button>
  <ul class="p-6 space-y-4 font-bold uppercase">
    <li><a href="/collections/all">Shop Catalog</a></li>
  </ul>
</div>`}
                    </pre>
                    <button 
                      onClick={() => onUpdateSettings({ mobileMenuFixed: false })}
                      className="text-[9px] font-mono text-slate-500 hover:text-slate-300 underline cursor-pointer"
                    >
                      Disable fix and reintroduce fault
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onUpdateSettings({ mobileMenuFixed: true })}
                    className="w-full bg-emerald-400 hover:bg-emerald-350 text-black text-[10px] uppercase font-black tracking-widest py-2 rounded transition-all cursor-pointer text-center"
                  >
                    Implement Mobile Hamburger Drawer Menu
                  </button>
                )}
              </div>

              {/* Bug 3: Tap Target Guidelines */}
              <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5 space-y-3 bg-slate-800/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
                        IMPORTANT FAULT
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono font-bold">FAULT CODE: SHP-M03</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">Sub-optimal Tap Target Sizes</h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-light">
                      Checkout and "Quick Add" buttons are under Apple Human Interface Guidelines and Google Lighthouse tap scores (32px vs 48px).
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded inline-block ${
                      settings.tapTargetsFixed ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                    }`}>
                      {settings.tapTargetsFixed ? "💚 RECTIFIED" : "🔴 UNRESOLVED"}
                    </span>
                  </div>
                </div>

                {settings.tapTargetsFixed ? (
                  <div className="space-y-1.5 text-left border-t border-slate-800/40 pt-2.5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-550">
                      <span>Accessible Touch Sizing (assets/theme.css):</span>
                      <button 
                        onClick={() => handleCopyCode(`/* Force minimum touch targets height to 48px on standard touch inputs */
button, .btn, .shopify-payment-button, .card-quick-add {
  min-height: 48px !important;
  font-size: 13px !important;
  padding: 12px 24px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer;
}`, "tap-fix")}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === "tap-fix" ? "Copied!" : "Copy code"}</span>
                      </button>
                    </div>
                    <pre className="bg-slate-950 p-2 text-[9px] font-mono text-slate-300 overflow-x-auto rounded border border-slate-900 leading-tight">
{`/* Accessible Apple Tap Sizing standard */
button, .btn, .shopify-payment-button {
  min-height: 48px !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  box-sizing: border-box;
}`}
                    </pre>
                    <button 
                      onClick={() => onUpdateSettings({ tapTargetsFixed: false })}
                      className="text-[9px] font-mono text-slate-500 hover:text-slate-300 underline cursor-pointer"
                    >
                      Revert tap target adjustments
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onUpdateSettings({ tapTargetsFixed: true })}
                    className="w-full bg-emerald-400 hover:bg-emerald-350 text-black text-[10px] uppercase font-black tracking-widest py-2 rounded transition-all cursor-pointer text-center"
                  >
                    Adjust Tap Targets Padding (min-height 48px)
                  </button>
                )}
              </div>

              {/* Bug 4: Hero Layout Image Aspect Ratio Distortion */}
              <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5 space-y-3 bg-slate-800/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-widest bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
                        IMPORTANT FAULT
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono font-bold">FAULT CODE: SHP-M04</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">Hero Layout Image Aspect Ratio Distortion</h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-light">
                      Non-scalable desktop banner backgrounds become completely squished or distorted on vertical mobile device shapes.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded inline-block ${
                      settings.fluidImagesFixed ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                    }`}>
                      {settings.fluidImagesFixed ? "💚 RECTIFIED" : "🔴 UNRESOLVED"}
                    </span>
                  </div>
                </div>

                {settings.fluidImagesFixed ? (
                  <div className="space-y-1.5 text-left border-t border-slate-800/40 pt-2.5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-550">
                      <span>Responsive Object Cover Rules (assets/theme.css):</span>
                      <button 
                        onClick={() => handleCopyCode(`.banner-wrapper {
  position: relative;
  min-height: 55vh !important;
}
.background-parallax, .image-with-text img {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover !important;
  object-position: center !important;
}`, "fluid-fix")}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === "fluid-fix" ? "Copied!" : "Copy code"}</span>
                      </button>
                    </div>
                    <pre className="bg-slate-950 p-2 text-[9px] font-mono text-slate-300 overflow-x-auto rounded border border-slate-900 leading-tight">
{`/* Maintain crisp background dimensions */
.background-parallax, .image-with-text img {
  object-fit: cover !important;
  object-position: center !important;
  height: 100%; width: 100%;
}`}
                    </pre>
                    <button 
                      onClick={() => onUpdateSettings({ fluidImagesFixed: false })}
                      className="text-[9px] font-mono text-slate-500 hover:text-slate-300 underline cursor-pointer"
                    >
                      Revert image-cover fixes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onUpdateSettings({ fluidImagesFixed: true })}
                    className="w-full bg-emerald-400 hover:bg-emerald-350 text-black text-[10px] uppercase font-black tracking-widest py-2 rounded transition-all cursor-pointer text-center"
                  >
                    Inject aspect-ratio object-fit cover
                  </button>
                )}
              </div>

              {/* Bug 5: Speed Performance Lazy Loading */}
              <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5 space-y-3 bg-slate-800/20 max-w-full">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-555/10 rounded text-emerald-400">
                        PERFORMANCE
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono font-bold">FAULT CODE: SHP-M05</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-200">Missing Mobile Lazy-Loading Attributes</h4>
                    <p className="text-[10px] text-slate-400 leading-normal font-light">
                      Non-critical off-screen block media loads over slow bandwidths synchronically, lagging page speed parameters.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded inline-block ${
                      settings.lazyLoadingSecured ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                    }`}>
                      {settings.lazyLoadingSecured ? "💚 RECTIFIED" : "🔴 UNRESOLVED"}
                    </span>
                  </div>
                </div>

                {settings.lazyLoadingSecured ? (
                  <div className="space-y-1.5 text-left border-t border-slate-800/40 pt-2.5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-550">
                      <span>Shopify Liquid Lazy Loading snippet:</span>
                      <button 
                        onClick={() => handleCopyCode(`<img 
  src="{{ block.settings.img | image_url: 'medium' }}" 
  loading="lazy" 
  decoding="async"
  width="{{ block.settings.img.width }}"
  height="{{ block.settings.img.height }}"
  alt="{{ block.hover_title | default: block.settings.title }}"
  class="w-full object-cover" 
/>`, "lazy-fix")}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === "lazy-fix" ? "Copied!" : "Copy code"}</span>
                      </button>
                    </div>
                    <pre className="bg-slate-950 p-2 text-[9px] font-mono text-slate-300 overflow-x-auto rounded border border-slate-900 leading-tight">
{`<img src="..." loading="lazy" decoding="async" />`}
                    </pre>
                    <button 
                      onClick={() => onUpdateSettings({ lazyLoadingSecured: false })}
                      className="text-[9px] font-mono text-slate-500 hover:text-slate-300 underline cursor-pointer"
                    >
                      Revert performance controls
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onUpdateSettings({ lazyLoadingSecured: true })}
                    className="w-full bg-emerald-400 hover:bg-emerald-350 text-black text-[10px] uppercase font-black tracking-widest py-2 rounded transition-all cursor-pointer text-center"
                  >
                    Enforce Image Lazy-Loading & decoding="async"
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
