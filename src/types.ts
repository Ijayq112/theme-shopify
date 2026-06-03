export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: "Inter" | "Space Grotesk" | "Playfair Display" | "JetBrains Mono";
  fontSizeBase: "sm" | "base" | "lg";
  borderRadius: "none" | "md" | "xl" | "full";
  spacingTightness: "comfy" | "relax" | "dense";
  logoText: string;
  mobileMenuFixed?: boolean;
  horizontalScrollFixed?: boolean;
  tapTargetsFixed?: boolean;
  lazyLoadingSecured?: boolean;
  fluidImagesFixed?: boolean;
}

export interface SectionBlock {
  title: string;
  subtitle?: string;
  description?: string;
  tag?: string;
  price?: string;
  imageUrl?: string;
  buttonText?: string;
}

export interface SectionVisuals {
  layout: "flex-col" | "grid-2-cols" | "grid-3-cols" | "grid-4-cols" | "slider" | string;
  heading: string;
  subheading?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  blocks?: SectionBlock[];
}

export interface ThemeSection {
  sectionId: string;
  type: string;
  title: string;
  visuals: SectionVisuals;
  liquidCode: string;
  schema: any;
  page?: "home" | "product" | "collection" | "cart";
}

export interface ThemeFile {
  name: string;
  path: string;
  content: string;
  language: "liquid" | "json" | "css";
}

export interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
}

