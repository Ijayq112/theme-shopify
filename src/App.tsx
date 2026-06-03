import React, { useState } from "react";
import { ThemeSettings, ThemeSection, CartItem } from "./types";
import ThemeCustomizer from "./components/ThemeCustomizer";
import PreviewStore from "./components/PreviewStore";
import AICompanion from "./components/AICompanion";
import CodeExporter from "./components/CodeExporter";
import PromptBuilder from "./components/PromptBuilder";
import { 
  Sparkles, 
  Terminal, 
  Sliders,
  Cpu
} from "lucide-react";

// Standard preset builder to quickly spawn sections locally
function buildPresetSection(type: string): ThemeSection {
  const timestamp = Date.now();
  switch (type) {
    case "main-product":
      return {
        sectionId: `main-product-${timestamp}`,
        type: "main-product",
        title: "Main Product Detail",
        visuals: {
          layout: "flex-col",
          heading: "PRODUCT REQUISITES",
          subheading: "A highly engineered garment detailed with structural seam wraps, heavy gauge hardware, and organic movement patterns."
        },
        liquidCode: `<!-- core section: main product details -->`,
        schema: {},
        page: "product"
      };

    case "main-collection":
      return {
        sectionId: `main-collection-${timestamp}`,
        type: "main-collection",
        title: "Collections Product Grid",
        visuals: {
          layout: "grid-3-cols",
          heading: "BRUTALIST ARCHIVES",
          subheading: "Curated collections engineered for extreme climate transitions and urban configurations."
        },
        liquidCode: `<!-- core section: collection grid -->`,
        schema: {},
        page: "collection"
      };

    case "main-cart":
      return {
        sectionId: `main-cart-${timestamp}`,
        type: "main-cart",
        title: "Shopping Cart Details",
        visuals: {
          layout: "flex-col",
          heading: "SHOPPING LEDGER",
          subheading: "Complete your transaction order under secure digital processing guidelines."
        },
        liquidCode: `<!-- core section: shopping cart -->`,
        schema: {},
        page: "cart"
      };

    case "hero-banner":
      return {
        sectionId: `hero-banner-${timestamp}`,
        type: "hero-banner",
        title: "Pure Canvas Hero",
        visuals: {
          layout: "flex-col",
          heading: "PURE CANVAS",
          subheading: "A collection exploring the intersection of brutalist architecture and organic textile movement.",
          ctaText: "Explore Collection",
          backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
          backgroundColor: "#0A0A0A"
        },
        liquidCode: `<!-- Shopify Section: Pure Canvas Hero -->
<section class="banner-wrapper relative text-white py-24 px-12 md:py-32" style="background-color: {{ section.settings.bg_color | default: '#0A0A0A' }}">
  <div class="background-parallax absolute inset-0 opacity-40 bg-cover bg-center" style="background-image: url('{{ section.settings.bg_image | image_url: 'large' }}')"></div>
  <div class="relative z-10 max-w-4xl mx-auto text-left space-y-6">
    <p class="text-[#D1FF26] text-sm font-bold uppercase tracking-[0.4em]">Spring Summer 2024</p>
    <h1 class="text-6xl md:text-[120px] leading-[0.85] font-black tracking-tighter uppercase font-sans">
      {{ section.settings.heading | default: 'PURE CANVAS' }}
    </h1>
    <p class="text-lg md:text-xl text-gray-400 font-light italic leading-relaxed max-w-xl">
      {{ section.settings.lead_text | default: 'A collection exploring the intersection of brutalist architecture and organic textile movement.' }}
    </p>
    {% if section.settings.cta_text != blank %}
      <a href="/catalog" class="inline-flex items-center gap-4 border border-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
        {{ section.settings.cta_text }} <span>→</span>
      </a>
    {% endif %}
  </div>
</section>

{% schema %}
{
  "name": "Pure Canvas Hero",
  "settings": [
    { "type": "text", "id": "heading", "label": "Main Header", "default": "PURE CANVAS" },
    { "type": "textarea", "id": "lead_text", "label": "Supporting Description" },
    { "type": "image_picker", "id": "bg_image", "label": "Banner Backdrop" },
    { "type": "text", "id": "cta_text", "label": "Action Button Label", "default": "Explore Collection" }
  ]
}
{% endschema %}`,
        schema: {}
      };

    case "featured-collection":
      return {
        sectionId: `featured-collection-${timestamp}`,
        type: "featured-collection",
        title: "Curated Essentials List",
        visuals: {
          layout: "grid-3-cols",
          heading: "CURATED ESSENTIALS",
          subheading: "A focused range engineered with custom systems and minimal design language.",
          blocks: [
            { title: "Oversized Mac", price: "$420.00", tag: "Available", imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600" },
            { title: "Ribbed Knit Beanie", price: "$85.00", tag: "Midnight black", imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d435350?w=600" },
            { title: "Brutalist Chelsea Boots", price: "$340.00", tag: "Collection 01", imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600" }
          ]
        },
        liquidCode: `<!-- Shopify Section: Curated Essentials List -->
<div class="shopify-section-featured-collection text-left py-16 px-12" style="background-color: {{ section.settings.bg_color | default: '#111111' }}">
  <div class="max-w-7xl mx-auto">
    <h2 class="text-4xl font-extrabold tracking-tighter uppercase mb-2">{{ section.settings.heading | default: 'CURATED ESSENTIALS' }}</h2>
    <p class="text-sm text-gray-400 max-w-sm mb-12">{{ section.settings.caption | default: 'A focused range engineered with custom systems.' }}</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {% for block in section.blocks %}
        <div class="card border border-white/10 rounded-none overflow-hidden bg-[#0A0A0A] hover:border-white/25 transition-colors flex flex-col justify-between p-6">
          <div class="flex justify-between items-start mb-6">
            <img src="{{ block.settings.img | image_url: 'medium' }}" class="w-32 h-44 object-cover rotate-2" />
            <div class="text-right">
              <span class="block text-xs font-bold text-[#D1FF26] uppercase mb-1">{{ block.settings.tag }}</span>
              <h4 class="text-lg font-bold uppercase">{{ block.settings.title }}</h4>
              <span class="text-sm font-mono text-gray-400">{{ block.settings.price }}</span>
            </div>
          </div>
          <button class="w-full bg-[#D1FF26] text-black font-black uppercase py-3 text-xs tracking-widest hover:opacity-90">
            Quick Add to Cart
          </button>
        </div>
      {% endfor %}
    </div>
  </div>
</div>

{% schema %}
{
  "name": "Curated Essentials List",
  "settings": [
    { "type": "text", "id": "heading", "label": "Main Header", "default": "CURATED ESSENTIALS" },
    { "type": "text", "id": "caption", "label": "Supporting Description" }
  ],
  "blocks": [
    { "type": "product_item", "name": "Item Card" }
  ]
}
{% endschema %}`,
        schema: {}
      };

    case "image-with-text":
      return {
        sectionId: `image-with-text-${timestamp}`,
        type: "image-with-text",
        title: "Tactile Story Highlights",
        visuals: {
          layout: "grid-2-cols",
          heading: "ORGANIC MOVEMENT",
          subheading: "Every single component, thread, or accessory aligns seamlessly with architectural designs. We optimize our assets dynamically to fit any medium flawlessly.",
          ctaText: "Trace Our Craft",
          backgroundImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200"
        },
        liquidCode: `<!-- Shopify Section: Tactile Story Highlights -->
<div class="image-with-text py-16 px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-white" style="background-color: {{ section.settings.bg_color | default: '#0A0A0A' }}">
  <div>
    <img src="{{ section.settings.image | image_url: 'large' }}" class="rounded-none border border-white/10 object-cover w-full aspect-[4/3] -rotate-1" />
  </div>
  <div class="space-y-6 text-left">
    <h2 class="text-4xl font-black uppercase tracking-tighter">{{ section.settings.heading | default: 'ORGANIC MOVEMENT' }}</h2>
    <p class="text-sm text-gray-400 leading-relaxed font-light italic">{{ section.settings.story }}</p>
    {% if section.settings.button_text != blank %}
      <a href="#" class="inline-flex items-center gap-4 border border-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
        {{ section.settings.button_text }} <span>→</span>
      </a>
    {% endif %}
  </div>
</div>

{% schema %}
{
  "name": "Tactile Story Highlights",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Story Illustration" },
    { "type": "text", "id": "heading", "label": "Header", "default": "ORGANIC MOVEMENT" },
    { "type": "textarea", "id": "story", "label": "Narrative text" },
    { "type": "text", "id": "button_text", "label": "Button Label" }
  ]
}
{% endschema %}`,
        schema: {}
      };

    case "newsletter":
    default:
      return {
        sectionId: `newsletter-${timestamp}`,
        type: "newsletter",
        title: "Drops Membership Row",
        visuals: {
          layout: "flex-col",
          heading: "JOIN THE ARCHIVE",
          subheading: "Configure premium drops schedules. Take benefit from direct subscriber discounts.",
          backgroundColor: "#111111"
        },
        liquidCode: `<!-- Shopify Section: Drops Membership Row -->
<div class="newsletter-highlight p-12 text-center text-white" style="background-color: {{ section.settings.row_bg | default: '#111111' }}">
  <div class="max-w-2xl mx-auto space-y-6">
    <h2 class="text-4xl font-black uppercase tracking-tighter">{{ section.settings.title | default: 'JOIN THE ARCHIVE' }}</h2>
    <p class="text-xs text-gray-400 leading-relaxed uppercase tracking-widest max-w-md mx-auto">{{ section.settings.caption | default: 'Configure premium drops schedules.' }}</p>
    
    <form action="/contact" method="post" class="flex gap-0 max-w-md mx-auto p-0 bg-[#0A0A0A] border border-white/10 rounded-none">
      <input type="email" placeholder="YOUR EMAIL ADDRESS" class="flex-1 text-xs p-4 bg-transparent text-white focus:outline-none placeholder-gray-500 font-mono" />
      <button class="bg-[#D1FF26] text-black text-xs font-black uppercase px-6 hover:bg-[#D1FF26]/85">SUBSCRIBE</button>
    </form>
  </div>
</div>

{% schema %}
{
  "name": "Drops Membership Row",
  "settings": [
    { "type": "text", "id": "title", "label": "Heading", "default": "JOIN THE ARCHIVE" },
    { "type": "text", "id": "caption", "label": "Instructional caption" },
    { "type": "color", "id": "row_bg", "label": "Row Background", "default": "#111111" }
  ]
}
{% endschema %}`,
        schema: {}
      };
  }
}

export default function App() {
  const [settings, setSettings] = useState<ThemeSettings>({
    primaryColor: "#FFFFFF",
    secondaryColor: "#D1FF26",
    bgColor: "#0A0A0A",
    textColor: "#A3A3A3",
    accentColor: "#D1FF26",
    fontFamily: "Space Grotesk",
    fontSizeBase: "base",
    borderRadius: "none",
    spacingTightness: "comfy",
    logoText: "NOVA.STORE",
    mobileMenuFixed: true,
    horizontalScrollFixed: true,
    tapTargetsFixed: true,
    lazyLoadingSecured: true,
    fluidImagesFixed: true
  });

  // Load baseline templates so sandbox is visually pristine
  const [sections, setSections] = useState<ThemeSection[]>([
    { ...buildPresetSection("hero-banner"), page: "home" },
    { ...buildPresetSection("featured-collection"), page: "home" },
    { ...buildPresetSection("image-with-text"), page: "home" },
    { ...buildPresetSection("newsletter"), page: "home" },

    { ...buildPresetSection("main-product"), page: "product" },
    { ...buildPresetSection("image-with-text"), sectionId: "prod-spec-story", title: "Premium Fabric Story", page: "product" },
    { ...buildPresetSection("newsletter"), sectionId: "prod-spec-news", page: "product" },

    { ...buildPresetSection("main-collection"), page: "collection" },
    { ...buildPresetSection("newsletter"), sectionId: "coll-news", page: "collection" },

    { ...buildPresetSection("main-cart"), page: "cart" }
  ]);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>("hero-banner-" + Date.now()); // Fallback placeholder
  const [activePage, setActivePage] = useState<"home" | "product" | "collection" | "cart">("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // High-level workspace perspective tabs selector
  const [perspective, setPerspective] = useState<"visual" | "ai" | "code" | "prompt-generator">("visual");
  const [mobileTab, setMobileTab] = useState<"preview" | "editor">("preview");

  const handleUpdateSettings = (updates: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleAddPreset = (type: string) => {
    const newSec = { ...buildPresetSection(type), page: activePage };
    setSections(prev => [...prev, newSec]);
    setSelectedSectionId(newSec.sectionId);
  };

  const handleAddAiSection = (newSec: ThemeSection) => {
    const secWithPage = { ...newSec, page: activePage };
    setSections(prev => {
      const activeSecs = prev.filter(s => (s.page || "home") === activePage);
      const otherSecs = prev.filter(s => (s.page || "home") !== activePage);
      const updatedActive = [...activeSecs];
      updatedActive.splice(Math.min(1, updatedActive.length), 0, secWithPage);
      return [...otherSecs, ...updatedActive];
    });
    setSelectedSectionId(newSec.sectionId);
    setPerspective("visual"); // Automatically switch back to sandbox preview to let them see it live!
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0A0A0A] font-sans antialiased text-white select-none">
      
      {/* Workspace Perspective switcher top control bar */}
      <header className="bg-[#0A0A0A] border-b border-zinc-800 px-6 py-4 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-30 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-[#D1FF26] flex items-center justify-center text-black font-black">
            <Sliders className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-white leading-none">Shopify Theme Architect</h1>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1 block">AI LIQUID ENGINE & SANDBOX</span>
          </div>
        </div>

        {/* Dashboard Perspectives switch */}
        <div className="flex bg-[#121212] p-1 rounded-none border border-zinc-800 font-mono text-[11px]">
          <button
            onClick={() => setPerspective("visual")}
            className={`flex items-center gap-2 py-2 px-5 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer ${
              perspective === "visual" 
                ? "bg-[#D1FF26] text-black font-black border border-transparent" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Theme Controls</span>
          </button>
          
          <button
            onClick={() => setPerspective("ai")}
            className={`flex items-center gap-2 py-2 px-5 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer ${
              perspective === "ai" 
                ? "bg-[#D1FF26] text-black font-black border border-transparent" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Studio</span>
          </button>

          <button
            onClick={() => setPerspective("prompt-generator")}
            className={`flex items-center gap-2 py-2 px-5 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer ${
              perspective === "prompt-generator" 
                ? "bg-[#D1FF26] text-black font-black border border-transparent" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Studio Prompt</span>
          </button>

          <button
            onClick={() => setPerspective("code")}
            className={`flex items-center gap-2 py-2 px-5 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer ${
              perspective === "code" 
                ? "bg-[#D1FF26] text-black font-black border border-transparent" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Code</span>
          </button>
        </div>

        {/* Support Meta Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-[#121212] px-3 py-2 rounded-none border border-zinc-800 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D1FF26] animate-pulse"></span>
          <span>Liquid 2.0 Engine</span>
        </div>
      </header>

      {/* Mobile Workspace Tabs Switcher (Visible on small screens only) */}
      {(perspective === "visual" || perspective === "ai") && (
        <div className="md:hidden flex bg-[#0A0A0A] border-b border-zinc-800 p-1 font-mono text-[11px] shrink-0">
          <button 
            id="mobile-tab-editor-selector"
            onClick={() => setMobileTab("editor")}
            className={`flex-1 py-3 text-center font-bold uppercase tracking-widest transition-all cursor-pointer ${
              mobileTab === "editor" 
                ? "bg-[#D1FF26] text-black font-black" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/45"
            }`}
          >
            Adjust Theme Settings
          </button>
          <button 
            id="mobile-tab-preview-selector"
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-3 text-center font-bold uppercase tracking-widest transition-all cursor-pointer ${
              mobileTab === "preview" 
                ? "bg-[#D1FF26] text-black font-black" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/45"
            }`}
          >
            Preview Storefront
          </button>
        </div>
      )}

      {/* Main workspace arena split by layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[#0A0A0A]">
        
        {/* Visual Sidebar selection layout */}
        {perspective === "visual" && (
          <div className={`md:col-span-3 h-full overflow-hidden ${mobileTab === "editor" ? "block" : "hidden md:block"}`}>
            <ThemeCustomizer 
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              sections={sections}
              onUpdateSections={setSections}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              onAddPreset={handleAddPreset}
              activePage={activePage}
            />
          </div>
        )}

        {perspective === "ai" && (
          <div className={`md:col-span-3 h-full overflow-hidden ${mobileTab === "editor" ? "block" : "hidden md:block"}`}>
            <AICompanion 
              settings={settings}
              onAddSection={handleAddAiSection}
              activePage={activePage}
            />
          </div>
        )}

        {perspective === "prompt-generator" && (
          <div className="md:col-span-12 h-full overflow-hidden">
            <PromptBuilder />
          </div>
        )}

        {perspective === "code" && (
          <div className="md:col-span-12 h-full overflow-hidden">
            <CodeExporter 
              settings={settings}
              sections={sections}
              selectedSectionId={selectedSectionId}
            />
          </div>
        )}

        {/* Core Live Storefront Screen Frame (Col-span 9 if Customizer mode or AI companion mode) */}
        {perspective !== "code" && perspective !== "prompt-generator" && (
          <div className={`md:col-span-9 h-full flex flex-col overflow-hidden bg-slate-950 ${mobileTab === "preview" ? "block" : "hidden md:block"}`}>
            <PreviewStore 
              settings={settings}
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
              activePage={activePage}
              onChangePage={setActivePage}
              cart={cart}
              onUpdateCart={setCart}
            />
          </div>
        )}

      </div>
    </div>
  );
}
