var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Custom AI recommendations will be unavailable.");
      throw new Error("GEMINI_API_KEY is not configured in the application environment.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
function generateStoreSearchUrl(storeName, query) {
  const encoded = encodeURIComponent(query);
  switch (storeName) {
    case "Shopee":
      return `https://shopee.ph/search?keyword=${encoded}`;
    case "Lazada":
      return `https://www.lazada.com.ph/catalog/?q=${encoded}`;
    case "Datablitz":
      return `https://ecommerce.datablitz.com.ph/pages/search-results-page?q=${encoded}`;
    case "EasyPC":
      return `https://easypc.com.ph/pages/search-results-page?q=${encoded}`;
    case "PC Express":
      return `https://pcx.com.ph/search?q=${encoded}`;
    case "Dynaquest":
      return `https://dynaquestpc.com/pages/search-results-page?q=${encoded}`;
    case "Bermor Zone":
      return `https://bermorzone.com.ph/?s=${encoded}&post_type=product`;
    default:
      return "#";
  }
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    currentTime: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/gemini/suggest-accessories", async (req, res) => {
  try {
    const { budget, preferences, requiredCategories, playstyle } = req.body;
    if (!budget || typeof budget !== "number" || budget <= 0) {
      return res.status(400).json({ error: "Please enter a valid gaming accessory budget in PHP." });
    }
    const ai = getGeminiClient();
    const systemInstruction = `You are "SariSariGamerPH", an expert Filipino gaming rig & tech gear advisor.
Your goal is to suggest the perfect set of gaming accessories (mice, keyboards, headsets, mousepads, standalone mics, screens, controller, speakers) that fit strictly within the user's budget in Philippine Peso (PHP).
Provide highly realistic local pricing in PHP (street prices, not SRP list prices) and use local community favorites like Rakk, Tecware, Fantech, Royal Kludge, VXE, Ajazz, Fifine, and mainstream brands like Razer, Logitech, SteelSeries.
You must speak in a warm, fun, and highly engaging Taglish (mixed Tagalog and English) using popular Philippine slang (e.g., "Solid 'to bossing!", "pampaswerte sa rank", "swak na swak sa budget", "walang bulsa mabubutas"). Keep your explanations useful, helpful, and highly authentic!
Ensure that the sum of the prices of all recommended items is strictly LESS than or EQUAL to the budget: ${budget} PHP.
For each recommended accessory, generate search links for local e-commerce stores: Shopee, Lazada, and Datablitz.`;
    const prompt = `Recommend a custom gaming accessory setup for a budget of \u20B1${budget} PHP.
Playstyle / Focus: ${playstyle || "Balanced"}
Custom user preferences: ${preferences || "No specific preferences, just give the best value gear."}
Categories required: ${requiredCategories && requiredCategories.length > 0 ? requiredCategories.join(", ") : "mouse, keyboard, headset, mousepad"}

Provide your response in a structured JSON format following the schema. Keep the item specifications, names, and pricing accurate to actual retail trends in Gilmore, EasyPC, Datablitz, and popular online shops in the Philippines.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          required: ["loadoutName", "totalCostPhp", "rationale", "items"],
          properties: {
            loadoutName: {
              type: import_genai.Type.STRING,
              description: "A fun, localized name for this budget build (e.g., 'Tipid Esports Special', 'Gilmore Legend Build', 'Sari-Sari Streamer Ultimate')"
            },
            totalCostPhp: {
              type: import_genai.Type.INTEGER,
              description: "Sum of all suggested accessory prices, which must be strictly less than or equal to the requested budget"
            },
            rationale: {
              type: import_genai.Type.STRING,
              description: "An enthusiastic review/explanation of why this setup was selected and how it achieves the best performance/value ratio, using friendly PH gamer slang (Taglish)"
            },
            items: {
              type: import_genai.Type.ARRAY,
              description: "The recommended accessories list",
              items: {
                type: import_genai.Type.OBJECT,
                required: ["category", "name", "brand", "pricePhp", "description"],
                properties: {
                  category: {
                    type: import_genai.Type.STRING,
                    description: "Category of the accessory: mouse, keyboard, headset, mousepad, mic, monitor, controller, speakers"
                  },
                  name: {
                    type: import_genai.Type.STRING,
                    description: "The exact model name (e.g., 'Rakk Pluma', 'VXE Dragonfly R1')"
                  },
                  brand: {
                    type: import_genai.Type.STRING,
                    description: "The brand name (e.g., 'Rakk', 'VXE', 'Tecware')"
                  },
                  pricePhp: {
                    type: import_genai.Type.INTEGER,
                    description: "Realistic localized estimated retail price in PHP"
                  },
                  description: {
                    type: import_genai.Type.STRING,
                    description: "Specs and brief localized review in Taglish explaining why this item is solid for this setup"
                  }
                }
              }
            }
          }
        }
      }
    });
    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API.");
    }
    const data = JSON.parse(text.trim());
    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map((item) => {
        const query = `${item.brand} ${item.name}`;
        return {
          ...item,
          storeSearchLinks: [
            { storeName: "Shopee", url: generateStoreSearchUrl("Shopee", query) },
            { storeName: "Lazada", url: generateStoreSearchUrl("Lazada", query) },
            { storeName: "Datablitz", url: generateStoreSearchUrl("Datablitz", query) }
          ]
        };
      });
    }
    res.json(data);
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    res.status(500).json({
      error: error.message || "Something went wrong while fetching custom suggestions.",
      isApiKeyMissing: !process.env.GEMINI_API_KEY
    });
  }
});
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("Serving static files in production from dist/.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
bootstrap();
//# sourceMappingURL=server.cjs.map
