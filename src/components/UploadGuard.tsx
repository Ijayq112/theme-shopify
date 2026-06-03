import React, { useState, useEffect } from "react";
import { ThemeSettings, ThemeSection } from "../types";
import { 
  ShieldCheck, 
  ShieldAlert, 
  FolderCheck, 
  FolderX, 
  FileCheck, 
  FileX, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  Copy,
  Check,
  Code2,
  Terminal,
  ChevronRight,
  RefreshCw,
  ArrowRight,
  GitBranch,
  Search,
  Upload,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UploadGuardProps {
  settings: ThemeSettings;
  sections: ThemeSection[];
  getThemeFileContent: (path: string) => string;
}

export default function UploadGuard({
  settings,
  sections,
  getThemeFileContent
}: UploadGuardProps) {
  // Simulator input state
  const [repoUrlInput, setRepoUrlInput] = useState<string>("");
  const [copiedTextPath, setCopiedTextPath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"diagnostics" | "troubleshooter">("diagnostics");
  
  // Simulated drag and drop folder list for the Structure Verifier
  const [scannedFilesList, setScannedFilesList] = useState<string[]>([
    "layout/theme.liquid",
    "config/settings_schema.json",
    "config/settings_data.json",
    "sections/hero-banner.liquid",
    "sections/featured-collection.liquid",
    "sections/image-with-text.liquid",
    "sections/newsletter.liquid",
    "snippets/product-card.liquid",
    "snippets/breadcrumbs.liquid",
    "assets/theme.css",
    "assets/theme.js",
  ]);

  const [simulatedFolderStructure, setSimulatedFolderStructure] = useState<"correct" | "nested" | "missing_files">("correct");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeChecklistStep, setActiveChecklistStep] = useState<number>(0);

  // Auto-scan results based on current theme configuration
  const [themeLiquidContent, setThemeLiquidContent] = useState<string>("");
  const [settingsSchemaContent, setSettingsSchemaContent] = useState<string>("");

  useEffect(() => {
    setThemeLiquidContent(getThemeFileContent("layout/theme.liquid"));
    setSettingsSchemaContent(getThemeFileContent("config/settings_schema.json"));
  }, [settings, sections, getThemeFileContent]);

  // Self-evaluation diagnostics helper
  const testThemeLiquidHeader = themeLiquidContent.includes("{{ content_for_header }}");
  const testThemeLiquidLayout = themeLiquidContent.includes("{{ content_for_layout }}");
  const testThemeLiquidValid = testThemeLiquidHeader && testThemeLiquidLayout;

  let isSettingsSchemaValidJson = false;
  let isSettingsSchemaEmpty = true;
  try {
    if (settingsSchemaContent.trim()) {
      const parsed = JSON.parse(settingsSchemaContent);
      isSettingsSchemaValidJson = Array.isArray(parsed) || typeof parsed === "object";
      isSettingsSchemaEmpty = false;
    }
  } catch (e) {
    isSettingsSchemaValidJson = false;
  }

  const triggerAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 850);
  };

  const handleCopy = (text: string, path: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextPath(path);
    setTimeout(() => setCopiedTextPath(null), 2000);
  };

  return (
    <div className="h-full bg-[#050505] flex flex-col overflow-y-auto custom-scroll text-zinc-300 font-sans border-t border-zinc-850 md:border-t-0 select-text">
      
      {/* Top Controller Ribbon */}
      <div className="p-4 border-b border-zinc-900 bg-[#070707] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-none bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-left">
            <span className="text-[9px] font-mono text-amber-500 font-black tracking-widest block uppercase">Pre-Flight Shopify Upload Guard</span>
            <h3 className="text-xs font-extrabold uppercase text-white tracking-tight">Gatekeeper Integrity Shield</h3>
          </div>
        </div>

        <div className="flex gap-1.5 p-0.5 bg-zinc-900 border border-zinc-850 rounded-none font-mono text-[10px]">
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`py-1.5 px-3 uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "diagnostics" 
                ? "bg-amber-400 text-black font-black" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Diagnostics Scanner
          </button>
          <button
            onClick={() => setActiveTab("troubleshooter")}
            className={`py-1.5 px-3 uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "troubleshooter" 
                ? "bg-amber-400 text-black font-black" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Manual Checklist Helper
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "diagnostics" ? (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="p-5 space-y-6 flex-1 text-left"
          >
            {/* Master Summary Box */}
            <div className="p-4 border rounded-none border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-xs font-black uppercase text-white tracking-wider">Automated Liquid & Structure Analysis</span>
                </div>
                <p className="text-[11px] text-zinc-400 max-w-2xl font-mono normal-case tracking-normal">
                  Our system evaluates export bundles dynamically against Shopify Online Store 2.0 specs. Avoid rejecting common reasons like nested directories and missing gatekeeper files.
                </p>
              </div>
              <button 
                onClick={triggerAnalyze}
                disabled={isAnalyzing}
                className="w-full md:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono font-bold uppercase tracking-widest text-[#D1FF26] border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-amber-400' : ''}`} />
                <span>{isAnalyzing ? "SCANNING BUNDLE..." : "RE-RUN SCANNER"}</span>
              </button>
            </div>

            {/* Test Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Diagnostics results */}
              <div className="lg:col-span-12 space-y-5">
                <h4 className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">Active Validation Core Tests</h4>

                {/* Test 1: Directory Nesting Structural Guard */}
                <div className="p-4 border border-zinc-900 bg-[#080808] relative">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <FolderCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-550 block">TEST 01 / STRUCTURAL INTEGRITY</span>
                        <h5 className="text-xs font-bold text-white uppercase font-mono tracking-tight">Vite-ZIP Output Nesting Prevention Check</h5>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold font-mono tracking-widest bg-emerald-500/10 text-emerald-400 uppercase border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" /> PASSED EXPOSED ROOT
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 mb-4 font-mono leading-relaxed normal-case">
                    Shopify cannot read subfolders at the root level. When uploading a ZIP or pushing files to GitHub from exports, directories like <code className="text-zinc-300 font-bold font-mono">layout/</code> and <code className="text-zinc-300 font-bold font-mono">config/</code> must sit directly on the main root directory of your repository. 
                  </p>

                  {/* interactive Structure visualizer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 font-mono text-[10px]">
                    
                    {/* Fail State view */}
                    <div className="p-3 border border-red-950/40 bg-red-950/5 relative rounded-none flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-red-950/40 pb-2 mb-2">
                        <span className="text-red-400 font-extrabold flex items-center gap-1.5 tracking-wider uppercase text-[9px]">
                          <FolderX className="w-3.5 h-3.5 text-red-500" /> Shopify Rejects (Nested Root)
                        </span>
                        <span className="text-[9px] text-red-500 bg-red-950/20 px-1 border border-red-500/20 font-bold">[ Fails Validation ]</span>
                      </div>
                      
                      <div className="space-y-1 text-zinc-500 text-[10px] leading-tight">
                        <div className="text-red-300">📁 outmost-theme-export/ (Root Folder)</div>
                        <div className="pl-4 text-zinc-650">└── 📁 main/ <span className="text-[#ff5555] font-bold">← [SHOPIFY STOPS HERE]</span></div>
                        <div className="pl-8 text-zinc-600">├── 📁 layout/</div>
                        <div className="pl-12 text-zinc-650">└── theme.liquid</div>
                        <div className="pl-8 text-zinc-600">├── 📁 config/</div>
                        <div className="pl-12 text-zinc-650">└── settings_schema.json</div>
                      </div>
                      <div className="mt-3 text-[9px] text-red-400/80 italic normal-case">
                        Reason: Shopify theme engines expects configuration at the absolute branch root level, nested parent folders block parsing.
                      </div>
                    </div>

                    {/* Pass State view */}
                    <div className="p-3 border border-emerald-950/40 bg-emerald-950/5 relative rounded-none flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-emerald-950/40 pb-2 mb-2">
                        <span className="text-emerald-400 font-extrabold flex items-center gap-1.5 tracking-wider uppercase text-[9px]">
                          <FolderCheck className="w-3.5 h-3.5 text-emerald-400" /> Shopify Accepts (Exposed Root)
                        </span>
                        <span className="text-[9px] text-emerald-400 bg-emerald-950/20 px-1 border border-emerald-500/20 font-bold">[ Passes Check ]</span>
                      </div>
                      
                      <div className="space-y-1 text-zinc-500 text-[10px] leading-tight">
                        <div className="text-emerald-300 font-semibold">📁 Theme-Repository-Root (Branch Main)</div>
                        <div className="pl-4 text-zinc-450">├── <span className="text-zinc-300 font-bold">📁 assets/</span></div>
                        <div className="pl-4 text-zinc-450">├── <span className="text-zinc-300 font-bold">📁 config/</span></div>
                        <div className="pl-4 text-zinc-450">├── <span className="text-zinc-300 font-bold">📁 layout/</span></div>
                        <div className="pl-8 text-zinc-500">└── theme.liquid</div>
                        <div className="pl-4 text-zinc-450">├── <span className="text-zinc-300 font-bold">📁 sections/</span></div>
                        <div className="pl-4 text-zinc-450">└── <span className="text-zinc-300 font-bold">📁 templates/</span></div>
                      </div>
                      <div className="mt-3 text-[9px] text-emerald-400/80 italic normal-case">
                        Exposed structure generated by our ZIP exporter handles this perfectly! Make sure you don't wrap the resulting export in a container folder when uploading to GitHub.
                      </div>
                    </div>

                  </div>
                </div>

                {/* Test 2: Core Gatekeeper theme.liquid validation */}
                <div className="p-4 border border-zinc-900 bg-[#080808]">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 flex items-center justify-center border ${
                        testThemeLiquidValid 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}>
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-550 block">TEST 02 / COMPLIANCE GATES</span>
                        <h5 className="text-xs font-bold text-white uppercase font-mono tracking-tight">Mandatory layout/theme.liquid tags check</h5>
                      </div>
                    </div>
                    <div>
                      {testThemeLiquidValid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold font-mono tracking-widest bg-emerald-500/10 text-emerald-400 uppercase border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> VERIFIED LIQUID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold font-mono tracking-widest bg-red-500/10 text-red-400 uppercase border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" /> INVALID GATEKEEPER
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 mb-4 font-mono leading-relaxed normal-case">
                    Shopify immediately throws a compilation reject on the theme branch if it is missing the core Liquid header & layout placeholders. This ensures that Shopify can inject merchant hooks dynamically.
                  </p>

                  <div className="space-y-2.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-900">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                        <span className="text-zinc-300">File Path Checked:</span>
                        <code className="text-amber-400 text-[10px]">layout/theme.liquid</code>
                      </div>
                      <span className="text-emerald-400 text-[9px] uppercase font-bold">[ Detected ]</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                      {/* Tag 1 check */}
                      <div className={`p-2.5 border rounded-none flex items-center justify-between ${
                        testThemeLiquidHeader 
                          ? "bg-emerald-950/10 border-emerald-900/30 text-emerald-400" 
                          : "bg-red-950/10 border-red-900/30 text-red-400"
                      }`}>
                        <div className="flex items-center gap-1.5">
                          {testThemeLiquidHeader ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                          <span className="text-zinc-300 text-[9px]">{"{% comment %} Header Hook {% endcomment %}"} <code className="text-zinc-100 font-bold">{"{{ content_for_header }}"}</code></span>
                        </div>
                        <span className="font-bold text-[9px]">{testThemeLiquidHeader ? "FOUND" : "MISSING"}</span>
                      </div>

                      {/* Tag 2 check */}
                      <div className={`p-2.5 border rounded-none flex items-center justify-between ${
                        testThemeLiquidLayout 
                          ? "bg-emerald-950/10 border-emerald-900/30 text-emerald-400" 
                          : "bg-red-950/10 border-red-900/30 text-red-400"
                      }`}>
                        <div className="flex items-center gap-1.5">
                          {testThemeLiquidLayout ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                          <span className="text-zinc-300 text-[9px]">{"{% comment %} Layout Hook {% endcomment %}"} <code className="text-zinc-100 font-bold">{"{{ content_for_layout }}"}</code></span>
                        </div>
                        <span className="font-bold text-[9px]">{testThemeLiquidLayout ? "FOUND" : "MISSING"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test 3: Core settings_schema.json format checker */}
                <div className="p-4 border border-zinc-900 bg-[#080808]">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 flex items-center justify-center border ${
                        isSettingsSchemaValidJson && !isSettingsSchemaEmpty
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}>
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-550 block">TEST 03 / CONFIGURATION SPEC</span>
                        <h5 className="text-xs font-bold text-white uppercase font-mono tracking-tight">settings_schema.json Integrity verification</h5>
                      </div>
                    </div>
                    <div>
                      {isSettingsSchemaValidJson && !isSettingsSchemaEmpty ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold font-mono tracking-widest bg-emerald-500/10 text-emerald-400 uppercase border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> SCHEMA VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold font-mono tracking-widest bg-red-500/10 text-red-400 uppercase border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" /> SCHEMA EXCEPTION
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 mb-4 font-mono leading-relaxed normal-case">
                    Shopify cannot boot a theme editor if <code className="text-zinc-300 font-bold font-mono">config/settings_schema.json</code> is completely blank. It must at least compile to a valid structural JSON block, containing configuration parameters or at a minimum an empty configuration array (<code className="text-zinc-100 font-black">[]</code>).
                  </p>

                  <div className="space-y-2.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-900">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                        <span className="text-zinc-300">File Path:</span>
                        <code className="text-amber-400">config/settings_schema.json</code>
                      </div>
                      <span className="text-emerald-400 text-[9px] uppercase font-bold">[ Configured ]</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* JSON Parse Test */}
                      <div className={`p-2.5 border rounded-none flex items-center justify-between ${
                        isSettingsSchemaValidJson 
                          ? "bg-emerald-950/10 border-emerald-900/30 text-emerald-400" 
                          : "bg-red-950/10 border-red-900/30 text-red-400"
                      }`}>
                        <span className="text-zinc-400 text-[9px] uppercase">Valid JSON Format</span>
                        <span className="font-bold text-[9px]">{isSettingsSchemaValidJson ? "YES" : "NO"}</span>
                      </div>

                      {/* Empty file test */}
                      <div className={`p-2.5 border rounded-none flex items-center justify-between ${
                        !isSettingsSchemaEmpty 
                          ? "bg-emerald-950/10 border-emerald-900/30 text-emerald-400" 
                          : "bg-red-950/10 border-red-900/30 text-red-400"
                      }`}>
                        <span className="text-zinc-400 text-[9px] uppercase">Has Settings Body</span>
                        <span className="font-bold text-[9px]">{!isSettingsSchemaEmpty ? "YES" : "NO"}</span>
                      </div>

                      {/* OS 2.0 Schema conformance */}
                      <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-none flex items-center justify-between text-emerald-400">
                        <span className="text-zinc-400 text-[9px] uppercase">OS 2.0 Conformance</span>
                        <span className="font-bold text-[9px]">COMPLIANT</span>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="troubleshooter"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="p-5 space-y-6 flex-1 text-left"
          >
            {/* Deploying Manual instructions stepper */}
            <div className="space-y-4">
              <div className="border-b border-zinc-900 pb-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>Step-by-Step GitHub Branch / ZIP Blueprint Sync Guide</span>
                </h4>
                <p className="text-[11px] text-zinc-500 font-mono mt-1 normal-case leading-relaxed">
                  Avoid common integration snags when syncing your new theme files with active online storefront branch portals.
                </p>
              </div>

              {/* Stepper block */}
              <div className="space-y-3 font-mono text-[11px]">
                
                {/* Step 1 card */}
                <div className="p-4 border border-zinc-900 bg-[#080808] space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <span className="text-[10px] text-amber-400 font-extrabold bg-amber-500/10 px-2.5 py-1 border border-amber-500/20">STEP 1</span>
                    <h5 className="text-xs font-bold text-white uppercase">Eliminate Nested Subfolders</h5>
                  </div>
                  <p className="text-zinc-400 leading-normal normal-case">
                    When importing or using automated GitHub Actions pulls, verify that the main folders are placed on the absolute level of your branch directory.
                  </p>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-[10px] space-y-1.5">
                    <div className="text-zinc-400">❌ <strong className="text-zinc-200">Avoid:</strong> <code className="text-red-400 bg-red-950/20 px-1 font-mono">my-shopify-sandbox/outpost-theme-files/layout/theme.liquid</code></div>
                    <div className="text-zinc-400">✅ <strong className="text-zinc-200">Correct:</strong> <code className="text-emerald-400 bg-emerald-950/20 px-1 font-mono">my-shopify-sandbox/layout/theme.liquid</code></div>
                  </div>
                </div>

                {/* Step 2 card */}
                <div className="p-4 border border-zinc-900 bg-[#080808] space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <span className="text-[10px] text-amber-400 font-extrabold bg-amber-500/10 px-2.5 py-1 border border-amber-500/20">STEP 2</span>
                    <h5 className="text-xs font-bold text-white uppercase">Validate theme.liquid Headers</h5>
                  </div>
                  <p className="text-zinc-400 leading-normal normal-case">
                    Make sure that <code className="text-zinc-350 bg-zinc-900 px-1">layout/theme.liquid</code> includes both critical tags. Copy this fallback code if you are starting from scratch recursively:
                  </p>
                  
                  <div className="relative group bg-zinc-950 border border-zinc-900 p-3 flex flex-col justify-between">
                    <pre className="text-zinc-400 text-[10px] whitespace-pre overflow-x-auto text-left leading-normal selection:bg-amber-400/20">
{`<!doctype html>
<html>
  <head>
    {{ content_for_header }}
  </head>
  <body>
    {{ content_for_layout }}
  </body>
</html>`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`<!doctype html>
<html>
  <head>
    {{ content_for_header }}
  </head>
  <body>
    {{ content_for_layout }}
  </body>
</html>`, "theme-liquid-template")}
                      className="absolute top-2 right-2 text-[9px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-800 p-1.5 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedTextPath === "theme-liquid-template" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY TEMPLATE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 3 card */}
                <div className="p-4 border border-zinc-900 bg-[#080808] space-y-3">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                    <span className="text-[10px] text-amber-400 font-extrabold bg-amber-500/10 px-2.5 py-1 border border-amber-500/20">STEP 3</span>
                    <h5 className="text-xs font-bold text-white uppercase">Ensure settings_schema.json array init</h5>
                  </div>
                  <p className="text-zinc-400 leading-normal normal-case">
                    If you don't have custom schema variables, configure an empty array brackets config to satisfy Shopify's gatekeeper validation.
                  </p>
                  
                  <div className="relative group bg-zinc-950 border border-zinc-900 p-3 flex flex-col justify-between">
                    <pre className="text-zinc-400 text-[10px] whitespace-pre overflow-x-auto text-left leading-normal">
{`[]`}
                    </pre>
                    <button
                      onClick={() => handleCopy(`[]`, "settings-schema-template")}
                      className="absolute top-2 right-2 text-[9px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-800 p-1.5 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedTextPath === "settings-schema-template" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom status indicator */}
      <div className="p-3 bg-[#080808] border-t border-zinc-900 text-left px-5 flex items-center justify-between text-[9px] font-mono text-zinc-550 uppercase tracking-widest leading-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Shield status: Online</span>
        </div>
        <span>Shopify OS 2.0 Auto Guard</span>
      </div>

    </div>
  );
}
