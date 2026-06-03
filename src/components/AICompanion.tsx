import React, { useState } from "react";
import { ThemeSettings, ThemeSection } from "../types";
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  AlertCircle, 
  Loader2, 
  CornerDownLeft, 
  RefreshCw,
  Clock,
  ArrowRight
} from "lucide-react";

interface AICompanionProps {
  settings: ThemeSettings;
  onAddSection: (section: ThemeSection) => void;
  activePage: "home" | "product" | "collection" | "cart";
}

export default function AICompanion({
  settings,
  onAddSection,
  activePage
}: AICompanionProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<ThemeSection | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Fast inspiration suggestions for Shopify theme builders
  const inspirationPrompts = [
    { title: "Watch Banner", prompt: "Make an ultra-premium dark leather watch hero banner", tag: "Luxury" },
    { title: "Skincare Testimonial", prompt: "Skincare product review section with grid rating stars", tag: "Social Proof" },
    { title: "Royal Bedding", prompt: "Mujhe royal bedding brand k liye elegant header block chahiye with ivory colors", tag: "Urdu Mix" },
    { title: "Sneaker Drop", prompt: "Cyberpunk neon sneakers hot-release listing section", tag: "Tech" }
  ];

  const handleGenerateSection = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setNotice(null);

    try {
      const response = await fetch("/api/gemini/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: activePrompt,
          themeSettings: settings,
          pageType: activePage
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.data) {
        throw new Error(result.error || "Failed rendering AI layout blueprints.");
      }

      const cleanSection: ThemeSection = {
        sectionId: result.data.sectionId || "ai-section-" + Date.now(),
        type: result.data.type || "custom-ai",
        title: result.data.title || "AI Generated Block",
        visuals: result.data.visuals || { heading: activePrompt, layout: "flex-col" },
        liquidCode: result.data.liquidCode || "",
        schema: result.data.schema || {}
      };

      setLastGenerated(cleanSection);
      if (result.fallback) {
        setNotice("Running in Offline Simulator Mode (Secrets API Key is omitted).");
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong while composing layouts.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInject = () => {
    if (!lastGenerated) return;
    onAddSection(lastGenerated);
    setLastGenerated(null);
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200">
      {/* Title Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase tracking-widest block">Gemini 3.5 Assistant</span>
            <h2 className="text-xs font-bold text-white leading-none">AI Section Designer</h2>
          </div>
        </div>
      </div>

      {/* Main Panel Scrolling body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
        
        {/* Suggestion Prompts */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Creative Prompts Ideas</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {inspirationPrompts.map((item, idx) => (
              <button
                key={idx}
                disabled={isGenerating}
                onClick={() => {
                  setPrompt(item.prompt);
                  handleGenerateSection(item.prompt);
                }}
                className="bg-slate-950/40 border border-slate- * border-slate-800 hover:border-slate-700/80 hover:bg-slate-800/20 rounded-lg p-2.5 text-left transition duration-150 cursor-pointer text-slate-300 disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-200">{item.title}</span>
                  <span className="text-[8px] font-mono bg-slate-800 px-1 py-0.2 rounded-sm text-slate-500">{item.tag}</span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed font-sans">{item.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Input prompt area */}
        <div className="space-y-2 bg-slate-950/30 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Custom AI Brief</span>
          
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything, Urdu / English: 'Add gold minimal parfum showcase grid'..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs leading-relaxed focus:border-purple-500 focus:outline-none resize-none font-sans text-slate-200 pb-10 custom-scroll"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <span className="text-[9px] text-slate-600 font-mono hidden md:inline">Ctrl + Enter</span>
              <button
                onClick={() => handleGenerateSection()}
                disabled={isGenerating || !prompt.trim()}
                className="w-7 h-7 rounded-md bg-purple-600 text-white flex items-center justify-center hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all cursor-pointer shadow-lg shadow-purple-600/15"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Loading block with comfortable texts */}
        {isGenerating && (
          <div className="border border-purple-500/10 bg-purple-500/[0.02] rounded-xl p-4 text-center space-y-3 shrink-0">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400 mx-auto" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Formulating Shopify Blueprints...</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed max-w-xs mx-auto">
                Gemini is composing semantic Liquid markup, defining schema arrays config, and selecting high-contrast royalty-free assets.
              </p>
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div className="border border-rose-500/10 bg-rose-500/[0.02] rounded-xl p-3 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-rose-300">Layout Engine Notice</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* API Warning Notice Banner if offline fallback occurred */}
        {notice && (
          <div className="border border-amber-500/10 bg-amber-500/[0.01] rounded-xl p-3 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-300">Simulator Mode Warning</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Using premium design pre-formulations. Please specify your private <strong className="text-white">GEMINI_API_KEY</strong> inside Settings menu Secrets for custom prompt generations!
              </p>
            </div>
          </div>
        )}

        {/* Presentation of newly generated section blueprints */}
        {lastGenerated && !isGenerating && (
          <div className="border border-emerald-500/20 bg-emerald-500/[0.01] rounded-xl p-4 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h3 className="text-xs font-bold text-white">Blueprint Ready: {lastGenerated.title}</h3>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal">
              A custom Shopify Liquid component has been crafted. It is structured to absorb global setting colors (<span className="text-purple-400 font-mono">accent_color</span>) dynamically.
            </p>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[10px] space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Section Name:</span>
                <span className="text-slate-300">{lastGenerated.title}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Theme File:</span>
                <span className="text-slate-300">sections/{lastGenerated.sectionId}.liquid</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Layout Target:</span>
                <span className="text-indigo-400">{lastGenerated.visuals.layout}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleInject}
                className="flex-1 bg-emerald-500 font-sans hover:bg-emerald-400 text-slate-950 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10 transition-colors"
              >
                Inject into Theme PREVIEW
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
