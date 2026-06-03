import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy-loaded GenAI helper to prevent startup crash if API key is missing
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[GoogleGenAI] WARNING: GEMINI_API_KEY is not defined. Falling back to local offline generation.");
    return null;
  }
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// 1. API: Generate custom Shopify theme section utilizing Gemini
app.post("/api/gemini/generate-section", async (req, res) => {
  const { prompt, themeSettings, pageType } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  const ai = getGenAI();

  // Handle Offline Fallback Mode gracefully
  if (!ai) {
    console.log(`[GoogleGenAI] Safe fallback triggered for prompt: "${prompt}"`);
    return res.json({
      fallback: true,
      data: getOfflineSectionFallback(prompt, themeSettings || {}, pageType || "index"),
      message: "API Key not set. Generated layout locally. (Provide GEMINI_API_KEY in Secrets for real AI creation)."
    });
  }

  try {
    const systemPrompt = `You are an expert Shopify Liquid developer and frontend UI designer.
Your goal is to parse a requested store element prompt and generate:
1. A visual section configuration JSON (representing blocks, images, headings, and styling).
2. Clean, valid Shopify Liquid markup.
3. A matching schema configuration block.

Make the generated template look highly premium and polished (modern clean layout, elegant typography, generous whitespace). Use rich text defaults.
For images, generate beautiful relevant descriptive high-quality royalty-free placeholder images from unspash using the search query e.g., 'https://images.unsplash.com/photo-...+search+query'.
Ensure variables inside the Liquid code reference the customizer schema settings exactly.`;

    const instructions = `Generate a Shopify section template with the following requirements:
- Input Prompt: "${prompt}"
- Active Theme Color Settings: ${JSON.stringify(themeSettings || {})}
- Store Page: "${pageType || "index"}"

Provide the response in the JSON structure below. Make sure the 'liquidCode' is a fully functional theme section complete with HTML and Liquid tags. Make sure 'schema' is a valid JSON schema block representation for Shopify.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: instructions,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["sectionId", "type", "title", "visuals", "liquidCode", "schema"],
          properties: {
            sectionId: {
              type: Type.STRING,
              description: "A unique camelCase or kebab-case identifier for this section type."
            },
            type: {
              type: Type.STRING,
              description: "Categorical group key of the section, e.g., 'hero-banner', 'featured-products', 'testimonials', 'image-with-text'."
            },
            title: {
              type: Type.STRING,
              description: "Human-readable label of the section."
            },
            visuals: {
              type: Type.OBJECT,
              description: "Visual and content properties representing state key-values to bind to the React renderer.",
              required: ["layout", "heading", "blocks"],
              properties: {
                layout: {
                  type: Type.STRING,
                  description: "Grid structure layout e.g. 'flex-col', 'grid-2-cols', 'slider'."
                },
                heading: {
                  type: Type.STRING,
                  description: "Section main title."
                },
                subheading: {
                  type: Type.STRING,
                  description: "Optional section subtitle/descriptor."
                },
                ctaText: {
                  type: Type.STRING,
                  description: "Button text."
                },
                ctaUrl: {
                  type: Type.STRING,
                  description: "Button link URL."
                },
                backgroundImage: {
                  type: Type.STRING,
                  description: "Unsplash image URL matched with search keywords fitting the brand request context."
                },
                backgroundColor: {
                  type: Type.STRING,
                  description: "Tailwind or HEX background representation conforming to requested layout palette."
                },
                blocks: {
                  type: Type.ARRAY,
                  description: "Inner structural cards or feature lists.",
                  items: {
                    type: Type.OBJECT,
                    required: ["title"],
                    properties: {
                      title: { type: Type.STRING },
                      subtitle: { type: Type.STRING },
                      description: { type: Type.STRING },
                      tag: { type: Type.STRING },
                      price: { type: Type.STRING },
                      imageUrl: { type: Type.STRING },
                      buttonText: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            liquidCode: {
              type: Type.STRING,
              description: "Fully composed HTML + Shopify Liquid code representing this section. Make it structured, include settings variables references like {{ section.settings.heading }}."
            },
            schema: {
              type: Type.OBJECT,
              description: "Shopify JSON schema structure matching the options in Liquid code."
            }
          }
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty response received from Gemini.");
    }

    const payload = JSON.parse(textResponse);
    return res.json({ fallback: false, data: payload });

  } catch (err: any) {
    console.error("[GoogleGenAI] Error generating AI theme section:", err);
    return res.status(500).json({
      error: "Failed to generate AI section",
      details: err.message,
      fallback: true,
      data: getOfflineSectionFallback(prompt, themeSettings || {}, pageType || "index")
    });
  }
});

// Mock/Offline Fallback database search or structural formulation
function getOfflineSectionFallback(prompt: string, settings: any, pageType: string) {
  const normalized = prompt.toLowerCase();
  
  // Decide best placeholder images
  let imageQuery = "fashion";
  if (normalized.includes("watch") || normalized.includes("ghadi")) imageQuery = "luxury-watch";
  else if (normalized.includes("shoes") || normalized.includes("jootay")) imageQuery = "sneakers";
  else if (normalized.includes("organic") || normalized.includes("skincare") || normalized.includes("cream")) imageQuery = "cosmetics";
  else if (normalized.includes("furniture") || normalized.includes("bedding")) imageQuery = "interior-design";

  const placeholderImages = [
    `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60`, // product placeholder
    `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60`, // sneakers
    `https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop&q=60`, // watch
    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60`  // headphones
  ];

  const matchedImg = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];

  // Create section based on keywords
  if (normalized.includes("products") || normalized.includes("collection") || normalized.includes("jootay") || normalized.includes("shoes")) {
    return {
      sectionId: "featured-collection-ai-" + Date.now(),
      type: "featured-collection",
      title: "AI Featured Products List",
      visuals: {
        layout: "grid-3-cols",
        heading: "Polished Essentials",
        subheading: "Tailored directly by our design studio to matching specifications.",
        ctaText: "Explore Collection",
        backgroundColor: "bg-slate-50",
        backgroundImage: "",
        blocks: [
          {
            title: "Premium Handcrafted Classic",
            price: "$189.00",
            tag: "Best Seller",
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
            description: "Built with high durability components and responsive fit technologies."
          },
          {
            title: "Performance Lite Trainer",
            price: "$145.00",
            tag: "New Arrival",
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            description: "Signature breathability layout engineered with recycled active fibers."
          },
          {
            title: "Studio Chronograph Model",
            price: "$320.00",
            tag: "Limited Edition",
            imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80",
            description: "Sleek tactical visual aesthetics pairing luxury metals and precise dynamics."
          }
        ]
      },
      liquidCode: `<!-- AI-Generated Section: Featured Collection -->
<div class="shopify-section-featured-products" style="background-color: {{ section.settings.bg_color }}">
  <div class="container-width max-w-7xl mx-auto px-6 py-12">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-sans font-bold tracking-tight text-gray-900 mb-2">
        {{ section.settings.heading | default: 'Polished Essentials' }}
      </h2>
      <p class="text-sm text-gray-500 font-mono">{{ section.settings.subheading }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {% for block in section.blocks %}
        <div class="group bg-white rounded-xl shadow-xs overflow-hidden border border-gray-100 transition duration-300 hover:shadow-md">
          <div class="relative aspect-square overflow-hidden bg-gray-50">
            <img src="{{ block.settings.image | image_url: 'medium' }}" alt="{{ block.settings.title }}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
            {% if block.settings.tag != blank %}
              <span class="absolute top-4 left-4 bg-black text-white text-xs font-mono px-2 py-1 tracking-wider uppercase rounded">
                {{ block.settings.tag }}
              </span>
            {% endif %}
          </div>
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{{ block.settings.title }}</h3>
            <p class="text-sm font-mono text-emerald-600 mb-3">{{ block.settings.price }}</p>
            <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">{{ block.settings.description }}</p>
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</div>

{% schema %}
{
  "name": "AI Featured Products List",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Polished Essentials"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subheading",
      "default": "Tailored directly by our design studio."
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#f8fafc"
    }
  ],
  "blocks": [
    {
      "type": "product_item",
      "name": "Product Card",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Product Image" },
        { "type": "text", "id": "title", "label": "Title", "default": "Product Title" },
        { "type": "text", "id": "price", "label": "Price", "default": "$99.00" },
        { "type": "text", "id": "tag", "label": "Tag", "default": "New" },
        { "type": "textarea", "id": "description", "label": "Description" }
      ]
    }
  ]
}
{% endschema %}`
    };
  }

  // Fallback Hero
  return {
    sectionId: "hero-banner-ai-" + Date.now(),
    type: "hero-banner",
    title: "AI Modern Hero Banner",
    visuals: {
      layout: "flex-col",
      heading: prompt.length > 50 ? "Bespoke Design Suite" : prompt,
      subheading: "Elegant premium storefront section generated dynamically by Gemini AI.",
      ctaText: "Discover Premium",
      ctaUrl: "#",
      backgroundImage: `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=85`,
      backgroundColor: "bg-slate-900",
      blocks: [
        { title: "High-contrast Typography" },
        { title: "Fully Responsive Sections" },
        { title: "Shopify Customizer Ready Code" }
      ]
    },
    liquidCode: `<!-- AI-Generated Section: Hero Banner -->
<section class="relative bg-slate-900 text-white overflow-hidden py-24 md:py-32">
  <div class="absolute inset-0 bg-cover bg-center opacity-40" style="background-image: url('{{ section.settings.image | image_url: 'large' }}')"></div>
  <div class="container-width max-w-7xl mx-auto px-6 relative z-10 text-center">
    <span class="text-xs uppercase tracking-widest text-[#a855f7] font-mono mb-4 inline-block">AI Generated Template</span>
    <h1 class="text-4xl md:text-6xl font-sans font-extrabold tracking-tight mb-6">
      {{ section.settings.heading | default: 'Bespoke Design Suite' }}
    </h1>
    <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-serif leading-relaxed">
      {{ section.settings.subheading }}
    </p>
    {% if section.settings.cta_text != blank %}
      <a href="{{ section.settings.cta_link }}" class="inline-block bg-white text-slate-900 font-sans px-8 py-3 rounded-md font-medium tracking-wide hover:bg-slate-100 transition-colors">
        {{ section.settings.cta_text }}
      </a>
    {% endif %}
  </div>
</section>

{% schema %}
{
  "name": "AI Modern Hero Banner",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background Image"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Banner Title",
      "default": "Bespoke Design Suite"
    },
    {
      "type": "text",
      "id": "subheading",
      "label": "Subheading Descriptions"
    },
    {
      "type": "text",
      "id": "cta_text",
      "label": "Button Label",
      "default": "Discover Premium"
    },
    {
      "type": "url",
      "id": "cta_link",
      "label": "Button Destination URL"
    }
  ]
}
{% endschema %}`
  };
}

// 2. Integration of Vite Midleware for assets server & hot module routing
const isProd = process.env.NODE_ENV === "production";

async function runExpress() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Shopify Theme Builder] Fullstack server booted successfully`);
    console.log(`[Shopify Theme Builder] Running live on http://localhost:${PORT}`);
  });
}

runExpress();
