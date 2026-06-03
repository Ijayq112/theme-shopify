import React, { useState } from "react";
import { ThemeSettings, ThemeSection } from "../types";
import { 
  FileCode, 
  Terminal, 
  Copy, 
  Check, 
  FileDown, 
  FolderOpen, 
  ChevronDown, 
  Info,
  ExternalLink,
  Archive,
  ShieldCheck
} from "lucide-react";
import JSZip from "jszip";
import UploadGuard from "./UploadGuard";

interface CodeExporterProps {
  settings: ThemeSettings;
  sections: ThemeSection[];
  selectedSectionId: string | null;
}

export default function CodeExporter({
  settings,
  sections,
  selectedSectionId,
}: CodeExporterProps) {
  const [selectedFile, setSelectedFile] = useState<string>("layout/theme.liquid");
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<"code" | "guard">("code");

  const getBorderRadiusValue = () => {
    switch (settings.borderRadius) {
      case "none": return "0px";
      case "md": return "8px";
      case "xl": return "16px";
      case "full": return "9999px";
      default: return "4px";
    }
  };

  const currentSection = sections.find(s => s.sectionId === selectedSectionId) || sections[0];

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerDownload = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Define files for the full theme package
  const filesList = [
    // layouts
    { name: "theme.liquid", path: "layout/theme.liquid", dir: "layout" },
    { name: "password.liquid", path: "layout/password.liquid", dir: "layout" },
    { name: "gift_card.liquid", path: "layout/gift_card.liquid", dir: "layout" },

    // templates
    { name: "index.json", path: "templates/index.json", dir: "templates" },
    { name: "product.json", path: "templates/product.json", dir: "templates" },
    { name: "collection.json", path: "templates/collection.json", dir: "templates" },
    { name: "list-collections.json", path: "templates/list-collections.json", dir: "templates" },
    { name: "cart.json", path: "templates/cart.json", dir: "templates" },
    { name: "blog.json", path: "templates/blog.json", dir: "templates" },
    { name: "article.json", path: "templates/article.json", dir: "templates" },
    { name: "page.json", path: "templates/page.json", dir: "templates" },
    { name: "search.json", path: "templates/search.json", dir: "templates" },
    { name: "404.json", path: "templates/404.json", dir: "templates" },
    { name: "gift_card.json", path: "templates/gift_card.json", dir: "templates" },
    { name: "password.json", path: "templates/password.json", dir: "templates" },

    // customers templates
    { name: "account.liquid", path: "templates/customers/account.liquid", dir: "templates/customers" },
    { name: "activate_account.liquid", path: "templates/customers/activate_account.liquid", dir: "templates/customers" },
    { name: "addresses.liquid", path: "templates/customers/addresses.liquid", dir: "templates/customers" },
    { name: "login.liquid", path: "templates/customers/login.liquid", dir: "templates/customers" },
    { name: "order.liquid", path: "templates/customers/order.liquid", dir: "templates/customers" },
    { name: "register.liquid", path: "templates/customers/register.liquid", dir: "templates/customers" },
    { name: "reset_password.liquid", path: "templates/customers/reset_password.liquid", dir: "templates/customers" },

    // sections
    { name: "header-group.json", path: "sections/header-group.json", dir: "sections" },
    { name: "footer-group.json", path: "sections/footer-group.json", dir: "sections" },
    { name: "overlay-group.json", path: "sections/overlay-group.json", dir: "sections" },
    { name: "announcement-bar.liquid", path: "sections/announcement-bar.liquid", dir: "sections" },
    { name: "main-header.liquid", path: "sections/main-header.liquid", dir: "sections" },
    { name: "main-footer.liquid", path: "sections/main-footer.liquid", dir: "sections" },
    { name: "slideshow.liquid", path: "sections/slideshow.liquid", dir: "sections" },
    { name: "image-with-text.liquid", path: "sections/image-with-text.liquid", dir: "sections" },
    { name: "scrolling-text.liquid", path: "sections/scrolling-text.liquid", dir: "sections" },
    { name: "video.liquid", path: "sections/video.liquid", dir: "sections" },
    { name: "grid-with-text.liquid", path: "sections/grid-with-text.liquid", dir: "sections" },
    { name: "multi-column.liquid", path: "sections/multi-column.liquid", dir: "sections" },
    { name: "main-product.liquid", path: "sections/main-product.liquid", dir: "sections" },
    { name: "main-collection.liquid", path: "sections/main-collection.liquid", dir: "sections" },
    { name: "featured-product.liquid", path: "sections/featured-product.liquid", dir: "sections" },
    { name: "featured-collection.liquid", path: "sections/featured-collection.liquid", dir: "sections" },
    { name: "collection-list.liquid", path: "sections/collection-list.liquid", dir: "sections" },
    { name: "complementary-products.liquid", path: "sections/complementary-products.liquid", dir: "sections" },
    { name: "product-recommendations.liquid", path: "sections/product-recommendations.liquid", dir: "sections" },
    { name: "recently-viewed-products.liquid", path: "sections/recently-viewed-products.liquid", dir: "sections" },
    { name: "testimonials.liquid", path: "sections/testimonials.liquid", dir: "sections" },
    { name: "press-logos.liquid", path: "sections/press-logos.liquid", dir: "sections" },
    { name: "timeline.liquid", path: "sections/timeline.liquid", dir: "sections" },
    { name: "accordion.liquid", path: "sections/accordion.liquid", dir: "sections" },
    { name: "blog-posts.liquid", path: "sections/blog-posts.liquid", dir: "sections" },
    { name: "main-cart.liquid", path: "sections/main-cart.liquid", dir: "sections" },
    { name: "cart-drawer.liquid", path: "sections/cart-drawer.liquid", dir: "sections" },

    // snippets
    { name: "product-card.liquid", path: "snippets/product-card.liquid", dir: "snippets" },
    { name: "breadcrumbs.liquid", path: "snippets/breadcrumbs.liquid", dir: "snippets" },
    { name: "icon.liquid", path: "snippets/icon.liquid", dir: "snippets" },
    { name: "pagination.liquid", path: "snippets/pagination.liquid", dir: "snippets" },
    { name: "social-media.liquid", path: "snippets/social-media.liquid", dir: "snippets" },
    { name: "css-variables.liquid", path: "snippets/css-variables.liquid", dir: "snippets" },
    { name: "line-item.liquid", path: "snippets/line-item.liquid", dir: "snippets" },
    { name: "price.liquid", path: "snippets/price.liquid", dir: "snippets" },

    // assets
    { name: "theme.css", path: "assets/theme.css", dir: "assets" },
    { name: "theme.js", path: "assets/theme.js", dir: "assets" },
    { name: "vendor.js", path: "assets/vendor.js", dir: "assets" },
    { name: "product.js", path: "assets/product.js", dir: "assets" },
    { name: "facets.js", path: "assets/facets.js", dir: "assets" },

    // config
    { name: "settings_schema.json", path: "config/settings_schema.json", dir: "config" },
    { name: "settings_data.json", path: "config/settings_data.json", dir: "config" },

    // locales
    { name: "en.default.json", path: "locales/en.default.json", dir: "locales" },
    { name: "es.json", path: "locales/es.json", dir: "locales" },
    { name: "fr.json", path: "locales/fr.json", dir: "locales" },
    { name: "de.json", path: "locales/de.json", dir: "locales" },

    // root-only metadata config
    { name: "theme.toml", path: "theme.toml", dir: "root" },
    { name: "INSTALLATION.md", path: "root/INSTALLATION.md", dir: "root" }
  ];

  // Dynamic Liquid & JSON File Content generators
  const getFileContent = (path: string): string => {
    switch (path) {
      case "layout/theme.liquid":
        return `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="canonical" href="{{ canonical_url }}">
    <title>{{ page_title }} - ${settings.logoText}</title>

    {{ content_for_header }}
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

    {{ 'theme.css' | asset_url | stylesheet_tag }}
    
    <style>
      :root {
        --color-primary: ${settings.primaryColor};
        --color-accent: ${settings.accentColor};
        --color-bg: ${settings.bgColor};
        --color-text: ${settings.textColor};
        --color-border: ${settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"};
        --font-base: "${settings.fontFamily}", sans-serif;
        --border-radius: ${getBorderRadiusValue()};
        --transition-smooth: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        
        /* State Diagnostics Settings Sync */
        --theme-mobile-menu-fixed: {% if settings.mobile_menu_fixed %}1{% else %}0{% endif %};
        --theme-horizontal-scroll-fixed: {% if settings.horizontal_scroll_fixed %}1{% else %}0{% endif %};
        --theme-tap-targets-fixed: {% if settings.tap_targets_fixed %}1{% else %}0{% endif %};
        --theme-fluid-images-fixed: {% if settings.fluid_images_fixed %}1{% else %}0{% endif %};
        --theme-lazy-loading-secured: {% if settings.lazy_loading_secured %}1{% else %}0{% endif %};
      }

      /* Apply horizontal page scroll-overflow prevention */
      {% if settings.horizontal_scroll_fixed == true or settings.horizontal_scroll_fixed == nil %}
      html, body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
        position: relative;
      }
      {% endif %}

      /* Mobile menu click drawer enhancements */
      {% if settings.mobile_menu_fixed == true or settings.mobile_menu_fixed == nil %}
      .site-header {
        position: sticky !important;
        z-index: 100;
      }
      {% endif %}

      /* Accessibility touch target size padding enforcement */
      {% if settings.tap_targets_fixed == true or settings.tap_targets_fixed == nil %}
      button, .cta-button, .add-to-cart-btn, .quick-add-trigger, .nav-item a, .swatch-btn, .thumbnail-btn {
        min-height: 48px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
      }
      {% endif %}

      /* Fluid images aspect ratio layout */
      {% if settings.fluid_images_fixed == true or settings.fluid_images_fixed == nil %}
      .product-card img, .product-featured-media img, .mock-card img, .image-with-text img {
        object-fit: cover !important;
      }
      {% endif %}
    </style>
  </head>
  <body class="custom-scroll">
    {% sections 'header-group' %}

    <main id="MainContent" role="main" class="content-for-layout focus-none" tabindex="-1">
      {{ content_for_layout }}
    </main>

    {% sections 'footer-group' %}

    {{ 'theme.js' | asset_url | script_tag }}
  </body>
</html>`;

      case "layout/password.liquid":
        return `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ shop.name }} - Password Protected</title>
    {{ content_for_header }}
    {{ 'theme.css' | asset_url | stylesheet_tag }}
  </head>
  <body class="password-layout">
    <main id="MainContent" class="content-for-layout">
      {{ content_for_layout }}
    </main>
  </body>
</html>`;

      case "layout/gift_card.liquid":
        return `<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ 'general.gift_card.title' | t }}</title>
    {{ content_for_header }}
    {{ 'theme.css' | asset_url | stylesheet_tag }}
  </head>
  <body class="gift-card-layout">
    <main id="MainContent" class="content-for-layout">
      {{ content_for_layout }}
    </main>
  </body>
</html>`;

      case "templates/index.json":
        return JSON.stringify({
          name: "Index",
          sections: {
            "hero": { "type": "slideshow", "settings": { "title": "COLLECTION ARCHIVE v.12" } },
            "scrolling": { "type": "scrolling-text", "settings": {} },
            "featured": { "type": "featured-collection", "settings": { "limit": 4 } },
            "video": { "type": "video", "settings": {} },
            "gridtext": { "type": "grid-with-text", "settings": {} },
            "brandlist": { "type": "collection-list", "settings": {} },
            "faq": { "type": "accordion", "settings": {} },
            "cta": { "type": "call-to-action", "settings": {} }
          },
          order: ["hero", "scrolling", "featured", "video", "gridtext", "brandlist", "faq", "cta"]
        }, null, 2);

      case "templates/product.json":
        return JSON.stringify({
          name: "Product Page",
          sections: {
            "main": {
              "type": "main-product",
              "settings": {}
            },
            "recommendations": {
              "type": "product-recommendations",
              "settings": {}
            },
            "recent": {
              "type": "recently-viewed-products",
              "settings": {}
            }
          },
          order: ["main", "recommendations", "recent"]
        }, null, 2);

      case "templates/collection.json":
        return JSON.stringify({
          name: "Collection",
          sections: {
            "main": {
              "type": "main-collection",
              "settings": {
                "products_per_row": 3,
                "enable_sidebar_filter": true
              }
            }
          },
          order: ["main"]
        }, null, 2);

      case "templates/list-collections.json":
        return JSON.stringify({
          name: "Collections",
          sections: {
            "main": { "type": "collection-list", "settings": {} }
          },
          order: ["main"]
        }, null, 2);

      case "templates/cart.json":
        return JSON.stringify({
          name: "Cart",
          sections: {
            "main": { "type": "main-cart", "settings": {} }
          },
          order: ["main"]
        }, null, 2);

      case "templates/blog.json":
        return JSON.stringify({
          name: "Blog Feed",
          sections: {
            "main": { "type": "blog-posts", "settings": {} }
          },
          order: ["main"]
        }, null, 2);

      case "templates/article.json":
        return JSON.stringify({
          name: "Article Detail",
          sections: {
            "main": { "type": "image-with-text", "settings": { "heading": "CHRONICLED DISPATCH" } }
          },
          order: ["main"]
        }, null, 2);

      case "templates/page.json":
        return JSON.stringify({
          name: "Page Schema",
          sections: {
            "main": { "type": "image-with-text", "settings": { "heading": "LEDGER MATRIX SECTION" } }
          },
          order: ["main"]
        }, null, 2);

      case "templates/search.json":
        return JSON.stringify({
          name: "Search Query Results",
          sections: {
            "main": { "type": "main-collection", "settings": {} }
          },
          order: ["main"]
        }, null, 2);

      case "templates/404.json":
        return JSON.stringify({
          name: "404 Error",
          sections: {
            "main": { "type": "image-with-text", "settings": { "heading": "404 ERROR: PHYSICAL PAGE NOT CONNECTED" } }
          },
          order: ["main"]
        }, null, 2);

      case "templates/gift_card.json":
        return JSON.stringify({
          name: "Gift Card Layout",
          sections: {
            "main": { "type": "call-to-action", "settings": {} }
          },
          order: ["main"]
        }, null, 2);

      case "templates/password.json":
        return JSON.stringify({
          name: "Password Protective",
          sections: {
            "main": { "type": "call-to-action", "settings": {} }
          },
          order: ["main"]
        }, null, 2);

      case "templates/customers/account.liquid":
        return `<div class="customer-account-container max-width-wrapper py-12">
  <h2 class="font-sans tracking-tight">Archival Client Register Dashboard</h2>
  <div class="welcome-row my-6">
    <p class="text-xs font-mono">Welcome back, {{ customer.name }} ({{ customer.email }})</p>
    <a href="/account/logout" class="cta-link text-xs underline font-mono">LOGOUT SESSION</a>
  </div>
  <div class="details-grid grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
    <div class="orders">
      <h3 class="text-sm font-bold font-mono tracking-wide uppercase mb-4">Receipt Registry</h3>
      {% paginate customer.orders by 10 %}
        {% if customer.orders.size > 0 %}
          <table class="receipts-table w-full text-left text-xs font-mono">
            <thead>
              <tr class="border-b border-zinc-800 text-zinc-500">
                <th class="pb-2">Receipt ID</th>
                <th class="pb-2">Date Stamp</th>
                <th class="pb-2">Status</th>
                <th class="pb-2 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {% for order in customer.orders %}
                <tr class="border-b border-zinc-900">
                  <td class="py-2"><a href="{{ order.customer_url }}" class="text-amber-400 font-bold">{{ order.name }}</a></td>
                  <td class="py-2">{{ order.created_at | date: "%Y-%m-%d" }}</td>
                  <td class="py-2">{{ order.fulfillment_status_label }}</td>
                  <td class="py-2 text-right">{{ order.total_price | money }}</td>
                </tr>
              {% endfor %}
            </tbody>
          </table>
        {% else %}
          <p class="font-mono text-zinc-500 text-xs">No active receipt records logged inside customer register.</p>
        {% endif %}
      {% endpaginate %}
    </div>
    <div class="account-addresses pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-zinc-800">
      <h3 class="text-sm font-bold font-mono tracking-wide uppercase mb-4">Primary Address Records</h3>
      {{ customer.default_address | format_address }}
      <a href="/account/addresses" class="cta-link text-xs underline font-mono block mt-3">EDIT ADDRESS DIRECTORY ({{ customer.addresses_count }})</a>
    </div>
  </div>
</div>`;

      case "templates/customers/activate_account.liquid":
        return `<div class="max-width-wrapper py-16 text-left">
  <h2 class="font-sans">Activate Account Portal</h2>
  <p class="font-mono text-xs text-zinc-500 my-4">Create your secure cryptographic passcode credentials key.</p>
  {% form 'activate_customer_password' %}
    <div class="form-row my-2"><input type="password" name="customer[password]" placeholder="SECURE PASSWORD" class="bg-[#111] p-3 border text-white text-xs"></div>
    <div class="form-row my-2"><input type="password" name="customer[password_confirmation]" placeholder="CONFIRM SECURE PASSWORD" class="bg-[#111] p-3 border text-white text-xs"></div>
    <button type="submit" class="bg-amber-400 text-black px-4 py-2 text-xs font-bold uppercase mt-4">ACTIVATE ACCOUNT ACCESS</button>
  {% endform %}
</div>`;

      case "templates/customers/addresses.liquid":
        return `<div class="max-width-wrapper py-12 text-left">
  <h2>Cryptographic Address Registry</h2>
  <a href="/account" class="text-xs font-mono text-zinc-500 underline">RETURN TO REGISTER</a>
  <div class="address-grid grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
    {% for address in customer.addresses %}
      <div class="address-card border border-zinc-800 p-4 bg-zinc-950">
        <h4 class="font-mono text-xs font-bold uppercase mb-2">Record #{{ forloop.index }}</h4>
        {{ address | format_address }}
      </div>
    {% endfor %}
  </div>
</div>`;

      case "templates/customers/login.liquid":
        return `<div class="max-width-wrapper py-16 text-center max-w-sm mx-auto">
  <h2>Client Session login</h2>
  <p class="font-mono text-xs text-zinc-500 my-4">Synchronize secure store catalog metadata.</p>
  {% form 'customer_login' %}
    <input type="email" name="customer[email]" placeholder="IDENTITY EMAIL" class="bg-[#111] p-3 border w-full text-white text-xs mb-2" required>
    <input type="password" name="customer[password]" placeholder="SECRET KEY" class="bg-[#111] p-3 border w-full text-white text-xs mb-4" required>
    <button type="submit" class="bg-amber-400 text-black px-4 py-2 text-xs font-bold uppercase w-full">ESTABLISH CHRONICLE SESSION</button>
  {% endform %}
</div>`;

      case "templates/customers/order.liquid":
        return `<div class="max-width-wrapper py-12">
  <h2>Transaction Certificate {{ order.name }}</h2>
  <a href="/account" class="text-xs font-mono text-zinc-500 underline mb-6 block">Return to Directory</a>
  <div class="order-details font-mono text-xs text-left bg-zinc-950 p-6 border border-zinc-850">
    <p>Transaction timestamp: {{ order.created_at | date: "%Y-%m-%d %H:%M" }}</p>
    <p>Receipt Status: <span class="text-amber-400">{{ order.financial_status_label }}</span></p>
    <div class="line-items my-4 border-t border-b border-zinc-800 py-4">
      {% for line_item in order.line_items %}
        <div class="flex justify-between py-1"><span>{{ line_item.title }} × {{ line_item.quantity }}</span><span>{{ line_item.final_line_price | money }}</span></div>
      {% endfor %}
    </div>
    <p class="text-right text-sm">Total calculated: {{ order.total_price | money }}</p>
  </div>
</div>`;

      case "templates/customers/register.liquid":
        return `<div class="max-width-wrapper py-16 text-center max-w-sm mx-auto">
  <h2>Enroll New Client Identity</h2>
  <p class="font-mono text-xs text-zinc-500 my-4">Initiate secure record ledger for shipments.</p>
  {% form 'create_customer' %}
    <input type="text" name="customer[first_name]" placeholder="FIRST NAME" class="bg-[#111] p-3 border w-full text-white text-xs mb-2" required>
    <input type="text" name="customer[last_name]" placeholder="LAST NAME" class="bg-[#111] p-3 border w-full text-white text-xs mb-2" required>
    <input type="email" name="customer[email]" placeholder="COMMUNICATION EMAIL" class="bg-[#111] p-3 border w-full text-white text-xs mb-2" required>
    <input type="password" name="customer[password]" placeholder="ACCESS KEY SECURE PIN" class="bg-[#111] p-3 border w-full text-white text-xs mb-4" required>
    <button type="submit" class="bg-amber-400 text-black px-4 py-2 text-xs font-bold uppercase w-full">GENERATE ENROLLED CREDENTIALS</button>
  {% endform %}
</div>`;

      case "templates/customers/reset_password.liquid":
        return `<div class="max-width-wrapper py-16 text-center max-w-sm mx-auto">
  <h2>Restore Credentials Key</h2>
  {% form 'reset_customer_password' %}
    <input type="password" name="customer[password]" placeholder="NEW PASSWORD KEY" class="bg-[#111] p-3 border w-full text-white text-xs mb-2" required>
    <input type="password" name="customer[password_confirmation]" placeholder="CONFIRM NEW KEY" class="bg-[#111] p-3 border w-full text-white text-xs mb-4" required>
    <button type="submit" class="bg-amber-400 text-black px-4 py-2 text-xs font-bold uppercase w-full">FLUSH OLD AND RE-KEY</button>
  {% endform %}
</div>`;

      case "sections/header-group.json":
        return JSON.stringify({
          name: "Header Group",
          type: "header",
          sections: {
            "announcement-bar": { "type": "announcement-bar", "settings": {} },
            "header": { "type": "main-header", "settings": {} }
          },
          order: ["announcement-bar", "header"]
        }, null, 2);

      case "sections/footer-group.json":
        return JSON.stringify({
          name: "Footer Group",
          type: "footer",
          sections: {
            "footer": { "type": "main-footer", "settings": {} }
          },
          order: ["footer"]
        }, null, 2);

      case "sections/overlay-group.json":
        return JSON.stringify({
          name: "Overlay Group",
          type: "aside",
          sections: {
            "cart-drawer": { "type": "cart-drawer", "settings": {} }
          },
          order: ["cart-drawer"]
        }, null, 2);

      case "sections/announcement-bar.liquid":
        return `{% comment %} Announcement bar cycler %}{% endcomment %}
<div class="announcement-bar bg-accent text-black text-center py-2 text-[10px] font-mono uppercase tracking-[0.15em]" style="background-color: var(--color-accent);">
  <div class="max-width-wrapper">
    <span>Free Express Shipment on orders matching archival threshold</span>
  </div>
</div>
{% schema %}
{
  "name": "Announcement Bar",
  "settings": []
}
{% endschema %}`;

      case "sections/main-header.liquid":
        return `{% comment %} Main shopify menu menu render {% endcomment %}
<header class="site-header py-4 border-b border-zinc-900 bg-black/60 backdrop-blur-md">
  <div class="max-width-wrapper flex justify-between items-center h-12">
    <div class="logo font-sans font-black tracking-tighter text-md">
      <a href="/">{{ section.settings.logo_text | default: "${settings.logoText}" }}</a>
    </div>
    <nav class="hidden md:flex gap-6 font-mono text-[10px] uppercase tracking-wider">
      <a href="/collections/all" class="hover:text-amber-400">Shop Catalog</a>
      <a href="/pages/chronology" class="hover:text-amber-400">The Chronicle</a>
      <a href="/pages/faq" class="hover:text-amber-400">Support</a>
    </nav>
    <div class="actions flex gap-4">
      <button class="search-btn text-zinc-400 hover:text-white" aria-label="Search">{% render 'icon' with 'search' %}</button>
      <a href="/cart" class="cart-btn flex items-center gap-1 bg-zinc-900 px-3 py-1 text-[10px] font-mono font-bold tracking-widest border border-zinc-850 text-white rounded-none">
        {% render 'icon' with 'cart' %}
        <span>{{ cart.item_count | default: 0 }}</span>
      </a>
    </div>
  </div>
</header>
{% schema %}
{
  "name": "Main Header Navigation",
  "settings": [
    { "type": "text", "id": "logo_text", "label": "Text Brand Logo", "default": "${settings.logoText}" }
  ]
}
{% endschema %}`;

      case "sections/main-footer.liquid":
        return `<footer class="main-footer bg-black border-t border-zinc-900 py-16 text-zinc-400 font-sans">
  <div class="max-width-wrapper grid grid-cols-1 md:grid-cols-4 gap-8">
    <div class="footer-block col-span-2">
      <h4 class="text-white text-xs font-black uppercase tracking-widest font-mono mb-4">{{ section.settings.footer_title | default: "${settings.logoText}" }}</h4>
      <p class="text-xs leading-relaxed max-w-sm font-mono text-zinc-500">Shopify Online Store 2.0 blueprint theme built with high contrast design visual language.</p>
    </div>
    <div class="footer-block font-mono text-[10px] space-y-2 uppercase text-left">
      <h5 class="text-zinc-500 font-bold ml-0">QUICK INDEX</h5>
      <ul class="space-y-1 block list-none pl-0">
        <li><a href="/collections/all" class="hover:text-white block">Complete Ledger</a></li>
        <li><a href="/blogs/dispatch" class="hover:text-white block">Despatch Chronicle</a></li>
        <li><a href="/pages/privacy" class="hover:text-white block">Compliance Ledger</a></li>
      </ul>
    </div>
    <div class="footer-block font-mono text-[10px] uppercase text-left">
      <h5 class="text-zinc-500 font-bold ml-0">NEWSLETTER PROTOCOL</h5>
      <input type="email" placeholder="IDENTITY@EMAIL.COM" class="bg-[#111] border border-zinc-800 p-2 text-[10px] w-full mt-2 text-white">
      <button class="bg-[#fff] text-black w-full px-4 py-2 mt-2 font-bold tracking-widest text-[9px] hover:bg-zinc-200">TRANSMIT</button>
    </div>
  </div>
</footer>
{% schema %}
{
  "name": "Footer Chronicle",
  "settings": [
    { "type": "text", "id": "footer_title", "label": "Footer Title Column", "default": "${settings.logoText}" }
  ]
}
{% endschema %}`;

      case "sections/slideshow.liquid":
        return `<section class="slideshow relative h-[70vh] flex items-center bg-zinc-950 overflow-hidden" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1400'); background-size: cover; background-position: center;">
  <div class="max-width-wrapper text-left space-y-4">
    <span class="font-mono text-[10px] bg-amber-400 text-black px-2.5 py-1 tracking-wider uppercase font-bold">ARCHIVAL SELECTIONS</span>
    <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none max-w-2xl">{{ section.settings.slideshow_h1 | default: "SYSTEM DISPATCH" }}</h1>
    <p class="text-zinc-400 max-w-md text-xs font-mono leading-relaxed">Shop extreme-performance modular silhouettes and construction detail units designed for micro-climate insulation.</p>
    <a href="/collections/all" class="cta-button bg-white text-black font-mono font-bold uppercase tracking-widest text-[10px] px-6 py-3.5 inline-block hover:bg-zinc-200">EXPLORE LEDGER</a>
  </div>
</section>
{% schema %}
{
  "name": "Hero Slideshow",
  "settings": [
    { "type": "text", "id": "slideshow_h1", "label": "Main Heading Title", "default": "COLLECTION ARCHIVE v.12" }
  ],
  "presets": [{ "name": "Hero Slideshow" }]
}
{% endschema %}`;

      case "sections/scrolling-text.liquid":
        return `<section id="scrolling-text-banner" class="scrolling-text py-4 bg-zinc-950 border-t border-b border-zinc-900 overflow-hidden select-none">
  <div class="marquee-track flex whitespace-nowrap gap-8 animate-marquee font-mono text-[10px] tracking-[0.2em] font-bold text-zinc-500 uppercase">
    <span>CONSTRUCTION SYNTHESIS UNITS</span> <span>•</span>
    <span>IMPACT SILHOUETTES</span> <span>•</span>
    <span>MODULAR APPAREL DESIGN FORWARD</span> <span>•</span>
    <span>UTILITY LEDGER INDEX</span> <span>•</span>
    <span>CONSTRUCTION SYNTHESIS UNITS</span> <span>•</span>
    <span>IMPACT SILHOUETTES</span> <span>•</span>
    <span>MODULAR APPAREL DESIGN FORWARD</span> <span>•</span>
  </div>
</section>
{% schema %}
{
  "name": "Scrolling Marquee Track",
  "settings": [],
  "presets": [{ "name": "Scrolling Marquee" }]
}
{% endschema %}`;

      case "sections/video.liquid":
        return `<section class="video-section py-16 bg-black">
  <div class="max-width-wrapper">
    <div class="video-banner relative h-[50vh] flex items-center justify-center bg-zinc-900" style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000');">
      <div class="text-center space-y-4">
        <button class="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white bg-black/40 hover:bg-white hover:text-black cursor-pointer tracking-wider text-xs font-bold leading-none select-none">PLAY</button>
        <h4 class="font-mono text-[10px] tracking-widest text-zinc-400">CHRONOLOGY DISPATCH MOTION FRAME</h4>
      </div>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Full-width Video Media",
  "settings": [],
  "presets": [{ "name": "Motion Video Banner" }]
}
{% endschema %}`;

      case "sections/grid-with-text.liquid":
        return `<section class="grid-with-text py-16 bg-[#090909]">
  <div class="max-width-wrapper grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="text-left border border-zinc-900 p-6 bg-black">
      <span class="font-mono text-[#D1FF26] text-[10px]" style="color: var(--color-accent);">[ 01 MODULE ]</span>
      <h4 class="text-md uppercase font-black text-white my-3">THERMO VENTING COAT</h4>
      <p class="text-zinc-500 text-xs font-mono leading-relaxed">Dynamic breathable zip ventilation paths structured around high core heat accumulation spots.</p>
    </div>
    <div class="text-left border border-zinc-900 p-6 bg-black">
      <span class="font-mono text-[#D1FF26] text-[10px]" style="color: var(--color-accent);">[ 02 MODULE ]</span>
      <h4 class="text-md uppercase font-black text-white my-3">TACTICAL GRID COMFORT</h4>
      <p class="text-zinc-500 text-xs font-mono leading-relaxed">Ergonomic fit parameters engineered to provide unrestricted freedom of motion mechanics.</p>
    </div>
    <div class="text-left border border-zinc-900 p-6 bg-black">
      <span class="font-mono text-[#D1FF26] text-[10px]" style="color: var(--color-accent);">[ 03 MODULE ]</span>
      <h4 class="text-md uppercase font-black text-white my-3">CRUST CLIMATE SHIELD</h4>
      <p class="text-zinc-500 text-xs font-mono leading-relaxed">Laminated standard exterior membrane shell fabrics protecting against harsh rain or water dampness.</p>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Brutalist Features Grid",
  "settings": [],
  "presets": [{ "name": "Brutalist Features Grid" }]
}
{% endschema %}`;

      case "sections/multi-column.liquid":
        return `<section class="columns py-16 text-zinc-400">
  <div class="max-width-wrapper space-y-8">
    <div class="heading text-left flex justify-between items-baseline border-b border-zinc-900 pb-4">
      <h3 class="text-zinc-500 text-xs font-bold font-mono tracking-widest">ECOSYSTEM DIAGNOSTICS</h3>
      <span class="font-mono text-[10px] text-zinc-600">v.1.2.0</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-left">
      <div><h4 class="text-white font-bold font-mono text-[11px] mb-2 uppercase">01 COLD PREV</h4><p class="font-mono text-zinc-500">Premium heavy lining insulates internal temperatures up to extreme climatic changes.</p></div>
      <div><h4 class="text-white font-bold font-mono text-[11px] mb-2 uppercase">02 PACK CONV</h4><p class="font-mono text-zinc-500">Lightweight packing components folding compactly inside standard carry grids.</p></div>
      <div><h4 class="text-white font-bold font-mono text-[11px] mb-2 uppercase">03 SECURE ZIP</h4><p class="font-mono text-zinc-500">Water resistant taped slide-track zippers preventing ambient moisture leakage.</p></div>
      <div><h4 class="text-white font-bold font-mono text-[11px] mb-2 uppercase">04 WATER SHIELD</h4><p class="font-mono text-zinc-500">Durable water repellent exterior coat protecting catalog items from storm conditions.</p></div>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Ecosystem diagnostics Block",
  "settings": [],
  "presets": [{ "name": "Ecosystem diagnostics columns" }]
}
{% endschema %}`;

      case "sections/main-product.liquid":
        return `{% comment %} Product purchase detail section {% endcomment %}
<section class="main-product-section max-width-wrapper py-12 text-left" data-product-id="{{ product.id }}">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
    <div class="media-gallery space-y-4">
      <div class="gallery-featured border border-zinc-900 bg-zinc-950 p-6 relative flex items-center justify-center">
        <img id="MainFeaturedImage" src="{{ product.featured_image | image_url: width: 800 }}" alt="{{ product.title }}" class="w-full grayscale contrast-[1.1]">
      </div>
      <div class="gallery-thumbs flex gap-3">
        {% for image in product.images %}
          <button class="thumb-btn border border-zinc-900 w-16 h-16 flex items-center justify-center" onclick="updateFeaturedImage('{{ image | image_url: width: 800 }}')">
            <img src="{{ image | image_url: width: 100 }}" class="w-full h-full object-cover">
          </button>
        {% endfor %}
      </div>
    </div>
    <div class="product-buy-box space-y-6">
      {% render 'breadcrumbs' %}
      <div>
        <span class="font-mono text-[10px] text-[#D1FF26] tracking-widest uppercase" style="color: var(--color-accent);">{{ product.vendor }}</span>
        <h2 class="text-xl md:text-2xl uppercase tracking-tighter text-white font-black mt-2">{{ product.title }}</h2>
      </div>
      <div class="price font-mono text-sm font-bold text-white">{{ product.price | money }}</div>
      <p class="text-zinc-500 text-xs leading-relaxed max-w-sm">{{ product.description }}</p>
      {% form 'product', product, class: 'product-form space-y-4' %}
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">
        
        <div class="selectors space-y-3 font-mono text-[10px]">
          <label class="text-zinc-500 font-bold block uppercase">Select variant class</label>
          <div class="flex gap-2.5">
            <button type="button" class="border border-[#D1FF26] px-4 py-2 font-bold bg-[#D1FF26]/10 text-[#D1FF26]" style="border-color: var(--color-accent); text-color: var(--color-accent);">REGULAR MATT</button>
            <button type="button" class="border border-zinc-850 text-zinc-500 px-4 py-2 hover:border-zinc-700">SHIELD REFLECT</button>
          </div>
        </div>

        <div class="purchase-row flex gap-4">
          <input type="number" name="quantity" value="1" min="1" class="bg-[#111] text-white border border-zinc-800 p-2 text-xs w-16">
          <button type="submit" class="flex-1 bg-amber-400 hover:bg-amber-350 text-black font-mono font-bold uppercase py-3 px-6 tracking-widest text-xs">ADD TO LEDGER BASKET</button>
        </div>
      {% endform %}
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Main Product Core Details",
  "settings": []
}
{% endschema %}`;

      case "sections/main-collection.liquid":
        return `{% comment %} Product collection grid filter {% endcomment %}
<section class="collection-directory py-12 max-width-wrapper text-left">
  <div class="heading border-b border-zinc-900 pb-6 mb-8 flex justify-between items-baseline">
    <div>
      <h2 class="text-xl font-black uppercase tracking-tight text-white">{{ collection.title | default: "Avant-Garde Collection" }}</h2>
      <p class="text-zinc-500 text-xs font-mono mt-1">{{ collection.products_count | default: 8 }} Catalog listings available</p>
    </div>
    <div>
      <select class="bg-[#050505] border border-zinc-800 text-zinc-500 font-mono text-[10px] p-2 uppercase">
        <option>Chronological Sort</option><option>By Value Ascending</option>
      </select>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
    <aside class="sidebar-filters space-y-6 font-mono text-[10px] text-zinc-500 uppercase">
      <div>
        <h5 class="font-bold text-white mb-3">VARIANT FILTER TYPE</h5>
        <div class="space-y-1.5 list-none pl-0">
          <label class="flex gap-2 items-center"><input type="checkbox" checked class="accent-amber-400"> ALL SHELL COVER MODULES</label>
          <label class="flex gap-2 items-center"><input type="checkbox" class="accent-amber-400"> MATRIX THERMO LININGS</label>
          <label class="flex gap-2 items-center"><input type="checkbox" class="accent-amber-400"> FLUID EXTREME GEAR</label>
        </div>
      </div>
    </aside>
    <div class="col-span-3">
      <div id="product-grid" class="products-grid">
        {% for product in collection.products %}
          {% render 'product-card', product: product %}
        {% empty %}
          {% render 'product-card' %}
        {% endfor %}
      </div>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Collection Grid Loop",
  "settings": []
}
{% endschema %}`;

      case "sections/featured-product.liquid":
        return `{% comment %} Single Product Spot Buy {% endcomment %}
<section class="featured-product-banner py-16 bg-[#070707] border-t border-b border-zinc-900">
  <div class="max-width-wrapper grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
    <div>
      <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800" class="w-full grayscale contrast-[1.1] border border-zinc-850">
    </div>
    <div class="space-y-4">
      <span class="font-mono text-[10px] text-zinc-500">[ HIGHLIGHT PRODUCT DISPATCH ]</span>
      <h3 class="text-xl uppercase font-black text-white">BRUTALIST SHELL MEMBRANE v1</h3>
      <div class="price font-mono text-xs text-amber-400">$280.00 SAMPLE VALUE</div>
      <p class="text-zinc-400 text-xs leading-relaxed max-w-sm">Direct micro-climate control via physical layers and lamination. Waterproof slide zipper panels configured for extreme moisture insulation.</p>
      <a href="/products/brutalist-membrane" class="cta-button bg-white text-black font-mono font-bold uppercase tracking-widest text-[9px] px-6 py-3.5 inline-block rounded-none">PURCHASE ENTRY SHELL</a>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Featured Product Spotlight",
  "settings": [],
  "presets": [{ "name": "Featured Product Spotlight" }]
}
{% endschema %}`;

      case "sections/featured-collection.liquid":
        return `<section class="featured-collection py-12">
  <div class="max-width-wrapper">
    <div class="heading-row flex justify-between items-baseline border-b border-zinc-900 pb-4 mb-6">
      <h3 class="font-mono text-[10px] text-zinc-550 uppercase tracking-widest">[ RECOMMENDED APPAREL DISPATCH ]</h3>
      <a href="/collections/all" class="font-mono text-[9px] text-[#D1FF26] uppercase hover:underline" style="color: var(--color-accent);">View All</a>
    </div>
    
    <div class="products-grid">
      {% for product in collections[section.settings.collection].products limit: section.settings.limit %}
        {% render 'product-card', product: product %}
      {% empty %}
        {% render 'product-card' %}
        {% render 'product-card' %}
        {% render 'product-card' %}
        {% render 'product-card' %}
      {% endfor %}
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Featured Catalog Grid",
  "settings": [
    { "type": "collection", "id": "collection", "label": "Select Collection" },
    { "type": "range", "id": "limit", "min": 2, "max": 8, "step": 1, "label": "Show Total Items", "default": 4 }
  ],
  "presets": [{ "name": "Featured Apparel Catalog" }]
}
{% endschema %}`;

      case "sections/collection-list.liquid":
        return `<section class="collection-list-section py-16">
  <div class="max-width-wrapper text-left space-y-6">
    <div class="flex justify-between items-baseline border-b border-zinc-900 pb-4">
      <h3 class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">[ PARENT CATALOG CATEGORIES ]</h3>
      <a href="/collections/all" class="font-mono text-[9px] text-[#D1FF26] uppercase hover:underline" style="color: var(--color-accent);">View All</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px] uppercase">
      <a href="/collections/outerwear" class="category-card relative h-48 border border-zinc-850 flex items-end p-4 bg-zinc-950/40 hover:border-amber-400 transition">
        <span>OUTERWEAR CLIMATE MATRIX (3)</span>
      </a>
      <a href="/collections/midlayers" class="category-card relative h-48 border border-zinc-850 flex items-end p-4 bg-zinc-950/40 hover:border-amber-400 transition">
        <span>THERMAL INSULATION CORES (5)</span>
      </a>
      <a href="/collections/hardware" class="category-card relative h-48 border border-zinc-850 flex items-end p-4 bg-zinc-950/40 hover:border-amber-400 transition">
        <span>GEAR UTILITY ATTACHMENTS (2)</span>
      </a>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Collection Directory Categories",
  "settings": [],
  "presets": [{ "name": "Categories Grid List" }]
}
{% endschema %}`;

      case "sections/complementary-products.liquid":
        return `<section class="complementary-products-block py-6 border-t border-zinc-900 font-mono text-[10px] tracking-wider uppercase">
  <h5 class="text-zinc-500 font-bold mb-4">RECOMMENDED COMPLEMENTARY LAYERS</h5>
  <div class="space-y-3">
    <div class="flex justify-between items-center bg-[#070707] border border-zinc-850 p-2.5">
      <span class="text-white">COBRA WAIST HARNESS BELT</span><span>$110</span>
    </div>
    <div class="flex justify-between items-center bg-[#070707] border border-zinc-850 p-2.5">
      <span class="text-white">LAMINATED MATRIX STORAGE UNIT</span><span>$85</span>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Complementary Products",
  "settings": []
}
{% endschema %}`;

      case "sections/product-recommendations.liquid":
        return `{% comment %} Product recommendations load anchor %}{% endcomment %}
<div class="product-recommendations-row py-12 max-width-wrapper border-t border-zinc-900" data-url="{{ routes.product_recommendations_url }}?section_id={{ section.id }}&product_id={{ product.id }}&limit=4">
  {% if recommendations.performed and recommendations.products_count > 0 %}
    <h3 class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest text-left mb-6">[ ASSOCIATED SYSTEM RECOMMENDATIONS ]</h3>
    <div class="products-grid">
      {% for recommendation in recommendations.products %}
        {% render 'product-card', product: recommendation %}
      {% endfor %}
    </div>
  {% endif %}
</div>
{% schema %}
{
  "name": "Platform Recommendations",
  "settings": []
}
{% endschema %}`;

      case "sections/recently-viewed-products.liquid":
        return `<section class="recently-viewed py-12 border-t border-zinc-900 text-left max-width-wrapper">
  <h3 class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-6">[ CURRENTLY VISITED SESSION REGISTERS ]</h3>
  <div id="recently-viewed-items" class="products-grid">
    <p class="font-mono text-[9px] text-zinc-550 uppercase">Awaiting cached session logs cookies...</p>
  </div>
</section>
{% schema %}
{
  "name": "Recently Viewed Registers",
  "settings": []
}
{% endschema %}`;

      case "sections/testimonials.liquid":
        return `<section class="testimonials py-20 bg-black/40 text-left">
  <div class="max-width-wrapper space-y-8">
    <div class="header-col">
      <span class="font-mono text-[10px] text-[#D1FF26] uppercase tracking-widest block" style="color: var(--color-accent);">[ SYSTEM VERIFICATION REGISTERS ]</span>
      <h3 class="text-xl uppercase font-black text-white mt-2">Active Chronicle Feedback</h3>
    </div>
    <div class="testimonials-grid grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-mono">
      <div class="feedback-card border border-zinc-900 bg-zinc-950 p-6 space-y-4">
        <div class="reviewer text-white font-bold tracking-tight">ALGO_COMMANDER <span class="text-zinc-550 italic">(Verified Session)</span></div>
        <div class="stars text-[#D1FF26]" style="color: var(--color-accent);">★★★★★</div>
        <p class="text-zinc-450 normal-case leading-relaxed">"The layered wind membrane structure easily out-performs standard visual products outdoors in rain mist weather."</p>
      </div>
      <div class="feedback-card border border-zinc-900 bg-zinc-950 p-6 space-y-4">
        <div class="reviewer text-white font-bold tracking-tight">HEAVY_CHRONICLE_WALKER <span class="text-zinc-550 italic">(Verified Session)</span></div>
        <div class="stars text-[#D1FF26]" style="color: var(--color-accent);">★★★★★</div>
        <p class="text-zinc-450 normal-case leading-relaxed">"Pristine heavy fabrics stitched with incredible precision structural parameters. Standard spacing in design is unmatched."</p>
      </div>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "Testimonials Registry",
  "settings": [],
  "presets": [{ "name": "Brutalist testimonials reviews" }]
}
{% endschema %}`;

      case "sections/press-logos.liquid":
        return `<section class="press-logos py-12 border-t border-b border-zinc-900 bg-black select-none opacity-40 hover:opacity-100 transition duration-300">
  <div class="max-width-wrapper flex flex-wrap justify-between items-center gap-6 font-mono font-black text-center text-xs text-zinc-500 uppercase tracking-widest leading-none">
    <span>MODULAR_MAG</span> <span>•</span>
    <span>SYNTHESIS_DIALS</span> <span>•</span>
    <span>CHRON Chronicle</span> <span>•</span>
    <span>CLIMATE_GEAR_CORPS</span>
  </div>
</section>
{% schema %}
{
  "name": "Press Logo Badges",
  "settings": [],
  "presets": [{ "name": "Press Validation Badges" }]
}
{% endschema %}`;

      case "sections/timeline.liquid":
        return `<section class="timeline py-16 text-zinc-400 text-left">
  <div class="max-width-wrapper space-y-8">
    <span class="font-mono text-[9px] text-[#D1FF26] tracking-widest uppercase block" style="color: var(--color-accent);">[ CHRONOLOGICAL LOGS ]</span>
    <div class="timeline-row grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="timeline-step border-l-2 border-zinc-805 pl-4 space-y-2">
        <span class="font-mono text-[10px] text-white font-bold">2021: ENVELOPE DESIGN</span>
        <p class="text-xs text-zinc-550 leading-normal font-mono">Prototype modular matrix insulation models initiated in studio workspace cells.</p>
      </div>
      <div class="timeline-step border-l-2 border-zinc-805 pl-4 space-y-2">
        <span class="font-mono text-[10px] text-white font-bold">2023: VEO LAUNCH</span>
        <p class="text-xs text-zinc-550 leading-normal font-mono">First functional apparel items deployed to extreme climate tests in high altitudes.</p>
      </div>
      <div class="timeline-step border-l-2 border-amber-400 pl-4 space-y-2">
        <span class="font-mono text-[10px] text-amber-400 font-bold">2026: INTEGRAL SYSTEM</span>
        <p class="text-xs text-zinc-550 leading-normal font-mono">Online Store 2.0 release, integrating full custom sections schemas and metadata loops.</p>
      </div>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "History Timeline Narratives",
  "settings": [],
  "presets": [{ "name": "Milestone Timeline Row" }]
}
{% endschema %}`;

      case "sections/accordion.liquid":
        return `<section class="faq-accordion py-16 bg-[#070707]">
  <div class="max-width-wrapper text-left space-y-8 max-w-2xl mx-auto">
    <div class="text-center">
      <span class="font-mono text-[9px] text-zinc-550 tracking-wider">SUPPORT DIRECTIVES AND FAQ</span>
      <h3 class="text-xl uppercase font-black text-white mt-1">Frequently Questioned Ledgers</h3>
    </div>
    <div class="accordion-group divide-y divide-zinc-900 font-sans text-xs">
      <details class="group py-4 cursor-pointer select-none">
        <summary class="flex justify-between items-center font-bold text-white uppercase tracking-tight font-mono">
          <span>Are shipping calculations fully certified?</span>
          <span class="text-zinc-600 transition group-open:rotate-180">+</span>
        </summary>
        <p class="text-zinc-450 leading-relaxed font-mono text-[11px] mt-3">Yes, complete express shipping estimates are computed symmetrically globally. Local duty certificates are included at checkout borders.</p>
      </details>
      <details class="group py-4 cursor-pointer select-none">
        <summary class="flex justify-between items-center font-bold text-white uppercase tracking-tight font-mono">
          <span>What is the system refund structure policy?</span>
          <span class="text-zinc-650 transition group-open:rotate-180">+</span>
        </summary>
        <p class="text-zinc-450 leading-relaxed font-mono text-[11px] mt-3">All unused items inside their original construction shield wraps may be returned inside 30 operational days for registry refund.</p>
      </details>
    </div>
  </div>
</section>
{% schema %}
{
  "name": "FAQ Collapsible Accordion",
  "settings": [],
  "presets": [{ "name": "FAQ Collapsible Accordions" }]
}
{% endschema %}`;

      case "sections/blog-posts.liquid":
        return `<section class="blog-posts-feed py-16 text-left max-width-wrapper">
  <div class="heading border-b border-zinc-900 pb-4 mb-8 flex justify-between items-baseline font-mono text-[10px]">
    <h3 class="text-zinc-500 uppercase tracking-widest">[ CURRENT DISPATCH REGISTER ]</h3>
    <a href="/blogs/dispatch" class="underline text-amber-400">View All Despatches</a>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {% for article in blog.articles limit: 3 %}
      <article class="space-y-3 font-sans">
        <div class="h-44 bg-zinc-950 border border-zinc-900 relative">
          <img src="{{ article.image | image_url: width: 600 }}" class="w-full h-full object-cover grayscale opacity-60">
        </div>
        <span class="font-mono text-[9px] text-zinc-550">{{ article.published_at | date: "%Y-%m-%d" }}</span>
        <h4 class="text-white text-sm uppercase font-bold"><a href="{{ article.url }}">{{ article.title }}</a></h4>
        <p class="text-zinc-450 text-xs leading-relaxed">{{ article.excerpt_or_content | strip_html | truncatewords: 20 }}</p>
      </article>
    {% empty %}
      <article class="space-y-3 font-sans">
        <div class="h-44 bg-zinc-900 border border-zinc-850"></div>
        <span class="font-mono text-[9px] text-zinc-550">2026-06-02</span>
        <h4 class="text-white text-sm uppercase font-bold">[ PREVIEW ] INITIAL CORE DEPLOYMENT DISPATCH</h4>
        <p class="text-zinc-550 text-xs font-mono leading-relaxed">Studio logs detailing structural parameters behind our brand new Online Store 2.0 release version.</p>
      </article>
    {% endfor %}
  </div>
</section>
{% schema %}
{
  "name": "Chronicle Blog Posts Grid",
  "settings": [],
  "presets": [{ "name": "Chronicle Blog Feed" }]
}
{% endschema %}`;

      case "sections/main-cart.liquid":
        return `<section class="main-cart-page py-12 text-left max-width-wrapper">
  <h2 class="text-xl font-black uppercase tracking-tight text-white mb-8">Cart Basket Ledgers</h2>
  {% if cart.item_count > 0 %}
    <form action="/cart" method="post" class="space-y-6">
      <div class="cart-items font-mono text-xs divide-y divide-zinc-955">
        {% for item in cart.items %}
          <div class="flex justify-between py-4 items-center gap-6">
            <div class="item-meta">
              <span class="text-white font-bold block uppercase">{{ item.product.title }}</span>
              <span class="text-zinc-550 text-[10px]">{{ item.vendor }} / {{ item.variant.title }}</span>
            </div>
            <div class="flex items-center gap-6">
              <span>Qty: <input type="number" name="updates[]" value="{{ item.quantity }}" class="bg-[#111] p-1 border w-12 text-center"></span>
              <span class="text-white font-bold">{{ item.final_line_price | money }}</span>
              <a href="/cart/change?line={{ forloop.index }}&quantity=0" class="text-rose-500">Remove</a>
            </div>
          </div>
        {% endfor %}
      </div>
      <div class="cart-totals border-t border-zinc-900 pt-6 text-right font-mono text-xs space-y-4">
        <div>Total Value: <span class="text-sm font-bold text-white ml-2">{{ cart.total_price | money }}</span></div>
        <button type="submit" name="checkout" class="bg-amber-400 text-black px-6 py-3 text-xs font-bold uppercase hover:bg-amber-300">SUBMIT CHECKOUT LEDGER</button>
      </div>
    </form>
  {% else %}
    <div class="empty-state font-mono text-xs text-zinc-550 py-12 space-y-4">
      <p>Your shop checkout cart register is currently completely empty.</p>
      <a href="/collections/all" class="text-amber-400 underline block uppercase">Return to general catalog</a>
    </div>
  {% endif %}
</section>
{% schema %}
{
  "name": "Main Checkout Cart",
  "settings": []
}
{% endschema %}`;

      case "sections/cart-drawer.liquid":
        return `<div id="cart-drawer-matrix" class="cart-drawer-wrapper hidden fixed right-0 top-0 h-full w-80 bg-[#0a0a0a] border-l border-zinc-850 z-[200] p-6 font-mono text-[10px] uppercase text-zinc-400 space-y-6">
  <div class="drawer-header flex justify-between items-baseline border-b border-zinc-900 pb-4">
    <span class="text-white font-bold font-sans text-xs">BASKET LEDGER</span>
    <button class="close-drawer hover:text-white pointer">CLOSE</button>
  </div>
  <div class="drawer-items flex-1 overflow-y-auto font-mono text-[9px] divide-y divide-zinc-910">
    <p class="text-zinc-600 block my-4 uppercase">Cart Basket ledger is empty</p>
  </div>
  <div class="drawer-footer border-t border-zinc-900 pt-4">
    <a href="/cart" class="bg-white text-black font-bold uppercase w-full block text-center py-2 text-[10px] tracking-widest leading-normal">GO TO CART SUMMARY</a>
  </div>
</div>
{% schema %}
{
  "name": "Cart Drawer Slide-out",
  "settings": []
}
{% endschema %}`;

      case "sections/call-to-action.liquid":
        return `<section class="cta-section py-20 bg-accent text-black" style="background-color: var(--color-accent); border-radius: var(--border-radius);">
  <div class="max-width-wrapper text-center space-y-4">
    <h2>TRANSMIT ARCHIVAL SYSTEM SELECTIONS</h2>
    <p class="max-w-md mx-auto font-mono text-xs">Unlock complimentary tracked shipping calculations across all system modules above $150 threshold.</p>
    <a href="/collections/all" class="cta-black-btn">SUBMIT DISPATCH</a>
  </div>
</section>
{% schema %}
{
  "name": "Action Call",
  "settings": []
}
{% endschema %}`;

      case "snippets/product-card.liquid":
        return `<div class="product-card" style="border-radius: var(--border-radius);">
  <div class="card-media">
    <a href="{{ product.url }}">
      <img src="{{ product.featured_image | image_url: width: 400 }}" alt="{{ product.title }}" {% if settings.lazy_loading_secured == true or settings.lazy_loading_secured == nil %}loading="lazy" class="lazyload"{% endif %}>
    </a>
  </div>
  <div class="card-info font-sans">
    <div class="card-header">
      <h4 class="title"><a href="{{ product.url }}">{{ product.title }}</a></h4>
      <span class="vendor-sub font-mono">{{ product.vendor }}</span>
    </div>
    <div class="card-footer font-mono">
      <span class="price">{{ product.price | money }}</span>
      <button class="quick-add-trigger" onclick="instantQuickAdd('{{ product.id }}')">Instant Add</button>
    </div>
  </div>
</div>`;

      case "snippets/breadcrumbs.liquid":
        return `{% comment %} Core navigation trails {% endcomment %}
<nav class="breadcrumb max-width-wrapper" aria-label="breadcrumbs">
  <a href="/" title="Home">ledger</a>
  {% if template contains 'product' %}
    <span class="decor">/</span>
    <a href="/collections/all">catalog</a>
    <span class="decor">/</span>
    <span class="current">{{ product.title }}</span>
  {% elif template contains 'collection' %}
    <span class="decor">/</span>
    <span class="current">{{ collection.title }}</span>
  {% endif %}
</nav>`;

      case "snippets/icon.liquid":
        return `{%- case icon -%}
  {%- when 'search' -%}
    <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-search w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  {%- when 'cart' -%}
    <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-cart w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  {%- when 'close' -%}
    <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-close w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  {%- when 'chevron-down' -%}
    <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-chevron-down w-3 h-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  {%- when 'instagram' -%}
    <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-instagram w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  {%- when 'twitter' -%}
    <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-twitter w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
    </svg>
  {%- else -%}
    <span class="icon-fallback-placeholder">[{{ icon }}]</span>
{%- endcase -%}`;

      case "snippets/pagination.liquid":
        return `{%- if paginate.parts.size > 0 -%}
  <nav class="pagination flex justify-center items-center gap-4 py-8 font-mono text-xs uppercase" role="navigation">
    {%- if paginate.previous -%}
      <a href="{{ paginate.previous.url }}" class="hover:text-[#D1FF26]" style="color: var(--color-accent);">Previous</a>
    {%- endif -%}
    {%- for part in paginate.parts -%}
      {%- if part.is_link -%}
        <a href="{{ part.url }}" class="hover:text-[#D1FF26]">{{ part.title }}</a>
      {%- else -%}
        {%- if part.title == paginate.current_page -%}
          <span class="text-[#D1FF26] font-bold border-b border-[#D1FF26]" style="color: var(--color-accent); border-color: var(--color-accent);">{{ part.title }}</span>
        {%- else -%}
          <span class="text-zinc-650">{{ part.title }}</span>
        {%- endif -%}
      {%- endif -%}
    {%- endfor -%}
    {%- if paginate.next -%}
      <a href="{{ paginate.next.url }}" class="hover:text-[#D1FF26]" style="color: var(--color-accent);">Next</a>
    {%- endif -%}
  </nav>
{%- endif -%}`;

      case "snippets/social-media.liquid":
        return `<div class="social-media-links flex gap-4 text-xs font-mono uppercase text-zinc-550">
  {%- if settings.social_instagram_link != blank -%}
    <a href="{{ settings.social_instagram_link }}" class="hover:text-white flex items-center gap-1.5" target="_blank">
      {% render 'icon' with 'instagram' %}
      <span>Instagram</span>
    </a>
  {%- endif -%}
  {%- if settings.social_twitter_link != blank -%}
    <a href="{{ settings.social_twitter_link }}" class="hover:text-white flex items-center gap-1.5" target="_blank">
      {% render 'icon' with 'twitter' %}
      <span>Twitter</span>
    </a>
  {%- endif -%}
</div>`;

      case "snippets/css-variables.liquid":
        return `<style>
  :root {
    --color-primary: {{ settings.color_primary | default: '${settings.primaryColor}' }};
    --color-accent: {{ settings.color_accent | default: '${settings.accentColor}' }};
    --color-bg: {{ settings.color_bg | default: '${settings.bgColor}' }};
    --color-text: {{ settings.color_text | default: '${settings.textColor}' }};
    --font-base: {{ settings.typography_family | default: '${settings.fontFamily}' }}, sans-serif;
  }
</style>`;

      case "snippets/line-item.liquid":
        return `<div class="cart-line-item flex justify-between items-center py-4 border-b border-zinc-900" data-line="{{ item.index }}">
  <div class="flex gap-4 items-center">
    <img src="{{ item.image | image_url: width: 120 }}" alt="{{ item.title }}" class="w-16 h-20 object-cover grayscale">
    <div>
      <h4 class="text-xs font-bold uppercase text-white">{{ item.product.title }}</h4>
      <span class="text-[10px] text-zinc-500 font-mono">{{ item.variant.title }}</span>
    </div>
  </div>
  <div class="flex items-center gap-6 text-xs font-mono">
    <span>Qty: {{ item.quantity }}</span>
    <span class="text-white font-bold">{{ item.final_line_price | money }}</span>
  </div>
</div>`;

      case "snippets/price.liquid":
        return `{%- if product.compare_at_price > product.price -%}
  <span class="price-compare text-zinc-650 line-through mr-2">{{ product.compare_at_price | money }}</span>
  <span class="price-sale text-rose-500 font-bold">{{ product.price | money }}</span>
{%- else -%}
  <span class="price-regular text-white font-bold">{{ product.price | money }}</span>
{%- endif -%}`;

      case "assets/vendor.js":
        return `// Vendor Utilities and Helper JS Libraries for Shopify
console.log('[Shopify Theme Engine] Vendor Framework Loaded');`;

      case "assets/product.js":
        return `// Dynamic variant selectors & multi-media slider mechanics logic
console.log('[Shopify Theme Engine] Product Interactions Module Active');`;

      case "assets/facets.js":
        return `// AJAX filter faceting parameters for collections lists
console.log('[Shopify Theme Engine] Collection Filters Faceting Initialized');`;

      case "locales/es.json":
        return JSON.stringify({
          general: {
            accessibility: {
              skip_to_content: "Omitir al contenido",
              close: "Cerrar"
            },
            search: {
              search: "Buscar",
              submit: "Enviar"
            }
          },
          sections: {
            header: {
              title: "Encabezado"
            }
          }
        }, null, 2);

      case "locales/fr.json":
        return JSON.stringify({
          general: {
            accessibility: {
              skip_to_content: "Passer au contenu",
              close: "Fermer"
            },
            search: {
              search: "Rechercher",
              submit: "Envoyer"
            }
          },
          sections: {
            header: {
              title: "En-tête"
            }
          }
        }, null, 2);

      case "locales/de.json":
        return JSON.stringify({
          general: {
            accessibility: {
              skip_to_content: "Zum Inhalt springen",
              close: "Schließen"
            },
            search: {
              search: "Suchen",
              submit: "Absenden"
            }
          },
          sections: {
            header: {
              title: "Kopfzeile"
            }
          }
        }, null, 2);

      case "assets/theme.css":
        return `/* Theme Global CSS */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
.nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
  font-family: var(--font-base);
}
.nav-link {
  text-decoration: none;
  color: var(--color-text);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.cart-counter {
  background-color: var(--color-accent);
  color: #000;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 99px;
  font-weight: 900;
}
.site-footer {
  margin-top: 60px;
  background-color: #050505;
  padding: 60px 0;
  border-top: 1px solid var(--color-border);
}
/* Grid columns */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.product-card {
  border: 1px solid var(--color-border);
  padding: 15px;
  background-color: #0d0d0d;
}
.product-card img {
  width: 100%;
  aspect-ratio: 3/4;
  object-cover: cover;
}
.quick-add-trigger {
  background-color: var(--color-accent);
  border: 0;
  color: #000;
  font-size: 9px;
  font-weight: 800;
  padding: 4px 10px;
  cursor: pointer;
}
.img-magnify-target {
  cursor: zoom-in;
  transition: transform 0.2s ease-out;
}
.zoom-magnifier-lens {
  position: absolute;
  pointer-events: none;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid white;
  display: none;
  background-repeat: no-repeat;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
}`;

      case "assets/theme.js":
        return `// Theme Javascript Engine - Handles variant selectors, magnifying zoom, dynamic filters
class ShopifyProductZoom {
  constructor() {
    this.container = document.getElementById('FeaturedMediaWrapper');
    this.img = document.getElementById('ProductMainImage');
    this.lens = document.getElementById('MagnifierLens');
    if (!this.container || !this.img || !this.lens) return;
    this.init();
  }
  init() {
    this.container.addEventListener('mousemove', (e) => this.zoom(e));
    this.container.addEventListener('mouseleave', () => this.hide());
  }
  zoom(e) {
    this.lens.style.display = 'block';
    const rect = this.img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Lens position
    let lensX = x - 60;
    let lensY = y - 60;
    this.lens.style.left = lensX + 'px';
    this.lens.style.top = lensY + 'px';
    
    // Background Zoom Ratio styling
    const ratioX = 2; // zoom level
    const ratioY = 2;
    this.lens.style.backgroundImage = \`url('\${this.img.src}')\`;
    this.lens.style.backgroundSize = \`\${this.img.width * ratioX}px \${this.img.height * ratioY}px\`;
    this.lens.style.backgroundPosition = \`-\${lensX * ratioX}px -\${lensY * ratioY}px\`;
  }
  hide() {
    this.lens.style.display = 'none';
  }
}

// Instantiate features
document.addEventListener('DOMContentLoaded', () => {
  new ShopifyProductZoom();
  initThumbnailHandlers();
});

function initThumbnailHandlers() {
  document.querySelectorAll('.thumbnail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mainImg = document.getElementById('ProductMainImage');
      if (mainImg) mainImg.src = btn.getAttribute('data-img-url');
    });
  });
}

function instantQuickAdd(id) {
  console.log("AJAX quick add triggered for Shopify Variant id: " + id);
  alert("SIMULATION DIRECTIVE: Added Product Variant to Ajax Cart. Ledger Counter updated.");
}`;

      case "config/settings_schema.json":
        return JSON.stringify([
          {
            name: "Theme Typography & Branding Settings",
            settings: [
              {
                type: "text",
                id: "brand_logo_text",
                label: "Logo Brand Text",
                default: settings.logoText
              },
              {
                type: "font_picker",
                id: "typography_family",
                label: "Primary Font Face",
                default: settings.fontFamily
              }
            ]
          },
          {
            name: "Global Ambient Colors",
            settings: [
              {
                type: "color",
                id: "color_accent",
                label: "Brand Accent Focus Color",
                default: settings.accentColor
              },
              {
                type: "color",
                id: "color_primary",
                label: "Hero Headers Text Color",
                default: settings.primaryColor
              },
              {
                type: "color",
                id: "color_bg",
                label: "Default Page Background",
                default: settings.bgColor
              }
            ]
          },
          {
            name: "Mobile UX & Performance Diagnostics",
            settings: [
              {
                type: "checkbox",
                id: "mobile_menu_fixed",
                label: "Prevent Mobile Nav Clipping",
                info: "Ensures the mobile navigation overlay expands seamlessly.",
                default: settings.mobileMenuFixed ?? true
              },
              {
                type: "checkbox",
                id: "horizontal_scroll_fixed",
                label: "Inhibit Horizontal Page Overflow",
                info: "Enforces strict width boundaries to prevent unwanted horizontal swipes.",
                default: settings.horizontalScrollFixed ?? true
              },
              {
                type: "checkbox",
                id: "tap_targets_fixed",
                label: "Enlarge Touch Targets (48px+)",
                info: "Boosts UX accessibility for mobile clicks.",
                default: settings.tapTargetsFixed ?? true
              },
              {
                type: "checkbox",
                id: "fluid_images_fixed",
                label: "Fluid Contain aspect ratio for images",
                info: "Utilizes CSS object-cover to prevent graphic squishing.",
                default: settings.fluidImagesFixed ?? true
              },
              {
                type: "checkbox",
                id: "lazy_loading_secured",
                label: "Enable Fallback Lazy Loading",
                info: "Speeds up initial painting for Core Web Vitals.",
                default: settings.lazyLoadingSecured ?? true
              }
            ]
          }
        ], null, 2);

      case "config/settings_data.json":
        return JSON.stringify({
          current: "Default",
          presets: {
            Default: {
              sections: {
                header: {
                  type: "header",
                  settings: {
                    logo_text: settings.logoText
                  }
                },
                footer: {
                  type: "footer",
                  settings: {
                    footer_heading: settings.logoText
                  }
                }
              }
            }
          }
        }, null, 2);

      case "locales/en.default.json":
        return JSON.stringify({
          general: {
            accessibility: {
              skip_to_content: "Skip to content",
              close: "Close"
            },
            search: {
              search: "Search",
              submit: "Submit"
            }
          },
          sections: {
            header: {
              title: "Header"
            }
          }
        }, null, 2);

      case "theme.toml":
        return `# Shopify CLI Theme configuration metadata file
[theme]
name = "${settings.logoText} Luxury Theme"
version = "1.0.0"
author = "Shopify Studio Dev Engine"
homepage = "https://shopify.com"
documentation = "https://shopify.dev/themes"`;

      case "root/INSTALLATION.md":
        return `# Shopify OS 2.0 Theme Assembly Guide

Follow these precise steps to upload and install this fully structured premium theme code source directly directly to your real Shopify store online dashboard:

## Step 1: Zip & Organize Directory Structure
Create a local ZIP package on your computer with the following nested directory structure:
\`\`\`text
${settings.logoText}-Theme-Source/
├── assets/
│   ├── theme.css
│   └── theme.js
├── config/
│   └── settings_schema.json
├── layout/
│   └── theme.liquid
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero-banner.liquid
│   ├── main-product.liquid
│   ├── main-collection.liquid
│   ├── featured-collection.liquid
│   ├── image-with-text.liquid
│   ├── testimonials-reviews.liquid
│   └── call-to-action.liquid
├── snippets/
│   ├── product-card.liquid
│   └── breadcrumbs.liquid
├── templates/
│   ├── index.json
│   ├── product.json
│   └── collection.json
└── theme.toml
\`\`\`

## Step 2: Upload into Shopify Administrative Portal
1. Navigate to your Shopify Admin Dashboard (e.g. \`your-store.myshopify.com/admin\`).
2. Navigate to **Online Store** > **Themes** inside the side panel.
3. In the "Theme Library" grid row panel, select **Add Theme** > **Upload ZIP File**.
4. Select the created \`theme.zip\` file package and submit.

## Step 3: Customize variables & Brand Typography
1. Click **Customize** to open Shopify's native WYSIWYG Theme Editor.
2. Select the top layout dropdown panels to customize headers, add product blocks, or select preset ambient color variables configured inside \`settings_schema.json\`.

---
*Created dynamically via generative development sandbox system.*`;

      default:
        return currentSection ? currentSection.liquidCode : `{% comment %} Fallback Empty State {% endcomment %}`;
    }
  };

  const activeContent = getFileContent(selectedFile);

  const triggerDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      
      filesList.forEach((file) => {
        const fileContent = getFileContent(file.path);
        if (file.dir === "root") {
          zip.file(file.name, fileContent);
        } else {
          zip.folder(file.dir)?.file(file.name, fileContent);
        }
      });
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${settings.logoText.toLowerCase().replace(/\s+/g, "-")}-shopify-theme.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate Shopify theme ZIP:", err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div id="shopify-code-exporter" className="h-full bg-[#0A0A0A] border-t md:border-t-0 md:border-l border-zinc-850 flex flex-col select-none text-zinc-300 font-sans">
      {/* Title bar banner */}
      <div className="p-4 border-b border-zinc-850 bg-[#070707] flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#D1FF26] flex items-center justify-center text-black font-black" style={{ backgroundColor: settings.accentColor }}>
              <Terminal className="w-4 h-4 text-black" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-[0.2em] block">Shopify Visual Sync</span>
              <h2 className="text-xs font-black uppercase text-white leading-none">Theme Package Exporter</h2>
            </div>
          </div>

          {/* View Mode Toggle Tabs */}
          <div className="flex bg-[#121212] p-0.5 border border-zinc-850 font-mono text-[10px]">
            <button
              onClick={() => setActiveViewMode("code")}
              className={`py-1.5 px-3 uppercase tracking-wider transition-all cursor-pointer ${
                activeViewMode === "code" 
                  ? "bg-amber-400 text-black font-black" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Liquid Code Explorer
            </button>
            <button
              onClick={() => setActiveViewMode("guard")}
              className={`py-1.5 px-3 uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === "guard" 
                  ? "bg-amber-400 text-black font-black" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gatekeeper Upload Guard</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {activeViewMode === "code" && (
            <button
              onClick={() => triggerDownload(selectedFile.split("/").pop() || "theme-file.txt", activeContent)}
              className="flex-1 sm:flex-initial text-[10px] bg-zinc-900 hover:bg-zinc-800 hover:text-white px-3 py-1.5 rounded-none font-bold uppercase tracking-widest border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer text-zinc-300 font-mono"
            >
              <FileDown className="w-3.5 h-3.5 text-[#D1FF26]" style={{ color: settings.accentColor }} />
              <span>Download File</span>
            </button>
          )}

          <button
            onClick={triggerDownloadZip}
            disabled={downloadingZip}
            className="flex-1 sm:flex-initial text-[10px] px-4 py-1.5 rounded-none font-bold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer text-black hover:opacity-90 transition-all font-mono"
            style={{ backgroundColor: settings.accentColor || "#D1FF26" }}
          >
            {downloadingZip ? (
              <>
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
                <span>COMPILING...</span>
              </>
            ) : (
              <>
                <Archive className="w-3.5 h-3.5" />
                <span>Export Complete Theme (.ZIP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {activeViewMode === "code" ? (
        /* Grid view containing layout */
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Sidebar file tree panel */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-zinc-850 bg-zinc-950/20 p-3 space-y-4 overflow-y-auto custom-scroll">
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block text-left">Liquid Theme Directories</span>
              
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold tracking-tight text-left">
                  <FolderOpen className="w-3.5 h-3.5 text-[#D1FF26]" style={{ color: settings.accentColor }} />
                  <span>${settings.logoText.toLowerCase()}-boutique/</span>
                </div>

                {/* Recursive simulated folder nodes */}
                <div className="pl-3.5 space-y-1 text-left">
                  {["layout", "templates", "sections", "snippets", "assets", "config", "root"].map((dirName) => {
                    const items = filesList.filter(f => f.dir === dirName);
                    if (items.length === 0) return null;

                    return (
                      <div key={dirName} className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                          <ChevronDown className="w-3 h-3 text-zinc-650" />
                          <span>{dirName === "root" ? "config-root/" : `${dirName}/`}</span>
                        </div>

                        <div className="pl-3.5 space-y-0.5">
                          {items.map((file) => {
                            const isActive = selectedFile === file.path;
                            return (
                              <button
                                key={file.path}
                                onClick={() => setSelectedFile(file.path)}
                                className={`w-full text-left flex items-center gap-2 py-1 px-1.5 rounded transition duration-150 cursor-pointer text-xs font-mono truncate ${
                                  isActive 
                                    ? "bg-amber-500/10 text-amber-350 font-black border-l-2 border-amber-500 rounded-none" 
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                                }`}
                              >
                                <FileCode className={`w-3.5 h-3.5 ${isActive ? "text-amber-500" : "text-zinc-650"}`} />
                                <span>{file.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-none text-left space-y-2 text-zinc-400 leading-normal font-sans uppercase tracking-wider">
              <div className="flex gap-1.5 items-center text-white font-bold text-[10px]">
                <Info className="w-3.5 h-3.5 text-[#D1FF26]" style={{ color: settings.accentColor }} />
                <span>Developer Insight</span>
              </div>
              <p className="text-[9px] text-zinc-500 font-mono normal-case leading-relaxed">
                These modular files align perfectly with Shopify OS 2.0 conventions. Feel free to copy them directly or use the ZIP layout described in INSTALLATION.md.
              </p>
            </div>
          </div>

          {/* Code representation file previewer */}
          <div className="md:col-span-8 flex flex-col overflow-hidden bg-black select-text">
            <div className="p-2.5 border-b border-zinc-900 bg-[#070707] flex items-center justify-between px-4">
              <span className="text-[10px] font-mono text-zinc-500 select-all">{selectedFile}</span>
              
              <button
                onClick={() => handleCopy(activeContent)}
                className="text-[10px] bg-[#0A0A0A] hover:bg-zinc-900 hover:text-white px-3 py-1.5 rounded-none font-mono border border-zinc-800 flex items-center gap-1.5 cursor-pointer text-zinc-300 font-bold"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D1FF26]" style={{ color: settings.accentColor }} />
                    <span>COPY CODE</span>
                  </>
                )
              }
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5 text-left bg-[#050505] selection:bg-[#333] selection:text-white custom-scroll select-text">
              <pre className="font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap select-text selection:bg-amber-500/30">
                {activeContent}
              </pre>
            </div>
          </div>

        </div>
      ) : (
        <UploadGuard 
          settings={settings}
          sections={sections}
          getThemeFileContent={getFileContent}
        />
      )}
    </div>
  );
}
