import React, { useState } from "react";
import { ThemeSettings, ThemeSection, CartItem } from "../types";
import { 
  Laptop, 
  Smartphone, 
  Tablet as TabletIcon, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Menu, 
  Search, 
  User, 
  MapPin, 
  Star,
  CheckCircle,
  Gift,
  Plus,
  Minus,
  Trash2,
  Tag,
  ChevronDown,
  Check,
  ChevronRight,
  Info,
  X,
  CreditCard,
  Truck
} from "lucide-react";

interface PreviewStoreProps {
  settings: ThemeSettings;
  sections: ThemeSection[];
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  activePage: "home" | "product" | "collection" | "cart";
  onChangePage?: (page: "home" | "product" | "collection" | "cart") => void;
  cart?: CartItem[];
  onUpdateCart?: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function PreviewStore({
  settings,
  sections,
  selectedSectionId,
  onSelectSection,
  activePage,
  onChangePage,
  cart = [],
  onUpdateCart
}: PreviewStoreProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "apparel" | "outerwear" | "accessories">("all");
  const [mobileMenuDrawerOpen, setMobileMenuDrawerOpen] = useState(false);
  const [showMobileMenuError, setShowMobileMenuError] = useState(false);
  
  // Standard list of customizable sandbox products
  const catalogProducts = [
    {
      id: "mac-01",
      title: "Oversized Mac",
      price: "$420.00",
      numericPrice: 420,
      tag: "Best Seller",
      category: "outerwear",
      imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600",
      description: "An ultra-premium tailored luxury coat engineered for an elegant oversized draping drape. Spun from high-durability double-faced wool, it features deep welt pockets, raw seams, and real horn buttons.",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Charcoal", "Sage Green", "Camel"],
      rating: 4.8,
      reviewsCount: 142
    },
    {
      id: "boots-01",
      title: "Brutalist Chelsea Boots",
      price: "$340.00",
      numericPrice: 340,
      tag: "Collection 01",
      category: "accessories",
      imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600",
      description: "Robust high-profile Chelsea boots engineered in Italy. Built with full-grain calfskin leather, elasticized side panels, and extra-thick reinforced Vibram grip lug outsoles.",
      sizes: ["8", "9", "10", "11", "12"],
      colors: ["Matte Black", "Raw Umber"],
      rating: 4.9,
      reviewsCount: 88
    },
    {
      id: "beanie-01",
      title: "Ribbed Knit Beanie",
      price: "$85.00",
      numericPrice: 85,
      tag: "Essential",
      category: "apparel",
      imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d435350?w=600",
      description: "Spun from ultrafine grade Mongolian cashmere wool. Incredible moisture-wicking and thermal properties with a classic double-rolled cuff alignment.",
      sizes: ["One Size"],
      colors: ["Midnight", "Ivory Cream", "Burnt Orange"],
      rating: 4.7,
      reviewsCount: 224
    },
    {
      id: "trainer-01",
      title: "Performance Lite Trainer",
      price: "$145.00",
      numericPrice: 145,
      tag: "New Arrival",
      category: "accessories",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      description: "Featherlight training sneaker with shock-absorbent active midsoles. Composed of recycled ocean mesh materials for high ventilation.",
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["Neon Lime", "Alpine Frost"],
      rating: 4.6,
      reviewsCount: 71
    },
    {
      id: "backpack-01",
      title: "Sleek Leather Backpack",
      price: "$290.00",
      numericPrice: 290,
      tag: "LTD Release",
      category: "accessories",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
      description: "Minimalist waterproof commuter bag with integrated padded laptop sleeve and high-grade metal closures.",
      sizes: ["One Size"],
      colors: ["Midnight Slate", "Saddle Tan"],
      rating: 4.9,
      reviewsCount: 115
    },
    {
      id: "trench-01",
      title: "Asymmetric Trench Coat",
      price: "$380.00",
      numericPrice: 380,
      tag: "Archival",
      category: "outerwear",
      imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
      description: "Modernized double-breasted weather trench with a loose fluid silhouette and adjustable wrist toggles.",
      sizes: ["S", "M", "L"],
      colors: ["Onyx Black", "Sand Dune"],
      rating: 4.7,
      reviewsCount: 92
    }
  ];

  // Active product zoomed view model
  const [selectedProduct, setSelectedProduct] = useState(catalogProducts[0]);
  const [productQty, setProductQty] = useState(1);
  const [productSize, setProductSize] = useState(catalogProducts[0].sizes[0]);
  const [productColor, setProductColor] = useState(catalogProducts[0].colors[0]);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  
  // Checkout states
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "complete">("cart");
  const [billingName, setBillingName] = useState("");

  // Map settings radii to Tailwind styles
  const getRadiusClass = () => {
    switch (settings.borderRadius) {
      case "none": return "rounded-none";
      case "md": return "rounded-lg";
      case "xl": return "rounded-2xl";
      case "full": return "rounded-full";
      default: return "rounded-lg";
    }
  };

  const getFontFamilyStyle = () => {
    switch (settings.fontFamily) {
      case "Inter": return "font-sans";
      case "Space Grotesk": return "font-sans tracking-tight font-light";
      case "Playfair Display": return "font-serif font-semibold";
      case "JetBrains Mono": return "font-mono tracking-tighter text-xs";
      default: return "";
    }
  };

  const getContainerWidthStyle = () => {
    switch (deviceMode) {
      case "mobile": return `max-w-[375px] border-[10px] border-slate-950 rounded-[2.5rem] shadow-2xl h-[700px] ${settings.horizontalScrollFixed ? "overflow-x-hidden" : "overflow-x-auto"} overflow-y-auto`;
      case "tablet": return `max-w-[768px] border-[8px] border-slate-950 rounded-[1.5rem] shadow-xl h-[850px] ${settings.horizontalScrollFixed ? "overflow-x-hidden" : "overflow-x-auto"} overflow-y-auto`;
      default: return `w-full min-h-[900px] ${settings.horizontalScrollFixed ? "overflow-x-hidden" : "overflow-x-auto"}`;
    }
  };

  // Adding item to dynamic cart state
  const handleAddToCart = (product: { title: string; price: string; imageUrl: string; numericPrice?: number }) => {
    if (!onUpdateCart) return;
    
    onUpdateCart(prev => {
      const existing = prev.find(item => item.title === product.title);
      if (existing) {
        return prev.map(item => item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: Date.now().toString(),
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      }];
    });

    setCartDrawerOpen(true);
  };

  // Custom Product detail add trigger
  const handleProductDetailSubmit = () => {
    if (!onUpdateCart) return;
    
    onUpdateCart(prev => {
      const existing = prev.find(item => item.title === `${selectedProduct.title} (${productSize} / ${productColor})`);
      if (existing) {
        return prev.map(item => item.title === `${selectedProduct.title} (${productSize} / ${productColor})`
          ? { ...item, quantity: item.quantity + productQty }
          : item
        );
      }
      return [...prev, {
        id: Date.now().toString(),
        title: `${selectedProduct.title} (${productSize} / ${productColor})`,
        price: selectedProduct.price,
        imageUrl: selectedProduct.imageUrl,
        quantity: productQty
      }];
    });

    setCartDrawerOpen(true);
    setProductQty(1);
  };

  const handleUpdateQty = (title: string, amt: number) => {
    if (!onUpdateCart) return;
    onUpdateCart(prev => prev.map(item => {
      if (item.title === title) {
        const nextQty = item.quantity + amt;
        return nextQty > 0 ? { ...item, quantity: nextQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveFromCart = (title: string) => {
    if (!onUpdateCart) return;
    onUpdateCart(prev => prev.filter(item => item.title !== title));
  };

  // Apply coupons logic
  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponSuccess("");
    const cleanCode = couponCode.trim().toUpperCase();
    
    if (cleanCode === "ARCHIVE20" || cleanCode === "SF20") {
      setDiscountPercent(20);
      setCouponSuccess("20% VIP Coupon code applied successfully!");
    } else {
      setCouponError("Invalid coupon code. Try using 'ARCHIVE20'.");
    }
  };

  // Switch to specific product
  const handleProductClick = (prod: typeof catalogProducts[0]) => {
    setSelectedProduct(prod);
    setProductSize(prod.sizes[0]);
    setProductColor(prod.colors[0]);
    setProductQty(1);
    if (onChangePage) {
      onChangePage("product");
    }
  };

  // Subtotal calculations
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const rawPrice = parseFloat(item.price.replace(/[$,]/g, ""));
      return sum + (isNaN(rawPrice) ? 0 : rawPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * discountPercent) / 100;
  const isFreeShipping = subtotal > 150 || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 15;
  const grandTotal = subtotal - discountAmount + shippingCost;

  // Filter sections by page template
  const pageSections = sections.filter(sec => (sec.page || "home") === activePage);

  return (
    <div className="flex-1 bg-slate-950 p-4 md:p-6 flex flex-col h-full overflow-hidden select-none font-sans">
      {/* Device Toolbar Controls & Simulated Quick Page Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Device View</span>
          <div className="flex bg-[#0A0A0A] p-0.5 border border-zinc-805">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-2 transition-all cursor-pointer ${
                deviceMode === "desktop" ? "bg-[#D1FF26] text-black font-black" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Desktop Screen View"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode("tablet")}
              className={`p-2 transition-all cursor-pointer ${
                deviceMode === "tablet" ? "bg-[#D1FF26] text-black font-black" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Tablet Screen View"
            >
              <TabletIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-2 transition-all cursor-pointer ${
                deviceMode === "mobile" ? "bg-[#D1FF26] text-black font-black" : "text-zinc-500 hover:text-zinc-300"
              }`}
              title="Mobile Screen View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Page Select Control Panel */}
        <div className="flex items-center gap-1.5 bg-zinc-900/60 p-1 border border-zinc-800 font-mono text-[10px]">
          <button 
            onClick={() => onChangePage?.("home")}
            className={`px-2.5 py-1 transition-all capitalize ${activePage === "home" ? "text-white font-black bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Home template
          </button>
          <button 
            onClick={() => {
              setSelectedCategory("all");
              onChangePage?.("collection");
            }}
            className={`px-2.5 py-1 transition-all capitalize ${activePage === "collection" ? "text-white font-black bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Collections Grid
          </button>
          <button 
            onClick={() => onChangePage?.("product")}
            className={`px-2.5 py-1 transition-all capitalize ${activePage === "product" ? "text-white font-black bg-zinc-800" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Product Detail Page
          </button>
          <button 
            onClick={() => {
              onChangePage?.("cart");
              setCheckoutStep("cart");
            }}
            className={`px-2.5 py-1 transition-all capitalize ${activePage === "cart" ? "text-white font-black bg-zinc-800 relative" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            Shop Cart ({cart.reduce((s, c) => s + c.quantity, 0)})
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D1FF26]" />}
          </button>
        </div>
      </div>

      {/* Frame Centering Canvas Applet container representing browser context */}
      <div className="flex-1 flex justify-center items-start overflow-y-auto custom-scroll p-1">
        <div 
          style={{ 
            backgroundColor: settings.bgColor,
            color: settings.bgColor === "#ffffff" ? "#111111" : "#ffffff"
          }}
          className={`w-full transition-all duration-300 pb-16 shadow-2xl relative ${getContainerWidthStyle()}`}
        >
          {/* Header Bar */}
          <header 
            style={{ 
              borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
              backgroundColor: settings.bgColor 
            }}
            className="border-b sticky top-0 z-40 backdrop-blur-md"
          >
            {/* Promo Sale Banner Notification Line */}
            <div 
              className="text-center text-[10px] font-mono font-black uppercase tracking-[0.2em] py-2 px-4 flex items-center justify-center gap-2" 
              style={{ 
                backgroundColor: settings.bgColor === "#ffffff" ? "#111111" : "#050505",
                color: settings.bgColor === "#ffffff" ? "#D1FF26" : "#D1FF26",
                borderBottom: settings.bgColor === "#ffffff" ? "none" : "1px solid rgba(255, 255, 255, 0.05)"
              }}
            >
              <Gift className="w-3 h-3 text-[#D1FF26]" style={{ color: settings.accentColor }} />
              <span>Complimentary Worldwide Delivery on all orders above $150</span>
            </div>

            {/* LCP performance metric status bar based on lazy loading */}
            <div 
              className={`text-center py-1.5 px-4 flex items-center justify-center gap-1.5 border-b font-mono text-[9px] uppercase tracking-wider ${
                settings.lazyLoadingSecured
                  ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                  : "bg-amber-950/20 text-text-amber-500 text-amber-500 border-amber-900/30"
              }`}
            >
              {settings.lazyLoadingSecured ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>PREVIEW MOBILE SCORE: <span className="font-bold underline text-white">LCP 1.2s (PASSED)</span>. Lazy loading active.</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
                  <span>MOBILE AUDIT ALERT: <span className="font-bold underline text-white">LCP 4.8s (CRITICAL LAG)</span>. Missing lazy-load.</span>
                </>
              )}
            </div>
            
            <div className="px-6 md:px-12 py-5 flex items-center justify-between">
              <div className="flex items-center gap-8 lg:gap-12">
                <Menu 
                  className="w-5 h-5 cursor-pointer md:hidden" 
                  style={{ color: settings.bgColor === "#ffffff" ? "#000000" : "#ffffff" }}
                  onClick={() => {
                    if (settings.mobileMenuFixed) {
                      setMobileMenuDrawerOpen(true);
                    } else {
                      setShowMobileMenuError(true);
                      setTimeout(() => setShowMobileMenuError(false), 5500);
                    }
                  }}
                />
                
                <span 
                  onClick={() => onChangePage?.("home")}
                  style={{ color: settings.bgColor === "#ffffff" ? "#000000" : "#ffffff" }}
                  className="text-lg md:text-xl font-black tracking-tighter uppercase font-sans cursor-pointer select-none"
                >
                  {settings.logoText || "NOVA.STORE"}
                </span>

                {/* Primary store links with active Hover Trigger for Mega Menu */}
                <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  <div 
                    className="relative py-2 cursor-pointer hover:text-[#D1FF26] transition-all"
                    onMouseEnter={() => setMegaMenuOpen(true)}
                    onClick={() => {
                      setMegaMenuOpen(!megaMenuOpen);
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <span>Collections</span>
                      <ChevronDown className="w-3 h-3 text-zinc-500" />
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setSelectedCategory("outerwear");
                      onChangePage?.("collection");
                    }}
                    className="hover:text-white transition-opacity cursor-pointer py-2"
                  >
                    New Arrivals
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedCategory("all");
                      onChangePage?.("collection");
                    }}
                    className="hover:text-white transition-opacity cursor-pointer py-2"
                  >
                    Shop Catalog
                  </button>

                  <a 
                    href="#footer-brand"
                    className="hover:text-white transition-opacity cursor-pointer py-2"
                  >
                    Contact
                  </a>
                </nav>
              </div>

              {/* Header Right utilities button slots */}
              <div className="flex items-center gap-5 text-[11px] font-mono uppercase tracking-widest">
                <button 
                  onClick={() => {
                    setSelectedCategory("all");
                    onChangePage?.("collection");
                  }}
                  className="cursor-pointer hover:text-white text-zinc-400 flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden lg:inline text-[10px]">Search</span>
                </button>
                
                <button 
                  onClick={() => {
                    setCartDrawerOpen(true);
                  }}
                  style={{ 
                    backgroundColor: settings.accentColor, 
                    color: "#000000" 
                  }}
                  className="px-4 py-1.5 bg-[#D1FF26] rounded-none font-bold text-[10px] tracking-tight cursor-pointer hover:bg-opacity-95 active:scale-95 transition-all text-black flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Cart ({cart.reduce((s, c) => s + c.quantity, 0)})</span>
                </button>
              </div>
            </div>

            {/* INTEGRATED MEGA MENU */}
            {megaMenuOpen && (
              <div 
                className="absolute left-0 right-0 w-full bg-[#0E0E0E] text-white border-t border-b border-zinc-800 z-50 p-8 shadow-2xl transition-all duration-300 text-left"
                style={{ 
                  backgroundColor: settings.bgColor === "#ffffff" ? "#FFFFFF" : "#0A0A0A",
                  borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)",
                  color: settings.bgColor === "#ffffff" ? "#000000" : "#FFFFFF"
                }}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Column 1: Store Categories */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D1FF26]" style={{ color: settings.accentColor }}>Product Lines</h4>
                    <ul className="space-y-2 text-xs font-semibold text-zinc-400">
                      <li>
                        <button 
                          onClick={() => { 
                            setSelectedCategory("all"); 
                            onChangePage?.("collection"); 
                            setMegaMenuOpen(false); 
                          }} 
                          className="hover:text-white hover:opacity-100 transition-opacity"
                        >
                          All Architecture Collections
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { 
                            setSelectedCategory("outerwear"); 
                            onChangePage?.("collection"); 
                            setMegaMenuOpen(false); 
                          }} 
                          className="hover:text-white hover:opacity-100 transition-opacity"
                        >
                          Minimal Outerwear Co.
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { 
                            setSelectedCategory("apparel"); 
                            onChangePage?.("collection"); 
                            setMegaMenuOpen(false); 
                          }} 
                          className="hover:text-white hover:opacity-100 transition-opacity"
                        >
                          Merino Cashmere Knits
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => { 
                            setSelectedCategory("accessories"); 
                            onChangePage?.("collection"); 
                            setMegaMenuOpen(false); 
                          }} 
                          className="hover:text-white hover:opacity-100 transition-opacity"
                        >
                          Tactical Footwear & Backpacks
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Column 2: Specific product hot redirects */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Trending Drops</h4>
                    <ul className="space-y-2 text-xs font-semibold text-zinc-400">
                      {catalogProducts.map(prod => (
                        <li key={prod.id}>
                          <button 
                            onClick={() => {
                              handleProductClick(prod);
                              setMegaMenuOpen(false);
                            }} 
                            className="hover:text-white hover:opacity-100 transition-opacity flex items-center justify-between w-full"
                          >
                            <span>{prod.title}</span>
                            <span className="text-[9px] font-mono text-zinc-500 font-normal">{prod.price}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: Visual editorial launch poster */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-zinc-900" style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}>
                    <img 
                      src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&fit=crop" 
                      alt="Mega Menu Drop"
                      className="w-full h-full object-cover brightness-75 hover:scale-105 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end text-white">
                      <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#D1FF26]" style={{ color: settings.accentColor }}>Editorial Focus</span>
                      <h5 className="text-[11px] font-bold uppercase tracking-tight">Oversized Brutal Draping</h5>
                    </div>
                  </div>

                  {/* Column 4: Coupon Banner promotions */}
                  <div className="flex flex-col justify-between p-5 bg-zinc-900/60 border border-zinc-805 text-left text-zinc-300" style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}>
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 block">VIP Discount Code</span>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#D1FF26]" style={{ color: settings.accentColor }}>ARCHIVE20</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal font-light">
                        Apply this code at Checkout to simulate a 20% discount on entire cart. Fully interactive!
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedCategory("all");
                        onChangePage?.("collection");
                        setMegaMenuOpen(false);
                      }}
                      className="text-[10px] font-black uppercase text-white hover:text-[#D1FF26] transition-colors flex items-center gap-1.5 pt-4 border-t border-zinc-800"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.2 h-3.2 text-[#D1FF26]" style={{ color: settings.accentColor }} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* HORIZONTAL OVERFLOW BREAK BREAKER */}
          {!settings.horizontalScrollFixed && (
            <div className="w-[490px] bg-amber-950/20 border-b border-amber-900/30 p-4 text-left relative z-20 text-amber-300 font-mono text-[10px]" id="horizontal-scroll-overflow-fault-banner">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping shrink-0" />
                <span className="uppercase text-amber-400">[LAYOUT BOUNDS EXCEEDED - Fault: SHP-M01]</span>
              </div>
              <p className="text-[9px] mt-1 text-amber-400/80 leading-relaxed font-light">
                An un-fluid, hardcoded custom grid pushes viewport widths out past typical smartphone boundaries, spawning horizontal scroll breaks! Turn on the <strong>fluid wrapper</strong> in Customizer Diagnostics to rectify.
              </p>
            </div>
          )}

          {/* Simulating a non-functional hamburger-menu alert banner */}
          {showMobileMenuError && (
            <div className="absolute top-24 left-4 right-4 bg-rose-950/95 border border-rose-800 text-rose-300 p-3.5 z-50 flex items-start gap-2.5 rounded-lg shadow-2xl animate-fade-in font-sans" id="mobile-menu-fault-error-toast">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1 animate-pulse" />
              <div className="text-left text-[11px]">
                <h5 className="font-mono font-black text-[9px] uppercase tracking-wider text-rose-400">FAULTS DETECTED: SHP-M02</h5>
                <p className="leading-relaxed mt-1 font-light text-rose-400/90">
                  Mobile Menu drawer is completely **ABSENT** from layout configuration snippet sheets, making standard hamburger triggers un-clickable. Turn on <strong>Hamburger Drawer</strong> under layout customizer diagnostics to fix.
                </p>
              </div>
            </div>
          )}

          {/* SLIDEOUT MOBILE NAVIGATION DRAWER OVERLAY */}
          {settings.mobileMenuFixed && mobileMenuDrawerOpen && (
            <div className="absolute inset-y-0 left-0 right-0 h-full bg-black/75 backdrop-blur-xs z-50 flex justify-start animate-fade-in" id="mobile-menu-drawer-panel">
              <div 
                className="w-10/12 max-w-[280px] h-full bg-[#121212] border-r border-zinc-800 p-6 flex flex-col justify-between text-left shadow-2xl transition-all"
                style={{ 
                  backgroundColor: settings.bgColor === "#ffffff" ? "#FFFFFF" : "#0A0A0A",
                  borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)",
                  color: settings.bgColor === "#ffffff" ? "#111111" : "#FFFFFF"
                }}
              >
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-zinc-900/60" style={{ borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
                    <span 
                      style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "#FFFFFF" }} 
                      className="text-xs font-black uppercase tracking-wider font-sans"
                    >
                      Store Navigation
                    </span>
                    <button 
                      onClick={() => setMobileMenuDrawerOpen(false)}
                      className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <nav className="space-y-6 pt-8 font-sans font-black uppercase text-xs tracking-[0.15em]">
                    <button 
                      onClick={() => {
                        onChangePage?.("home");
                        setMobileMenuDrawerOpen(false);
                      }}
                      className="block w-full text-left py-1 text-zinc-450 hover:text-white transition-colors"
                      style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "" }}
                    >
                      Home
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCategory("all");
                        onChangePage?.("collection");
                        setMobileMenuDrawerOpen(false);
                      }}
                      className="block w-full text-left py-1 text-zinc-450 hover:text-white transition-colors"
                      style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "" }}
                    >
                      Collections Catalog
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCategory("outerwear");
                        onChangePage?.("collection");
                        setMobileMenuDrawerOpen(false);
                      }}
                      className="block w-full text-left py-1 text-zinc-450 hover:text-white transition-colors"
                      style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "" }}
                    >
                      New Arrivals
                    </button>
                    <button 
                      onClick={() => {
                        onChangePage?.("cart");
                        setMobileMenuDrawerOpen(false);
                      }}
                      className="block w-full text-left py-1 text-zinc-450 hover:text-white transition-colors"
                      style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "" }}
                    >
                      Shopping Cart ({cart.reduce((s, c) => s + c.quantity, 0)})
                    </button>
                  </nav>
                </div>

                <div 
                  className="p-4 bg-zinc-900/60 text-left border border-zinc-800 rounded text-zinc-300"
                  style={{ 
                    backgroundColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.01)",
                    borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)"
                  }}
                >
                  <span className="text-[8px] font-mono tracking-widest text-[#D1FF26] uppercase block mb-1" style={{ color: settings.accentColor }}>VIP COUPON ACTIVE</span>
                  <p className="text-[10px] text-zinc-400 leading-normal font-light" style={{ color: settings.bgColor === "#ffffff" ? "#666666" : "" }}>
                    Apply <strong className="font-mono text-[#D1FF26] font-bold" style={{ color: settings.accentColor }}>ARCHIVE20</strong> during sandbox checkout for 20% savings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC INTEGRATED LIVE PAGES */}
          
          <main className="space-y-0 text-left animate-fade-in">
            {pageSections.length === 0 ? (
              <div className="py-24 px-6 text-center max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-zinc-800 text-zinc-400 flex items-center justify-center shadow">
                  <Info className="w-8 h-8 text-zinc-500" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">This page doesn't have any sections</h2>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-md mx-auto">
                  Online Store 2.0 uses dynamic templates. On the left panel, add customizable presets like header banners, catalog grids, product specifications, or checkout ledger forms to design this page style layout.
                </p>
              </div>
            ) : (
              pageSections.map((section) => {
                const isSelected = selectedSectionId === section.sectionId;
                const isAi = section.sectionId.includes("-ai-");

                return (
                  <div
                    key={section.sectionId}
                    onClick={(e) => {
                      onSelectSection(section.sectionId);
                    }}
                    className={`relative group cursor-pointer transition-all duration-250 ${
                      isSelected 
                        ? "ring-2 ring-emerald-400 bg-emerald-400/[0.01]" 
                        : "hover:ring-1 hover:ring-zinc-700"
                    }`}
                  >
                    {/* Visual Hover Badge Indicators */}
                    {isSelected && (
                      <span className="absolute top-2 right-2 z-30 bg-[#D1FF26] text-black font-sans font-black text-[9px] uppercase px-2 py-1 flex items-center gap-1" style={{ backgroundColor: settings.accentColor }}>
                        Editing {isAi && <Sparkles className="w-2.5 h-2.5 text-black" />}
                      </span>
                    )}
                    
                    {/* Render appropriate section visual preset */}
                    {renderSection(
                      section, 
                      settings, 
                      getFontFamilyStyle, 
                      getRadiusClass, 
                      handleProductClick, 
                      handleAddToCart,
                      {
                        selectedProduct,
                        productColor,
                        setProductColor,
                        productSize,
                        setProductSize,
                        onChangePage,
                        catalogProducts,
                        selectedCategory,
                        setSelectedCategory,
                        checkoutStep,
                        setCheckoutStep,
                        cart,
                        onUpdateCart,
                        handleUpdateQty,
                        handleRemoveFromCart,
                        subtotal,
                        discountPercent,
                        discountAmount,
                        isFreeShipping,
                        grandTotal,
                        couponCode,
                        setCouponCode,
                        handleApplyCoupon,
                        couponError,
                        couponSuccess,
                        billingName,
                        setBillingName,
                        productQty,
                        setProductQty,
                        handleProductDetailSubmit
                      }
                    )}
                  </div>
                );
              })
            )}
          </main>

          {false && (<>

          {/* 2. COLLECTION CATALOG PAGE */}
          {activePage === "collection" && (
            <main className="px-6 md:px-12 py-10 text-left">
              <div className="mb-10 text-left border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">Authentic curation</span>
                  <h1 className={`text-4xl font-black uppercase tracking-tighter ${getFontFamilyStyle()}`}>BRUTALIST ARCHIVES</h1>
                  <p className="text-xs text-zinc-400 max-w-sm mt-1 leading-relaxed">
                    Skaters, artists, and innovators engineered into a unified garment blueprint.
                  </p>
                </div>

                {/* Subcategory selectors */}
                <div className="flex flex-wrap bg-[#111111]/80 p-1 border border-zinc-800 font-mono text-[10px]">
                  {(["all", "apparel", "outerwear", "accessories"] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 uppercase tracking-wider ${
                        selectedCategory === cat 
                          ? "bg-[#D1FF26] text-black font-black" 
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cat === "all" ? "All categories" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Catalog Display Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {catalogProducts
                  .filter(prod => selectedCategory === "all" || prod.category === selectedCategory)
                  .map(prod => (
                    <div 
                      key={prod.id}
                      className="group flex flex-col justify-between border border-zinc-805 bg-zinc-950 p-5 hover:border-zinc-700 transition-all duration-300 relative text-left"
                      style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}
                    >
                      {/* Product Media Column */}
                      <div 
                        onClick={() => handleProductClick(prod)}
                        className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden cursor-pointer mb-5"
                        style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "8px" }}
                      >
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                          referrerPolicy="no-referrer"
                        />
                        {prod.tag && (
                          <span 
                            className="absolute top-3 left-3 text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded text-black bg-[#D1FF26]"
                            style={{ backgroundColor: settings.accentColor }}
                          >
                            {prod.tag}
                          </span>
                        )}
                      </div>

                      {/* Info lines */}
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 
                            onClick={() => handleProductClick(prod)}
                            className="text-sm font-black uppercase select-none cursor-pointer text-white hover:text-[#D1FF26]"
                          >
                            {prod.title}
                          </h3>
                          <span className="text-[11px] font-mono tracking-tight text-zinc-400 shrink-0 font-bold">{prod.price}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-light leading-relaxed mb-6 line-clamp-2 italic">
                          {prod.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button 
                          onClick={() => handleProductClick(prod)}
                          className="border border-zinc-800 hover:border-zinc-600 text-white font-black uppercase py-2.5 text-[9px] tracking-widest text-center"
                          style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" }}
                        >
                          View Specs
                        </button>
                        <button 
                          onClick={() => handleAddToCart(prod)}
                          className="font-black uppercase py-2.5 text-[9px] tracking-widest text-[#000000] hover:opacity-90 transition-all select-none bg-[#D1FF26]"
                          style={{ 
                            backgroundColor: settings.accentColor,
                            color: "#000000",
                            borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" 
                          }}
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </main>
          )}

          {/* 3. PRODUCT SPECIFICATIONS DETAIL PAGE */}
          {activePage === "product" && (
            <main className="px-6 md:px-12 py-10 text-left">
              <button 
                onClick={() => onChangePage?.("collection")}
                className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-2 mb-8"
              >
                ← Back to Catalog
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left side media Column */}
                <div className="lg:col-span-6 space-y-4">
                  <div 
                    className="relative aspect-[3/4] bg-zinc-900 overflow-hidden border border-zinc-850"
                    style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "16px" }}
                  >
                    <img 
                      src={selectedProduct.imageUrl} 
                      alt={selectedProduct.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-black/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-zinc-300">
                      Studio Spec No. {selectedProduct.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Right side interactive content details */}
                <div className="lg:col-span-6 space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#D1FF26]/10 text-[#D1FF26] font-mono px-2 py-0.5 uppercase tracking-widest rounded">
                        {selectedProduct.tag || "PREMIUM CAPABILITIES"}
                      </span>
                      <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">SKU: SHP-2026-{selectedProduct.id}</span>
                    </div>

                    <h1 className={`text-4xl font-black uppercase text-white tracking-tighter ${getFontFamilyStyle()}`}>
                      {selectedProduct.title}
                    </h1>

                    <div className="flex items-center gap-4">
                      <p className="text-xl font-mono text-[#D1FF26] font-extrabold">{selectedProduct.price}</p>
                      
                      {/* Rating displays */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">({selectedProduct.reviewsCount} customer metrics)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-light font-sans max-w-lg italic">
                    {selectedProduct.description}
                  </p>

                  {/* Interactivity: Color swatch selection */}
                  <div className="space-y-3 border-t border-zinc-900 pt-5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Available Color tones:</span>
                    <div className="flex gap-2">
                      {selectedProduct.colors.map(col => (
                        <button
                          key={col}
                          onClick={() => setProductColor(col)}
                          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-all ${
                            productColor === col 
                              ? "bg-white text-black font-extrabold border-transparent" 
                              : "bg-transparent text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-600"
                          }`}
                          style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "4px" }}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactivity: Size Selection options */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Select Size specifications:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map(sz => (
                        <button
                          key={sz}
                          onClick={() => setProductSize(sz)}
                          className={`w-12 h-10 text-xs font-mono font-bold uppercase flex items-center justify-center border transition-all ${
                            productSize === sz 
                              ? "bg-[#D1FF26] text-black border-transparent font-black" 
                              : "bg-transparent text-zinc-500 hover:text-white border-zinc-800 hover:border-zinc-600"
                          }`}
                          style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "4px" }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity and Checkout Add Buttons */}
                  <div className="space-y-4 border-t border-zinc-900 pt-6">
                    <div className="flex items-center gap-4">
                      {/* Quantity counter widget */}
                      <div className="flex items-center bg-[#111111] border border-zinc-805 h-12">
                        <button 
                          onClick={() => setProductQty(Math.max(1, productQty - 1))}
                          className="w-10 text-zinc-400 hover:text-white h-full flex items-center justify-center border-r border-zinc-805"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 font-mono text-center text-xs font-bold text-white">{productQty}</span>
                        <button 
                          onClick={() => setProductQty(productQty + 1)}
                          className="w-10 text-zinc-400 hover:text-white h-full flex items-center justify-center border-l border-zinc-805"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Submit to Cart trigger */}
                      <button
                        onClick={handleProductDetailSubmit}
                        className="flex-1 h-12 px-8 font-black uppercase text-xs tracking-widest hover:opacity-95 text-black hover:shadow-lg transition-all flex items-center justify-center gap-2.5 bg-[#D1FF26] cursor-pointer"
                        style={{ 
                          backgroundColor: settings.accentColor,
                          color: "#111111",
                          borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" 
                        }}
                      >
                        <ShoppingBag className="w-4.5 h-4.5" />
                        <span>Add spec to order: {selectedProduct.price}</span>
                      </button>
                    </div>
                  </div>

                  {/* Safety icons check */}
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider pt-4 border-t border-zinc-900">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#D1FF26]" />
                      <span>Complimentary Shipping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#D1FF26]" />
                      <span>30-Day Material Warranty</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}

          {/* 4. ACTIVE CART DRAWERS & CHECKOUT INVOICE */}
          {activePage === "cart" && (
            <main className="px-6 md:px-12 py-10 text-left">
              {checkoutStep === "cart" ? (
                <>
                  <div className="mb-10 text-left border-b border-zinc-900 pb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D1FF26]">Active Order Ledger</span>
                    <h1 className={`text-3xl font-black uppercase tracking-tighter ${getFontFamilyStyle()}`}>SHOPPING CART REPORT</h1>
                    <p className="text-xs text-zinc-500 mt-1">Review items, verify quantities, and utilize coupon codes before checkout.</p>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-zinc-90 w-full" style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}>
                      <ShoppingBag className="w-12 h-12 text-zinc-650 mx-auto mb-4" />
                      <h3 className="text-sm font-black uppercase text-zinc-300">Your Basket is Empty</h3>
                      <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-2 leading-relaxed font-sans">
                        You have not selected any custom items yet. Visit our Collections Grid to choose apparel.
                      </p>
                      <button 
                        onClick={() => onChangePage?.("collection")}
                        className="mt-6 px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest"
                        style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" }}
                      >
                        Browse items
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                      {/* Left Column: Cart items table */}
                      <div className="lg:col-span-8 space-y-4">
                        {cart.map(item => {
                          const itemSub = (parseFloat(item.price.replace(/[$,]/g, "")) * item.quantity).toFixed(2);
                          return (
                            <div 
                              key={item.id}
                              className="p-5 bg-zinc-950 border border-zinc-805 flex flex-col sm:flex-row items-center justify-between gap-6"
                              style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.title} 
                                  className="w-16 h-20 object-cover bg-zinc-900 shrink-0 border border-zinc-850"
                                />
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-tight text-white line-clamp-1">{item.title}</h4>
                                  <p className="text-[10px] font-mono text-[#D1FF26] mt-1">{item.price}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-8 self-center sm:self-auto uppercase tracking-wide">
                                <div className="flex items-center bg-[#111111] border border-zinc-805 h-9">
                                  <button 
                                    onClick={() => handleUpdateQty(item.title, -1)}
                                    className="w-8 text-zinc-500 hover:text-white h-full flex items-center justify-center border-r border-zinc-805"
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span className="w-8 font-mono text-center text-xs font-bold text-white">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleUpdateQty(item.title, 1)}
                                    className="w-8 text-[#D1FF26] hover:text-white h-full flex items-center justify-center border-l border-zinc-805"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>

                                <div className="text-right w-16">
                                  <span className="block text-xs font-mono font-bold text-white">${itemSub}</span>
                                </div>

                                <button 
                                  onClick={() => handleRemoveFromCart(item.title)}
                                  className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Column: Calculations and sandbox checkout triggers */}
                      <div 
                        className="lg:col-span-4 p-6 bg-zinc-950 border border-zinc-805 space-y-6"
                        style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}
                      >
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#D1FF26]">Summary calculations</h3>
                        
                        <div className="space-y-3 text-xs font-mono font-medium border-b border-zinc-900 pb-5 text-zinc-400">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="text-white">${subtotal.toFixed(2)}</span>
                          </div>
                          
                          {discountPercent > 0 && (
                            <div className="flex justify-between text-[#D1FF26]">
                              <span className="flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5" /> Coupon VIP -(20%):
                              </span>
                              <span>-${discountAmount.toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span>Shipping cost:</span>
                            {isFreeShipping ? (
                              <span className="text-[#D1FF26] tracking-widest uppercase text-[10px] font-bold">COMPLIMENTARY</span>
                            ) : (
                              <span className="text-white">$15.00</span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm font-mono tracking-tight font-extrabold pb-4">
                          <span>TOTAL ESTIMATE:</span>
                          <span className="text-lg text-[#D1FF26] font-black">${grandTotal.toFixed(2)}</span>
                        </div>

                        {/* Interactive Coupon Area */}
                        <div className="space-y-2 pt-2">
                          <label className="block text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Discount Coupon Code</label>
                          <div className="flex border border-zinc-805 bg-black p-0.5">
                            <input 
                              type="text" 
                              placeholder="E.G. ARCHIVE20"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-1 bg-transparent px-3 text-xs uppercase text-white font-mono placeholder-zinc-650 outline-none"
                            />
                            <button
                              onClick={handleApplyCoupon}
                              className="bg-white text-black font-black uppercase py-2 px-4 text-[9px] tracking-wider font-sans hover:bg-zinc-200"
                            >
                              Apply
                            </button>
                          </div>
                          {couponError && <p className="text-[10px] font-mono text-rose-400">{couponError}</p>}
                          {couponSuccess && <p className="text-[10px] font-mono text-[#D1FF26]">{couponSuccess}</p>}
                        </div>

                        {/* Simulation billing address info form */}
                        <div className="space-y-2 border-t border-zinc-900 pt-5">
                          <label className="block text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Test Buyer Name</label>
                          <input 
                            type="text" 
                            placeholder="IJAMSHAD DEVELOPER"
                            value={billingName}
                            onChange={(e) => setBillingName(e.target.value)}
                            className="w-full bg-black border border-zinc-805 p-3 text-xs text-white placeholder-zinc-650 tracking-tight font-mono outline-none focus:border-zinc-500"
                            style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "4px" }}
                          />
                        </div>

                        {/* Proceed action */}
                        <button
                          onClick={() => {
                            setCheckoutStep("complete");
                            if (onUpdateCart) onUpdateCart([]); // Clear cart upon successful order
                          }}
                          className="w-full py-4 text-xs font-black uppercase text-center bg-[#D1FF26] text-black tracking-widest hover:bg-opacity-90 active:scale-97 select-none mt-4 transition-all"
                          style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" }}
                        >
                          Confirm & Pay: ${grandTotal.toFixed(2)}
                        </button>
                        
                        <div className="text-center">
                          <span className="text-[9px] text-zinc-500 leading-normal font-mono uppercase block">Adheres exactly to active typography</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* CHECKOUT CONFIRMATION MESSAGE */
                <div className="max-w-md mx-auto text-center py-16 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#D1FF26]/10 flex items-center justify-center text-[#D1FF26] mx-auto border border-[#D1FF26]/20">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.22em] uppercase text-zinc-500 block mb-1">Sandbox simulation verified</span>
                    <h2 className="text-2xl font-black uppercase text-white tracking-widest">ORDER PLACED SUCCESSFULLY!</h2>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      Thank you for testing <strong className="text-white bg-zinc-900 px-1">{billingName || "Ijamshad Guest"}</strong>! Liquid 2.0 theme state variables generated by Gemini can now be fetched from your customizer.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950 border border-zinc-850 text-left rounded-lg text-[10px] font-mono space-y-2">
                    <div className="flex justify-between text-zinc-400">
                      <span>Transaction ID:</span>
                      <span className="text-white">SHP-{Math.floor(Math.random() * 900000 + 100000)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Coupon VIP status:</span>
                      <span className="text-[#D1FF26]">{discountPercent > 0 ? "Applied (20% Off)" : "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Synchronized settings:</span>
                      <span className="text-white">Ready for live export</span>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        onChangePage?.("home");
                        setCheckoutStep("cart");
                        setDiscountPercent(0);
                        setCouponCode("");
                      }}
                      className="px-6 py-3 bg-[#D1FF26] text-black font-black uppercase text-[10px] tracking-widest"
                      style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" }}
                    >
                      Return to Customizer
                    </button>
                    <button
                      onClick={() => {
                        onChangePage?.("collection");
                        setCheckoutStep("cart");
                        setDiscountPercent(0);
                        setCouponCode("");
                      }}
                      className="px-6 py-3 border border-zinc-800 text-white font-black uppercase text-[10px] tracking-widest"
                      style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" }}
                    >
                      Shop More Products
                    </button>
                  </div>
                </div>
              )}
            </main>
          )}
          </>)}

          {/* Footer of Store */}
          <footer id="footer-brand" className="border-t border-zinc-800 mt-16 py-12 px-8 bg-zinc-950 text-left">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-zinc-400 leading-relaxed font-sans">
              <div className="space-y-3">
                <h4 className={`text-sm font-black text-white ${getFontFamilyStyle()}`}>{settings.logoText || "NOVA.STORE"}</h4>
                <p className="text-zinc-500">Pioneering luxurious layout customizers and premium visual tools for Shopify entrepreneurs.</p>
                <span className="text-[9px] text-zinc-650 block font-mono">© 2026 Shopify Studio Inc. All rights reserved.</span>
              </div>
              <div className="space-y-3">
                <h5 className="font-extrabold text-white text-[10px] tracking-wider uppercase font-mono">Theme Support</h5>
                <p className="text-zinc-500">Designed with pristine accessibility compliance. All components adhere tightly to WCAG metrics for touch and visual clarity.</p>
              </div>
              <div className="space-y-3">
                <h5 className="font-extrabold text-white text-[10px] tracking-wider uppercase font-mono">Studio Hub</h5>
                <p className="text-zinc-500">Customize setting variables natively. Export clean Liquid layout files, settings json blocks, and layout code freely.</p>
              </div>
            </div>
          </footer>

          {/* SLIDING SIDE CART DRAWER */}
          {cartDrawerOpen && (
            <div className="absolute inset-x-0 bottom-0 top-[35px] md:top-[38px] z-50 overflow-hidden flex justify-end" style={{ height: "calc(100% - 35px)" }}>
              {/* Dark backdrop overlay */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300"
                onClick={() => setCartDrawerOpen(false)}
              />

              {/* Drawer core panel */}
              <div 
                style={{ 
                  backgroundColor: settings.bgColor === "#ffffff" ? "#ffffff" : "#0d0d0d",
                  color: settings.bgColor === "#ffffff" ? "#111111" : "#ffffff",
                  borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)"
                }}
                className="relative w-full max-w-[390px] h-full shadow-2xl flex flex-col border-l z-55 animate-slide-in-right text-left"
              >
                {/* Header of Drawer */}
                <div 
                  className="p-5 border-b flex items-center justify-between"
                  style={{ borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#D1FF26]" style={{ color: settings.accentColor }} />
                    <span className="text-xs font-black uppercase tracking-widest font-mono">
                      Your Order Ledger ({cart.reduce((s, c) => s + c.quantity, 0)})
                    </span>
                  </div>
                  <button 
                    onClick={() => setCartDrawerOpen(false)}
                    className="p-1 hover:opacity-80 cursor-pointer transition-all rounded-full bg-zinc-900/10 dark:bg-zinc-100/10"
                    title="Close Cart"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Shipping Progress bar */}
                <div 
                  className="p-4 border-b text-[10px] space-y-1.5"
                  style={{ 
                    borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                    backgroundColor: settings.bgColor === "#ffffff" ? "#fafafa" : "#111111"
                  }}
                >
                  {isFreeShipping ? (
                    <div className="flex items-center gap-1.5 text-emerald-500 font-bold uppercase">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>🎉 You have unlocked complimentary free shipping!</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-zinc-400 font-medium">
                        <span>COMPLIMENTARY SHIPPING REQUIREMENT:</span>
                        <span className="font-bold text-white shrink-0" style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "#ffffff" }}>
                          ${(150 - subtotal).toFixed(2)} AWAY
                        </span>
                      </div>
                      <div className="relative w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full left-0 top-0 bg-[#D1FF26] transition-all duration-300" 
                          style={{ 
                            width: `${Math.min(100, (subtotal / 150) * 100)}%`,
                            backgroundColor: settings.accentColor 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Mid-container Scrollable cart listing */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scroll">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                      <ShoppingBag className="w-10 h-10 text-zinc-500" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">Your Basket is Empty</h4>
                      <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed">
                        Explore our Collections Grid to customize your brutalist garments.
                      </p>
                      <button 
                        onClick={() => {
                          setCartDrawerOpen(false);
                          setSelectedCategory("all");
                          onChangePage?.("collection");
                        }}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-white hover:bg-zinc-750 transition-colors"
                        style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "4px" }}
                      >
                        Explore Catalog
                      </button>
                    </div>
                  ) : (
                    cart.map(item => {
                      const itemSubValue = (parseFloat(item.price.replace(/[$,]/g, "")) * item.quantity).toFixed(2);
                      return (
                        <div 
                          key={item.id} 
                          className="flex gap-3 p-3 bg-[#121212] border border-zinc-800 relative transition-all"
                          style={{ 
                            borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "8px",
                            backgroundColor: settings.bgColor === "#ffffff" ? "#fafafa" : "#121212",
                            borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)"
                          }}
                        >
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-12 h-16 object-cover bg-zinc-900 border border-zinc-800 shrink-0" 
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <h5 className="text-[11px] font-extrabold uppercase truncate tracking-tight pr-5" style={{ color: settings.bgColor === "#ffffff" ? "#000000" : "#ffffff" }}>
                              {item.title}
                            </h5>
                            <span className="block text-[10px] font-mono text-zinc-500 mt-0.5">{item.price}</span>
                            
                            {/* Quantity Controls in Drawer Row */}
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center bg-[#191919] border border-zinc-800 h-7" style={{ backgroundColor: settings.bgColor === "#ffffff" ? "#ececec" : "#191919" }}>
                                <button 
                                  onClick={() => handleUpdateQty(item.title, -1)}
                                  className="w-6 text-zinc-500 hover:text-white h-full flex items-center justify-center border-r border-zinc-800"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="w-7 font-mono text-center text-[10px] font-bold" style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "#ffffff" }}>
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => handleUpdateQty(item.title, 1)}
                                  className="w-6 text-[#D1FF26] hover:text-white h-full flex items-center justify-center border-l border-zinc-800"
                                  style={{ color: settings.accentColor }}
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>

                              <span className="text-[10px] font-mono font-black" style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "#ffffff" }}>
                                ${itemSubValue}
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleRemoveFromCart(item.title)}
                            className="absolute top-2 right-2 text-zinc-550 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Coupon panel inside drawer */}
                {cart.length > 0 && (
                  <div 
                    className="p-4 border-t space-y-2"
                    style={{ 
                      borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                      backgroundColor: settings.bgColor === "#ffffff" ? "#fafafa" : "#111111"
                    }}
                  >
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="ENTER COUPON (ARCHIVE20)"
                        className="flex-1 bg-black/40 border border-zinc-800 px-2.5 py-1.5 text-[9px] font-mono text-white placeholder-zinc-500 outline-none uppercase"
                        style={{ backgroundColor: settings.bgColor === "#ffffff" ? "#ffffff" : "rgba(0,0,0,0.3)", color: settings.bgColor === "#ffffff" ? "#000000" : "#ffffff" }}
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="px-3 bg-zinc-800 text-white font-mono text-[9px] font-black uppercase tracking-wider hover:bg-zinc-700 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Messages */}
                    {couponSuccess && (
                      <span className="block text-[9px] text-emerald-500 font-semibold">{couponSuccess}</span>
                    )}
                    {couponError && (
                      <span className="block text-[9px] text-rose-500 font-semibold">{couponError}</span>
                    )}
                  </div>
                )}

                {/* Subtotals and Checkout Trigger */}
                {cart.length > 0 && (
                  <div 
                    className="p-5 border-t space-y-4 text-xs font-mono font-semibold"
                    style={{ borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}
                  >
                    <div className="space-y-2 text-zinc-400">
                      <div className="flex justify-between">
                        <span>Cart Subtotal:</span>
                        <span className="text-white font-black" style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "#ffffff" }}>
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-emerald-500 font-bold">
                          <span>VIP Discount ({discountPercent}%):</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Complementary Shipping:</span>
                        <span className="text-white font-black" style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "#ffffff" }}>
                          {isFreeShipping ? "FREE" : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-zinc-900 text-white text-sm font-black" style={{ color: settings.bgColor === "#ffffff" ? "#111111" : "#ffffff" }}>
                        <span className="uppercase font-sans font-black tracking-tight text-xs">Total Ledger Cost:</span>
                        <span>${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setCartDrawerOpen(false);
                        onChangePage?.("cart");
                        setCheckoutStep("cart");
                      }}
                      className="w-full text-center py-3 bg-[#D1FF26] text-black font-extrabold uppercase text-[10px] tracking-widest cursor-pointer hover:bg-opacity-95 hover:shadow-lg transition-all"
                      style={{ 
                        backgroundColor: settings.accentColor, 
                        color: "#000000",
                        borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" 
                      }}
                    >
                      Process Standard Order View
                    </button>
                    
                    <button 
                      onClick={() => {
                        // Quick successful checkout mock action
                        if (!onUpdateCart) return;
                        alert("Secure checkout simulated successfully! A digital report has been processed.");
                        onUpdateCart([]);
                        setCartDrawerOpen(false);
                      }}
                      className="w-full text-center py-2 bg-transparent border border-zinc-800 hover:border-zinc-700 text-zinc-450 hover:text-white transition-colors uppercase text-[9px] tracking-wider cursor-pointer"
                    >
                      Instant Mock Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        {/* Close active preview page elements */}
        </div>
      </div>
    </div>
  );
}

// Dynamic layout block renderer mapping template state to interactive views
function renderSection(
  section: ThemeSection, 
  settings: ThemeSettings,
  getFontFamilyStyle: () => string,
  getRadiusClass: () => string,
  onProductClick: (product: any) => void,
  onAddToCart: (product: any) => void,
  options: any = {}
) {
  const { visuals } = section;

  switch (section.type) {
    case "main-product": {
      const { selectedProduct, productColor, setProductColor, productSize, setProductSize, onChangePage, productQty, setProductQty, handleProductDetailSubmit } = options;
      if (!selectedProduct) return null;
      return (
        <div className="px-6 md:px-12 py-10 text-left border-b border-zinc-800" style={{ backgroundColor: settings.bgColor }}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onChangePage?.("collection");
            }}
            className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-2 mb-8"
          >
            ← Back to Catalog
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left side media Column */}
            <div className="lg:col-span-6 space-y-4">
              <div 
                className="relative aspect-[3/4] bg-zinc-900 overflow-hidden border border-zinc-850"
                style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "16px" }}
              >
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-black/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-zinc-300">
                  Studio Spec No. {selectedProduct.id.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Right side interactive content details */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[#D1FF26]/10 text-[#D1FF26] font-mono px-2 py-0.5 uppercase tracking-widest rounded" style={{ color: settings.accentColor, backgroundColor: `${settings.accentColor}15` }}>
                    {selectedProduct.tag || "PREMIUM CAPABILITIES"}
                  </span>
                  <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">SKU: SHP-2026-{selectedProduct.id}</span>
                </div>

                <h1 className={`text-3xl md:text-4xl font-black uppercase text-white tracking-tighter ${getFontFamilyStyle()}`}>
                  {selectedProduct.title}
                </h1>

                <div className="flex items-center gap-4">
                  <p className="text-xl font-mono text-[#D1FF26] font-extrabold" style={{ color: settings.accentColor }}>{selectedProduct.price}</p>
                  
                  {/* Rating displays */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">({selectedProduct.reviewsCount} metrics)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-light font-sans max-w-lg italic">
                {selectedProduct.description}
              </p>

              {/* Interactivity: Color swatch selection */}
              <div className="space-y-3 border-t border-zinc-900 pt-5" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Available Color tones:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((col: string) => (
                    <button
                      key={col}
                      onClick={() => setProductColor(col)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-all ${
                        productColor === col 
                          ? "bg-white text-black font-extrabold border-transparent" 
                          : "bg-transparent text-zinc-400 hover:text-white border-zinc-805 hover:border-zinc-650"
                      }`}
                      style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "4px" }}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactivity: Size Selection options */}
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Select Size specifications:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((sz: string) => (
                    <button
                      key={sz}
                      onClick={() => setProductSize(sz)}
                      className={`w-12 h-10 text-xs font-mono font-bold uppercase flex items-center justify-center border transition-all ${
                        productSize === sz 
                          ? "bg-[#D1FF26] text-black border-transparent font-black" 
                          : "bg-transparent text-zinc-400 hover:text-white border-zinc-805 hover:border-zinc-650"
                      }`}
                      style={{ 
                        backgroundColor: productSize === sz ? settings.accentColor : "",
                        color: productSize === sz ? "#000000" : "",
                        borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "4px" 
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity picker & Adding to Cart Row */}
              <div className="space-y-4 pt-4 border-t border-zinc-900" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  {/* Quantity adjustment logic */}
                  <div className="flex items-center bg-[#111111] border border-zinc-805 h-12">
                    <button 
                      onClick={() => setProductQty(Math.max(1, productQty - 1))}
                      className="w-12 h-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all border-r border-zinc-805 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center text-xs font-mono font-bold text-white select-none">{productQty}</span>
                    <button 
                      onClick={() => setProductQty(productQty + 1)}
                      className="w-12 h-full flex items-center justify-center text-[#D1FF26] hover:text-white hover:bg-zinc-900 transition-all border-l border-zinc-805 cursor-pointer"
                      style={{ color: settings.accentColor }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button 
                    onClick={handleProductDetailSubmit}
                    className="flex-1 bg-[#D1FF26] text-black text-xs font-black uppercase tracking-widest h-12 flex items-center justify-center gap-2 hover:opacity-90 select-none cursor-pointer duration-150 transition-all border border-transparent active:scale-[0.98]"
                    style={{ 
                      backgroundColor: settings.accentColor, 
                      color: "#000000",
                      borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" 
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add spec to active basket
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-[10px] font-mono text-zinc-500 pt-2 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D1FF26]" style={{ color: settings.accentColor }} />
                  <span>Complimentary Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D1FF26]" style={{ color: settings.accentColor }} />
                  <span>30-Day Material Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case "main-collection": {
      const { catalogProducts, selectedCategory, setSelectedCategory } = options;
      return (
        <div className="px-6 md:px-12 py-10 text-left border-b border-zinc-800" style={{ backgroundColor: settings.bgColor }}>
          <div className="mb-10 text-left border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">Authentic curation</span>
              <h1 className={`text-4xl font-black uppercase tracking-tighter ${getFontFamilyStyle()}`}>{visuals.heading || "BRUTALIST ARCHIVES"}</h1>
              <p className="text-xs text-zinc-400 max-w-sm mt-1 leading-relaxed">
                {visuals.subheading || "Skaters, artists, and innovators engineered into a unified garment blueprint."}
              </p>
            </div>

            {/* Subcategory selectors */}
            <div className="flex flex-wrap bg-[#111111]/80 p-1 border border-zinc-800 font-mono text-[10px]" onClick={(e) => e.stopPropagation()}>
              {(["all", "apparel", "outerwear", "accessories"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 uppercase tracking-wider cursor-pointer ${
                    selectedCategory === cat 
                      ? "bg-[#D1FF26] text-black font-black" 
                      : "text-zinc-400 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: selectedCategory === cat ? settings.accentColor : "",
                    color: selectedCategory === cat ? "#000000" : ""
                  }}
                >
                  {cat === "all" ? "All categories" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Catalog Display Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalogProducts
              ?.filter((prod: any) => selectedCategory === "all" || prod.category === selectedCategory)
              .map((prod: any) => (
                <div 
                  key={prod.id}
                  className="group flex flex-col justify-between border border-zinc-805 bg-zinc-950 p-5 hover:border-zinc-700 transition-all duration-300 relative text-left"
                  style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}
                >
                  {/* Product Media Column */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(prod);
                    }}
                    className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden cursor-pointer mb-5"
                    style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "8px" }}
                  >
                    <img 
                      src={prod.imageUrl} 
                      alt={prod.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    {prod.tag && (
                      <span 
                        className="absolute top-3 left-3 text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded text-black bg-[#D1FF26]"
                        style={{ backgroundColor: settings.accentColor }}
                      >
                        {prod.tag}
                      </span>
                    )}
                  </div>

                  {/* Info lines */}
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductClick(prod);
                        }}
                        className="text-sm font-black uppercase select-none cursor-pointer text-white hover:text-[#D1FF26]"
                        style={{ "--hover-color": settings.accentColor } as React.CSSProperties}
                      >
                        {prod.title}
                      </h3>
                      <span className="text-[11px] font-mono tracking-tight text-zinc-400 shrink-0 font-bold">{prod.price}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-light leading-relaxed mb-6 line-clamp-2 italic">
                      {prod.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick(prod);
                      }}
                      className="border border-zinc-800 hover:border-zinc-650 text-white font-black uppercase py-2.5 text-[9px] tracking-widest text-center cursor-pointer"
                      style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" }}
                    >
                      View Specs
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod);
                      }}
                      className="font-black uppercase py-2.5 text-[9px] tracking-widest text-[#000000] hover:opacity-90 transition-all select-none bg-[#D1FF26] cursor-pointer"
                      style={{ 
                        backgroundColor: settings.accentColor,
                        color: "#000000",
                        borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" 
                      }}
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }

    case "main-cart": {
      const {
        checkoutStep,
        setCheckoutStep,
        cart,
        handleUpdateQty,
        handleRemoveFromCart,
        subtotal,
        discountPercent,
        discountAmount,
        isFreeShipping,
        grandTotal,
        couponCode,
        setCouponCode,
        handleApplyCoupon,
        couponError,
        couponSuccess,
        billingName,
        setBillingName,
        onChangePage,
        onUpdateCart
      } = options;
      return (
        <div className="px-6 md:px-12 py-10 text-left border-b border-zinc-800" style={{ backgroundColor: settings.bgColor }}>
          {checkoutStep === "cart" ? (
            <>
              <div className="mb-10 text-left border-b border-zinc-900 pb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D1FF26]" style={{ color: settings.accentColor }}>Active Order Ledger</span>
                <h1 className={`text-3xl font-black uppercase tracking-tighter ${getFontFamilyStyle()}`}>{visuals.heading || "SHOPPING CART REPORT"}</h1>
                <p className="text-xs text-zinc-500 mt-1">{visuals.subheading || "Review items, verify quantities, and utilize coupon codes before checkout."}</p>
              </div>

              {!cart || cart.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-zinc-800 w-full" style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }} onClick={(e) => e.stopPropagation()}>
                  <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-sm font-black uppercase text-zinc-300">Your Basket is Empty</h3>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-2 leading-relaxed font-sans">
                    You have not selected any custom items yet. Visit our Collections Grid to choose apparel.
                  </p>
                  <button 
                    onClick={() => onChangePage?.("collection")}
                    className="mt-6 px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest cursor-pointer"
                    style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" }}
                  >
                    Browse items
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" onClick={(e) => e.stopPropagation()}>
                  {/* Left Column: Cart items table */}
                  <div className="lg:col-span-8 space-y-4">
                    {cart.map((item: any) => {
                      const itemSub = (parseFloat(item.price.replace(/[$,]/g, "")) * item.quantity).toFixed(2);
                      return (
                        <div 
                          key={item.id}
                          className="p-5 bg-zinc-950 border border-zinc-805 flex flex-col sm:flex-row items-center justify-between gap-6"
                          style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-16 h-20 object-cover bg-zinc-900 shrink-0 border border-zinc-850"
                            />
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-tight text-white line-clamp-1">{item.title}</h4>
                              <p className="text-[10px] font-mono text-[#D1FF26] mt-1" style={{ color: settings.accentColor }}>{item.price}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-8 self-center sm:self-auto uppercase tracking-wide">
                            <div className="flex items-center bg-[#111111] border border-zinc-805 h-9">
                              <button 
                                onClick={() => handleUpdateQty(item.title, -1)}
                                className="w-8 text-zinc-500 hover:text-white h-full flex items-center justify-center border-r border-zinc-805 cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="w-8 font-mono text-center text-xs font-bold text-white">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateQty(item.title, 1)}
                                className="w-8 text-[#D1FF26] hover:text-white h-full flex items-center justify-center border-l border-zinc-805 cursor-pointer"
                                style={{ color: settings.accentColor }}
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <div className="text-right w-16">
                              <span className="block text-xs font-mono font-bold text-white">${itemSub}</span>
                            </div>

                            <button 
                              onClick={() => handleRemoveFromCart(item.title)}
                              className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Calculations and sandbox checkout triggers */}
                  <div 
                    className="lg:col-span-4 p-6 bg-zinc-955 border border-zinc-805 space-y-6"
                    style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}
                  >
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D1FF26]" style={{ color: settings.accentColor }}>Summary calculations</h3>
                    
                    <div className="space-y-3 text-xs font-mono font-medium border-b border-zinc-900 pb-5 text-zinc-400">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="text-white">${subtotal?.toFixed(2) || "0.00"}</span>
                      </div>
                      
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-[#D1FF26]" style={{ color: settings.accentColor }}>
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" /> Coupon VIP -(20%):
                          </span>
                          <span>-${discountAmount?.toFixed(2) || "0.00"}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Shipping cost:</span>
                        {isFreeShipping ? (
                          <span className="text-[#D1FF26] tracking-widest uppercase text-[10px] font-bold" style={{ color: settings.accentColor }}>COMPLIMENTARY</span>
                        ) : (
                          <span className="text-white">$15.00</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-mono tracking-tight font-extrabold pb-4">
                      <span>TOTAL ESTIMATE:</span>
                      <span className="text-lg text-[#D1FF26] font-black" style={{ color: settings.accentColor }}>${grandTotal?.toFixed(2) || "0.00"}</span>
                    </div>

                    {/* Interactive Coupon Area */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Discount Coupon Code</label>
                      <div className="flex border border-zinc-805 bg-black p-0.5">
                        <input 
                          type="text" 
                          placeholder="E.G. ARCHIVE20"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 bg-transparent px-3 text-xs uppercase text-white font-mono placeholder-zinc-700 outline-none"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-white text-black font-black uppercase py-2 px-4 text-[9px] tracking-wider font-sans hover:bg-zinc-200 cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[10px] font-mono text-rose-400">{couponError}</p>}
                      {couponSuccess && <p className="text-[10px] font-mono text-[#D1FF26]">{couponSuccess}</p>}
                    </div>

                    {/* Simulation billing address info form */}
                    <div className="space-y-2 border-t border-zinc-900 pt-5">
                      <label className="block text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Test Buyer Name</label>
                      <input 
                        type="text" 
                        placeholder="IJAMSHAD DEVELOPER"
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        className="w-full bg-black border border-zinc-805 p-3 text-xs text-white placeholder-zinc-700 tracking-tight font-mono outline-none focus:border-zinc-500"
                        style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "4px" }}
                      />
                    </div>

                    {/* Proceed action */}
                    <button
                      onClick={() => {
                        setCheckoutStep("complete");
                        if (onUpdateCart) onUpdateCart([]); // Clear cart upon successful order
                      }}
                      className="w-full py-4 text-xs font-black uppercase text-center bg-[#D1FF26] text-black tracking-widest hover:bg-opacity-90 active:scale-97 select-none mt-4 transition-all cursor-pointer"
                      style={{ 
                        backgroundColor: settings.accentColor, 
                        color: "#000000",
                        borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" 
                      }}
                    >
                      Confirm & Pay: ${grandTotal?.toFixed(2) || "0.00"}
                    </button>
                    
                    <div className="text-center">
                      <span className="text-[9px] text-zinc-500 leading-normal font-mono uppercase block">Adheres exactly to active typography</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* CHECKOUT CONFIRMATION MESSAGE */
            <div className="max-w-md mx-auto text-center py-16 space-y-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 rounded-full bg-[#D1FF26]/10 flex items-center justify-center text-[#D1FF26] mx-auto border border-[#D1FF26]/20" style={{ color: settings.accentColor, borderColor: `${settings.accentColor}20`, backgroundColor: `${settings.accentColor}10` }}>
                <Check className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-[0.22em] uppercase text-zinc-500 block mb-1">Sandbox simulation verified</span>
                <h2 className="text-2xl font-black uppercase text-white tracking-widest">ORDER PLACED SUCCESSFULLY!</h2>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Thank you for testing <strong className="text-white bg-zinc-900 px-1">{billingName || "Ijamshad Guest"}</strong>! Liquid 2.0 theme state variables generated by Gemini can now be fetched from your customizer.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-850 text-left rounded-lg text-[10px] font-mono space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Transaction ID:</span>
                  <span className="text-white">SHP-{Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Coupon VIP status:</span>
                  <span className="text-[#D1FF26]" style={{ color: settings.accentColor }}>{discountPercent > 0 ? "Applied (20% Off)" : "N/A"}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Synchronized settings:</span>
                  <span className="text-white">Ready for live export</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-center">
                <button
                  onClick={() => {
                    onChangePage?.("home");
                    setCheckoutStep("cart");
                  }}
                  className="px-6 py-3 bg-[#D1FF26] text-black font-black uppercase text-[10px] tracking-widest cursor-pointer"
                  style={{ 
                    backgroundColor: settings.accentColor, 
                    color: "#000000",
                    borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" 
                  }}
                >
                  Return to Customizer
                </button>
                <button
                  onClick={() => {
                    onChangePage?.("collection");
                    setCheckoutStep("cart");
                  }}
                  className="px-6 py-3 border border-zinc-800 text-white font-black uppercase text-[10px] tracking-widest cursor-pointer"
                  style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" }}
                >
                  Shop More Products
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    case "hero-banner-ai":
    case "hero-banner":
      return (
        <div 
          className="relative min-h-[460px] flex flex-col justify-between items-start text-left p-12 overflow-hidden transition-all duration-350 border-b border-zinc-800"
          style={{ 
            backgroundImage: visuals.backgroundImage ? `linear-gradient(to right, rgba(10,10,10,0.95), rgba(10,10,10,0.45)), url(${visuals.backgroundImage})` : "none",
            backgroundColor: visuals.backgroundColor || settings.bgColor,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="space-y-4 relative z-10 w-full">
            <p style={{ color: settings.accentColor }} className="text-xs font-black uppercase tracking-[0.4em] mb-2 text-[#D1FF26]">Spring Summer 2026</p>
            <h1 className={`text-4xl md:text-[85px] leading-[0.85] font-black tracking-tighter uppercase ${getFontFamilyStyle()}`}>
              {visuals.heading}
            </h1>
          </div>
          
          <div className="max-w-md space-y-6 mt-8 relative z-10">
            <p className="text-sm text-zinc-400 font-light italic leading-relaxed">
              {visuals.subheading || "A collection exploring the intersection of brutalist architecture and organic textile movement."}
            </p>
            {visuals.ctaText && (
              <button 
                className="flex items-center gap-4 border border-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors bg-transparent text-white rounded-none cursor-pointer"
              >
                {visuals.ctaText}
                <span className="text-sm">→</span>
              </button>
            )}
          </div>
        </div>
      );

    case "featured-collection":
    case "featured-collection-ai":
      return (
        <div className="py-16 px-12 border-b border-zinc-800 text-left" style={{ backgroundColor: settings.bgColor === "#ffffff" ? "#fbfbfb" : "#0A0A0A" }}>
          <div className="mb-10 text-left max-w-7xl mx-auto">
            <h2 className={`text-3xl font-black tracking-tighter uppercase ${getFontFamilyStyle()}`}>
              {visuals.heading || "CURATED ESSENTIALS"}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm leading-relaxed font-light">
              {visuals.subheading || "A focused range engineered with custom systems and modern clean silhouettes."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {(visuals.blocks && visuals.blocks.length > 0 ? visuals.blocks : [
              { title: "Oversized Mac", price: "$420.00", tag: "Available", imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400" },
              { title: "Ribbed Knit Beanie", price: "$85.00", tag: "Midnight black", imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d435350?w=400" },
              { title: "Brutalist Chelsea Boots", price: "$340.00", tag: "Collection 01", imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400" }
            ]).map((item, id) => (
              <div 
                key={id}
                className="flex flex-col justify-between p-5 border transition-all hover:bg-white/[0.01] hover:border-zinc-700"
                style={{ 
                  borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px",
                  borderColor: settings.bgColor === "#ffffff" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                  backgroundColor: settings.bgColor === "#ffffff" ? "#ffffff" : "#0A0A0A"
                }}
              >
                <div className="flex justify-between items-start gap-4 mb-5">
                  <div 
                    onClick={() => onProductClick(item)}
                    className="relative w-28 h-36 bg-zinc-900 flex items-center justify-center text-zinc-600 font-bold uppercase text-[8px] tracking-widest overflow-hidden cursor-pointer"
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rotate-1" referrerPolicy="no-referrer" />
                    ) : (
                      <span>Preview</span>
                    )}
                  </div>
                  <div className="text-right flex-1 min-w-0">
                    {item.tag && (
                      <span className="block text-[8px] font-black uppercase tracking-wider mb-1 text-[#D1FF26]" style={{ color: settings.accentColor }}>
                        {item.tag}
                      </span>
                    )}
                    <h3 
                      onClick={() => onProductClick(item)}
                      className="text-xs font-black uppercase truncate cursor-pointer text-white hover:text-[#D1FF26]"
                    >
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 font-mono text-[10px] mt-1">{item.price || "$120.00"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-zinc-900">
                  <button 
                    onClick={() => onProductClick(item)}
                    className={`w-full text-center border border-zinc-800 text-white font-bold uppercase transition-all duration-150 flex items-center justify-center ${
                      settings.tapTargetsFixed ? "min-h-[48px] py-3 text-xs" : "py-1.5 h-8 text-[9px] tracking-wider"
                    }`}
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => onAddToCart(item)}
                    className={`w-full font-black uppercase hover:opacity-90 active:scale-95 transition-all outline-none text-black flex items-center justify-center ${
                      settings.tapTargetsFixed ? "min-h-[48px] py-3 text-xs" : "py-1.5 h-8 text-[9px] tracking-widest"
                    }`}
                    style={{ 
                      backgroundColor: settings.accentColor, 
                      color: "#000000",
                      borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "9999px" 
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "image-with-text":
    case "image-with-text-ai":
      return (
        <div className="py-16 px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-b border-zinc-800 text-left" style={{ backgroundColor: settings.bgColor }}>
          <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden border border-zinc-805 animate-fade-in" style={{ borderRadius: getRadiusClass() === "rounded-none" ? "0px" : "12px" }}>
            <img 
              src={visuals.backgroundImage || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800"} 
              alt={visuals.heading} 
              className={`w-full h-full -rotate-1 hover:rotate-0 transition-all duration-350 ${
                settings.fluidImagesFixed ? "object-cover object-center scale-100" : "object-fill scale-y-125 scale-x-75 brightness-110"
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-6">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] block text-[#D1FF26]" style={{ color: settings.accentColor }}>Brand Focus Highlights</span>
            <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tighter uppercase ${getFontFamilyStyle()}`}>
              {visuals.heading}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-light italic">
              {visuals.subheading || "Detailing organic movement that aligns precisely with structural designs. We formulate configurations meticulously to adapt natively across platforms."}
            </p>
            {visuals.ctaText && (
              <button 
                className="inline-flex items-center gap-4 border border-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors bg-transparent text-white rounded-none cursor-pointer"
              >
                {visuals.ctaText}
                <span className="text-xs">→</span>
              </button>
            )}
          </div>
        </div>
      );

    case "newsletter":
    case "newsletter-ai":
      return (
        <div 
          className="p-16 text-center border-b border-zinc-803" 
          style={{ backgroundColor: visuals.backgroundColor || "#0A0A0A" }}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter ${getFontFamilyStyle()}`}>
              {visuals.heading || "Join the Circle"}
            </h2>
            <p className="text-[10px] text-zinc-400 leading-relaxed uppercase tracking-widest max-w-md mx-auto">
              {visuals.subheading || "Subscribe to catch seasonal drops, curated design logs, and studio presets directly."}
            </p>
            <div className="flex gap-0 max-w-md mx-auto pt-4 border border-zinc-800 bg-black/40">
              <input 
                type="text" 
                placeholder="YOUR EMAIL ADDRESS"
                className="flex-1 bg-transparent p-4 text-xs text-white placeholder-zinc-550 font-mono outline-none uppercase"
              />
              <button 
                className="px-6 py-4 text-xs font-black uppercase hover:bg-opacity-95 transition-opacity cursor-pointer font-sans bg-[#D1FF26] text-black"
                style={{ backgroundColor: settings.accentColor, color: "#111111" }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      );

    default:
      // Catch-all block for creative generated visuals.
      return (
        <div className="py-16 p-8 text-center max-w-3xl mx-auto space-y-6 border-b border-zinc-800">
          <h2 className={`text-3xl font-black uppercase tracking-tighter ${getFontFamilyStyle()}`}>{visuals.heading}</h2>
          <p className="text-xs text-zinc-400">{visuals.subheading}</p>
          
          {visuals.blocks && visuals.blocks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-6">
              {visuals.blocks.map((block, id) => (
                <div 
                  key={id} 
                  className="p-5 border border-zinc-800 bg-[#0A0A0A]/40 flex items-start gap-4 cursor-pointer"
                  style={{ borderRadius: settings.borderRadius === "none" ? "0px" : "8px" }}
                >
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-[#D1FF26]" style={{ backgroundColor: settings.accentColor }} />
                  <div>
                    <h4 className="text-xs font-black uppercase text-white">{block.title}</h4>
                    {block.description && <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{block.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
  }
}
