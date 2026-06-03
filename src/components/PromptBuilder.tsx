import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Settings, 
  CheckSquare, 
  Square, 
  Sliders, 
  Wand2, 
  FileCode, 
  Cpu, 
  Eye, 
  ShieldAlert, 
  Info,
  Package,
  Compass,
  ArrowRight
} from "lucide-react";

export default function PromptBuilder() {
  const [copied, setCopied] = useState(false);
  const [themeName, setThemeName] = useState("Aether");
  const [designStyle, setDesignStyle] = useState<"brutalist" | "editorial" | "cyber" | "organic">("editorial");
  
  // Custom toggles for premium features
  const [features, setFeatures] = useState({
    multiFacetedFilters: true,
    megaMenus: true,
    ajaxCartDrawer: true,
    quickView: true,
    imageZoomAndVideo: true,
    stickyHeader: true,
    accountDashboard: true,
    newsletterCapture: true,
    schemaControls: true,
  });

  // Performance toggles
  const [performanceStandard, setPerformanceStandard] = useState<"ultra" | "standard">("ultra");
  const [accessibilityCompliance, setAccessibilityCompliance] = useState(true);

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const designStyleGuides = {
    brutalist: {
      title: "Impactful Brutalist & Swiss Modern",
      text: "Bold heavyweight typography (Space Grotesk, Syne), stark solid borders, 1px lines, neon fluorescent accents, ultra-high contrast, huge text displays, and strict geometric layouts reminiscent of premium brands like Impact.",
    },
    editorial: {
      title: "Clean Luxury & Editorial Elegance",
      text: "Graceful serif headers paired with light sans-serif body fonts (Playfair Display & Inter), generous whitespace margins, subtle offset drop shadows, soft backgrounds, muted luxury color palettes, and extremely smooth subtle transitions like Copenhagen.",
    },
    cyber: {
      title: "Tech-Forward & Futuristic Cyberpunk",
      text: "Monospaced technical values, deep high-energy neon color glow highlights, grid system lines, active telemetry tags, immersive horizontal scrolling visual rows, and dark dark theme defaults.",
    },
    organic: {
      title: "Warm Minimal & Cozy Lifestyle Commerce",
      text: "Warm cream, linen, oat textured colors, rounded soft layout edges, warm rustic typography, cozy imagery framing, and highly accessible user trust badges.",
    }
  };

  const generatePrompt = () => {
    // Generate the complete premium AI Studio system prompt dynamically
    const selectedFeaturesString = Object.entries(features)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => {
        switch(key) {
          case "multiFacetedFilters": return "   - **Advanced Live Search & Predictive Faceted Filtering**: Zero-lag client-side/Ajax filters that map queries to dynamic collections without page reload, including tag, price-range slider, color-swatch, and stock availability parameters.";
          case "megaMenus": return "   - **Multi-Level Navigation & Interactive Mega Menus**: Complex, dropdown menus containing images, category links, promo cards, and promotional code highlights within the header navigation.";
          case "ajaxCartDrawer": return "   - **Slide-Out Ajax Cart Drawer**: Fast side cart drawer supporting volume quantity counters, progressive shipping progress metrics ('$X away from free delivery'), coupon form field integration, and reactive summary calculations.";
          case "quickView": return "   - **Product Specification Quick View**: Modal overlay containing item specs, variant color or size selector swatches, dynamic quantity counters, and Instant Quick Add controls.";
          case "imageZoomAndVideo": return "   - **Media Showcase with Multi-Image View & Zoom**: Product photo gallery with smooth hover-magnifying zoom indicators, thumbnail selectors, and integrated native HTML5 video player layout wrappers.";
          case "stickyHeader": return "   - **Dynamic Sticky Smart Header & Navigation Row**: Scroll-adaptive header that shrinks or reveals itself smoothly on scroll actions, keeping page interactions directly reachable.";
          case "accountDashboard": return "   - **Premium Customer Account Dashboard & Order Reports**: Clean structural layouts for register/login pages and deep customer portal showing historic orders ledger, shipment tracking states, and lifetime metrics.";
          case "newsletterCapture": return "   - **Subscribers Newsletter & Email Capture**: Clean input collection components styled natively with success/error state configurations compatible with Shopify's default form handlers.";
          case "schemaControls": return "   - **Flexible Theme Configurator (theme.json & Settings schemas)**: Fully robust global settings allowing non-developers to control custom fonts, margins, radii styles, and ambient colors inside the Shopify Customizer.";
          default: return "";
        }
      })
      .filter(Boolean)
      .join("\n");

    const performanceInstructions = performanceStandard === "ultra" 
      ? `3. **CRITICAL PERFORMANCE OPTIMIZATION (Ultra-Fast Lighthouse Stats)**:
   - **Lazy Loading Strategy**: Apply \`loading="lazy"\` and specify semantic \`srcset\` responsive width values for all \`<img>\` elements. Provide low-resolution CSS blur placeholders to avoid layout shifts.
   - **CSS & Variables Core**: Consolidate global styles. Avoid multiple bloated Tailwind imports inside Liquid templates; instead, build standard CSS variables within the \`theme.liquid\` head tag derived from \`settings_schema.json\`.
   - **Zero-Dependency JavaScript**: Avoid heavy external frameworks in premium setups. Rely purely on lightweight Vanilla JS (ES6 class components) or native custom HTML5 Web components (\`<product-drawer>\`, \`<image-zoom>\`) for maximum speed.
   - **Critical CSS Paths**: Inline core structural layouts and header styling direct inside head to bypass render-blocking CSS bottlenecks.`
      : `3. **PERFORMANCE STANDARDS**:
   - Apply native lazy-loading tags to all media cards.
   - Implement basic asset bundling strategies with clean separate asset stylesheet references.`;

    const accessibilitySection = accessibilityCompliance 
      ? `4. **STRICT ACCESSIBILITY COMPLIANCE (WCAG AA Standards)**:
   - Ensure perfect semantic structure: Use valid landmarks including \`<nav>\`, \`<main>\`, \`<header>\`, and \`<section>\`.
   - Every input field must have associated, descriptive \`<label>\` elements or robust \`aria-label\` designations.
   - Focus states (\`:focus-visible\`) must render as bold high-contrast outlines for pristine keyboard navigation.
   - Ensure all image markers declare descriptive fallback \`alt\` tags dynamically.`
      : "";

    return `# SYSTEM ROLE & ARCHITECTURE MANDATE
You are a Staff Shopify Principal Architect, Lead Developer, and Luxury Web Design Designer. Your objective is to formulate a complete, production-ready, ultra-premium Shopify OS 2.0 Theme named "${themeName}" that demonstrates complete feature parity with elite premium themes like Copenhagen and Impact.

The output must be generated as highly optimized, ready-to-run Shopify Liquid and JSON files, avoiding code truncations or lazy placeholders.

---

## 1. INTENTIONAL DESIGN QUALITY (${designStyleGuides[designStyle].title})
The theme must follow these premium aesthetic standards:
- **Design Persona**: ${designStyleGuides[designStyle].text}
- **Typography Sizing**: Set strict scale rules using fluid REM measures. Ensure display headers are tracking-tight with clean custom kerning.
- **Negative Space & Padding**: Apply generous visual breathing space. Vary margins carefully across sections to avoid looking mechanic or predictable.
- **Micro-Animations**: Declare standard cubic-bezier CSS keyframe animations for all standard modals, sliding drawers, swatches, and CTA hover transitions.

---

## 2. ADVANCED FUNCTIONAL FEATURE PARITY
Ensure the theme code contains:
${selectedFeaturesString}

---

${performanceInstructions}

---

${accessibilitySection}

---

## 5. GENERATED FILE DIRECTORY STRUCTURE & THEME PAYLOAD
Generate the Shopify theme containing these exact, finished code files:

### **A. [config/settings_schema.json] - Customizer Config**
Formulate a robust, modern Shopify theme settings config mapping typography selectors, default color palettes, and container border-radius options (\`none\` vs \`md\` vs \`xl\`). Ensure settings look organized so merchants can easily configure options.

### **B. [layout/theme.liquid] - Global Wrapper Document**
Build the master container rendering:
1. Dynamic styling variables injected direct inside the \`<head>\` tag mapped from global Settings variables.
2. Safe layout setups featuring \`{{ content_for_header }}\` and \`{{ content_for_layout }}\`.
3. Native wrappers including announcement headers, mega-menus, sticky navigation, and the dynamic side drawer checkout hook.

### **C. [sections/header.liquid] - Dynamic Multi-Level Mega-Menu Header**
Provide responsive, sticky-toggle Liquid and Javascript template supporting:
1. Flexible nested link list loops mapping shop menus dynamically.
2. Inline card promos matching selected collection categories.
3. Accessible responsive mobile navigation drawer and dynamic items search widget.

### **D. [sections/main-product.liquid] - Production-Ready Product Details Page**
An advanced, multi-block specifications product details panel containing:
1. Two-column visual layout: clean image gallery with zoom Magnifier components on the left; deep interactive variants config on the right.
2. Custom Variant Selector swatches: reactive color dials and size specifications.
3. Interactive Quantity Counter and instant slide-cart trigger.

### **E. [sections/cart-drawer.liquid] - Slide-out Cart Panel template**
Dynamic sidebar overlay that runs asynchronously (Ajax API) to fetch, add, and update cart items without full-page reloads, displaying line item totals, interactive volume buttons, and free delivery meters.

### **F. [templates/index.json] - Frontpage Blueprint**
Configure default layout order utilizing sections created above (header, hero-banner, featured-collection, cart-drawer, footer).

---

## 6. CODING METHODOLOGY & SYSTEM OUTPUT CONSTRAINTS
- **Complete Outputs Only**: Do NOT use code comments like \`/* Insert more code here */\` or \`<!-- Repeat for other blocks -->\`. Generate complete, valid, syntactically perfect Liquid files.
- **Valid Liquid Tags**: Use valid Shopify Liquid tags, filters, and variables. Do not mix with incorrect curly braces or unsupported syntaxes.
- **Embedded Scripts**: Embed associated Vanilla JS scripts directly inside their respective liquid files inside \`<script>\` blocks using \`DOMContentLoaded\` or Custom Web Component models (\`customElements.define()\`) to keep files modular.
`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      {/* Upper header controls */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Cpu className="w-4 h-4 text-slate-950 font-black animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase tracking-widest block">Premium Meta-Prompting</span>
            <h2 className="text-xs font-bold text-white leading-none">Shopify Studio Generator</h2>
          </div>
        </div>
        
        <button
          onClick={handleCopyPrompt}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase font-black transition-all ${
            copied ? "bg-emerald-500 text-slate-950" : "bg-[#D1FF26] text-black hover:bg-opacity-90 cursor-pointer"
          }`}
          style={{ borderRadius: "4px" }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Meta-Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Grid workspace Split panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
        
        {/* Left Side: Option variables controls */}
        <div className="lg:col-span-4 p-5 overflow-y-auto space-y-6 custom-scroll border-r border-slate-800 bg-slate-950/60 text-left">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Configure System Parameters</span>
            </h3>
            <p className="text-[10px] text-slate-400 leading-normal">
              Adjust settings in real-time to enrich your generated prompt template for Google AI Studio.
            </p>
          </div>

          {/* Theme specifications input */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Theme Archetype Name</label>
            <input 
              type="text" 
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="e.g. Aether, Horizon"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* Design Style Pickers */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Design Style & Persona</label>
            <div className="grid grid-cols-2 gap-2">
              {(["editorial", "brutalist", "cyber", "organic"] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setDesignStyle(style)}
                  className={`p-2.5 text-left rounded-lg border transition-all ${
                    designStyle === style 
                      ? "border-amber-450 bg-amber-500/10 text-amber-300 font-black" 
                      : "border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase block capitalize mb-0.5">{style}</span>
                  <p className="text-[8px] text-slate-500 line-clamp-2 leading-tight">
                    {designStyleGuides[style].title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Feature checks */}
          <div className="space-y-3 pt-3 border-t border-slate-850">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Required Premium Features</label>
            <div className="space-y-2.5">
              {Object.entries(features).map(([key, enabled]) => {
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, str => str.toUpperCase());

                return (
                  <button
                    key={key}
                    onClick={() => toggleFeature(key as keyof typeof features)}
                    className="flex items-center gap-2.5 w-full text-left cursor-pointer group"
                  >
                    {enabled ? (
                      <CheckSquare className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                    ) : (
                      <Square className="w-4.5 h-4.5 text-slate-700 group-hover:text-slate-500 shrink-0" />
                    )}
                    <span className={`text-[11px] font-semibold transition-colors ${enabled ? "text-slate-200" : "text-slate-500"}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Performance Standards */}
          <div className="space-y-3 pt-4 border-t border-slate-850 text-left">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Performance standard</label>
            <div className="flex bg-[#0d0d0d] p-0.5 border border-slate-800 rounded-lg">
              <button
                onClick={() => setPerformanceStandard("ultra")}
                className={`flex-1 text-center py-2 text-[10px] uppercase font-black tracking-wider transition-all rounded-md ${
                  performanceStandard === "ultra" ? "bg-amber-500 text-black" : "text-slate-500 hover:text-slate-350"
                }`}
              >
                Ultra Lighthouse Optimization
              </button>
              <button
                onClick={() => setPerformanceStandard("standard")}
                className={`flex-1 text-center py-2 text-[10px] uppercase font-black tracking-wider transition-all rounded-md ${
                  performanceStandard === "standard" ? "bg-amber-500 text-black" : "text-slate-500 hover:text-slate-350"
                }`}
              >
                Standard Guidelines
              </button>
            </div>
          </div>

          {/* Accessibility checker */}
          <div className="pt-3 border-t border-slate-850">
            <button
              onClick={() => setAccessibilityCompliance(!accessibilityCompliance)}
              className="flex items-center gap-2.5 w-full text-left cursor-pointer group"
            >
              {accessibilityCompliance ? (
                <CheckSquare className="w-4.5 h-4.5 text-amber-500" />
              ) : (
                <Square className="w-4.5 h-4.5 text-slate-700 group-hover:text-slate-500" />
              )}
              <div className="text-left leading-none">
                <span className={`text-[11px] font-semibold block ${accessibilityCompliance ? "text-slate-200" : "text-slate-500"}`}>
                  Strict WCAG 2.1 AA Compliance
                </span>
                <span className="text-[9px] text-zinc-500 mt-0.5 block">Includes semantic HTML5 tags & aria landmarks</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Side: Real-time Live Compiled prompt preview */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-[#0A0A0A]">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Studio Prompt Document (Dynamic compilation)
              </span>
            </div>
            
            <span className="text-[9px] font-mono text-zinc-500">
              {generatePrompt().split("\n").length} lines • {generatePrompt().length} chars
            </span>
          </div>

          {/* Dynamic document view */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scroll text-left font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap select-text selection:bg-amber-500 selection:text-black">
            <div className="max-w-4xl mx-auto space-y-4">
              {generatePrompt()}
            </div>
          </div>
          
          {/* Quick interactive suggestion helper footer */}
          <div className="p-4 bg-slate-950 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
            <div className="flex items-center gap-2.5 text-zinc-400">
              <Info className="w-4.5 h-4.5 text-amber-500 shrink-0" />
              <p className="text-[10px] leading-normal font-sans">
                Paste this generated document straight into the <strong className="text-white">System Instructions</strong> or <strong className="text-white">Chat Prompt</strong> workspace inside Google AI Studio. It will output clean, compiled Liquid files instantly!
              </p>
            </div>
            <button
              onClick={handleCopyPrompt}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] font-mono uppercase tracking-widest shrink-0 transition-colors cursor-pointer"
              style={{ borderRadius: "4px" }}
            >
              {copied ? "Prompt Copied!" : "Copy Raw Document"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
