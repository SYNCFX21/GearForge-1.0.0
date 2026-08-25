import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" })); // tighten to your actual domain(s) later
app.use(express.json());

// Initialize Gemini client lazily to prevent crashing on boot if key is missing,
// but checking and providing clear logs.
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Custom AI recommendations will be unavailable.");
      throw new Error("GEMINI_API_KEY is not configured in the application environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper to generate search URLs on server-side
function generateStoreSearchUrl(storeName: string, query: string): string {
  const encoded = encodeURIComponent(query);
  switch (storeName) {
    case 'Shopee':
      return `https://shopee.ph/search?keyword=${encoded}`;
    case 'Lazada':
      return `https://www.lazada.com.ph/catalog/?q=${encoded}`;
    case 'Datablitz':
      return `https://ecommerce.datablitz.com.ph/pages/search-results-page?q=${encoded}`;
    case 'EasyPC':
      return `https://easypc.com.ph/pages/search-results-page?q=${encoded}`;
    case 'PC Express':
      return `https://pcx.com.ph/search?q=${encoded}`;
    case 'Dynaquest':
      return `https://dynaquestpc.com/pages/search-results-page?q=${encoded}`;
    case 'Bermor Zone':
      return `https://bermorzone.com.ph/?s=${encoded}&post_type=product`;
    default:
      return '#';
  }
}

// 1. Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    hasApiKey: !!process.env.GEMINI_API_KEY,
    currentTime: new Date().toISOString()
  });
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

app.use("/api/gemini", aiLimiter);

// 2. Custom AI gaming accessory suggestion route
app.post("/api/gemini/suggest-accessories", async (req, res) => {
  try {
    const { budget, preferences, requiredCategories, playstyle } = req.body;

    if (!budget || typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ error: "Please enter a valid gaming accessory budget in PHP." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are "SariSariGamerPH", an expert Filipino gaming rig & tech gear advisor.
Your goal is to suggest the perfect set of gaming accessories (mice, keyboards, headsets, mousepads, standalone mics, screens, controller, speakers) that fit strictly within the user's budget in Philippine Peso (PHP).
Provide highly realistic local pricing in PHP (street prices, not SRP list prices) and use local community favorites like Rakk, Tecware, Fantech, Royal Kludge, VXE, Ajazz, Fifine, and mainstream brands like Razer, Logitech, SteelSeries.
You must speak in a warm, fun, and highly engaging Taglish (mixed Tagalog and English) using popular Philippine slang (e.g., "Solid 'to bossing!", "pampaswerte sa rank", "swak na swak sa budget", "walang bulsa mabubutas"). Keep your explanations useful, helpful, and highly authentic!
Ensure that the sum of the prices of all recommended items is strictly LESS than or EQUAL to the budget: ${budget} PHP.
For each recommended accessory, generate search links for local e-commerce stores: Shopee, Lazada, and Datablitz.`;

    const prompt = `Recommend a custom gaming accessory setup for a budget of ₱${budget} PHP.
Playstyle / Focus: ${playstyle || 'Balanced'}
Custom user preferences: ${preferences || 'No specific preferences, just give the best value gear.'}
Categories required: ${requiredCategories && requiredCategories.length > 0 ? requiredCategories.join(', ') : 'mouse, keyboard, headset, mousepad'}

Provide your response in a structured JSON format following the schema. Keep the item specifications, names, and pricing accurate to actual retail trends in Gilmore, EasyPC, Datablitz, and popular online shops in the Philippines.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["loadoutName", "totalCostPhp", "rationale", "items"],
          properties: {
            loadoutName: {
              type: Type.STRING,
              description: "A fun, localized name for this budget build (e.g., 'Tipid Esports Special', 'Gilmore Legend Build', 'Sari-Sari Streamer Ultimate')"
            },
            totalCostPhp: {
              type: Type.INTEGER,
              description: "Sum of all suggested accessory prices, which must be strictly less than or equal to the requested budget"
            },
            rationale: {
              type: Type.STRING,
              description: "An enthusiastic review/explanation of why this setup was selected and how it achieves the best performance/value ratio, using friendly PH gamer slang (Taglish)"
            },
            items: {
              type: Type.ARRAY,
              description: "The recommended accessories list",
              items: {
                type: Type.OBJECT,
                required: ["category", "name", "brand", "pricePhp", "description"],
                properties: {
                  category: {
                    type: Type.STRING,
                    description: "Category of the accessory: mouse, keyboard, headset, mousepad, mic, monitor, controller, speakers"
                  },
                  name: {
                    type: Type.STRING,
                    description: "The exact model name (e.g., 'Rakk Pluma', 'VXE Dragonfly R1')"
                  },
                  brand: {
                    type: Type.STRING,
                    description: "The brand name (e.g., 'Rakk', 'VXE', 'Tecware')"
                  },
                  pricePhp: {
                    type: Type.INTEGER,
                    description: "Realistic localized estimated retail price in PHP"
                  },
                  description: {
                    type: Type.STRING,
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

    // Inject actual store links programmatically based on recommended item names
    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map((item: any) => {
        const query = `${item.brand} ${item.name}`;
        return {
          ...item,
          storeSearchLinks: [
            { storeName: 'Shopee', url: generateStoreSearchUrl('Shopee', query) },
            { storeName: 'Lazada', url: generateStoreSearchUrl('Lazada', query) },
            { storeName: 'Datablitz', url: generateStoreSearchUrl('Datablitz', query) }
          ]
        };
      });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Gemini suggestion error:", error);
    res.status(500).json({ 
      error: error.message || "Something went wrong while fetching custom suggestions.",
      isApiKeyMissing: !process.env.GEMINI_API_KEY
    });
  }
});

// 3. PC Builder AI Endpoint
app.post("/api/gemini/build-pc", async (req, res) => {
  try {
    const { budget, preferences, resolution } = req.body;

    if (!budget || typeof budget !== 'number' || budget <= 0) {
      return res.status(400).json({ error: "Please enter a valid PC build budget in PHP." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are "SariSariGamerPH", an expert Filipino PC Builder & tech advisor.
Your goal is to suggest the perfect PC build (parts: CPU, Motherboard, GPU, RAM, Storage, Case, PSU, Cooler) that fits strictly within the user's budget in Philippine Peso (PHP).
Provide highly realistic local pricing in PHP (street prices, not SRP list prices) and use local community favorites in the Philippines (e.g., Dynaquest, EasyPC, Datablitz pricing).
You must speak in a warm, fun, and highly engaging Taglish (mixed Tagalog and English) using popular Philippine slang (e.g., "Solid 'to bossing!", "pampaswerte sa rank", "swak na swak sa budget"). Keep your explanations useful, helpful, and highly authentic!
Ensure that the sum of the prices of all recommended parts is strictly LESS than or EQUAL to the budget: ${budget} PHP.
For each recommended part, generate search links for local e-commerce stores: Shopee, Lazada, and EasyPC.`;

    const prompt = `Recommend a custom PC build for a budget of ₱${budget} PHP.
Target Resolution / Focus: ${resolution || '1080p'}
Custom user preferences: ${preferences || 'No specific preferences, just give the best value build.'}

Provide your response in a structured JSON format following the schema. Keep the item specifications, names, and pricing accurate to actual retail trends in Gilmore, EasyPC, Datablitz, and popular online shops in the Philippines.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["buildName", "totalCostPhp", "rationale", "parts"],
          properties: {
            buildName: {
              type: Type.STRING,
              description: "A fun, localized name for this budget build (e.g., 'Gilmore Special', 'Tipid 1080p Beast')"
            },
            totalCostPhp: {
              type: Type.INTEGER,
              description: "Sum of all suggested part prices, which must be strictly less than or equal to the requested budget"
            },
            rationale: {
              type: Type.STRING,
              description: "An enthusiastic review/explanation of why this build was selected and how it achieves the best performance/value ratio, using friendly PH gamer slang (Taglish)"
            },
            estimatedFps1080p: {
              type: Type.STRING,
              description: "Estimated FPS in popular games at 1080p (e.g., 'Valorant: 300+ FPS, Cyberpunk 2077: 60 FPS')"
            },
            parts: {
              type: Type.ARRAY,
              description: "The recommended PC parts list",
              items: {
                type: Type.OBJECT,
                required: ["category", "name", "brand", "pricePhp", "description"],
                properties: {
                  category: {
                    type: Type.STRING,
                    description: "Category of the part: cpu, motherboard, gpu, ram, storage, case, psu, cooler"
                  },
                  name: {
                    type: Type.STRING,
                    description: "The exact model name (e.g., 'Ryzen 5 5600', 'RX 6600')"
                  },
                  brand: {
                    type: Type.STRING,
                    description: "The brand name (e.g., 'AMD', 'Gigabyte', 'Corsair')"
                  },
                  pricePhp: {
                    type: Type.INTEGER,
                    description: "Realistic localized estimated retail price in PHP"
                  },
                  description: {
                    type: Type.STRING,
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

    // Inject actual store links programmatically based on recommended item names
    if (data.parts && Array.isArray(data.parts)) {
      data.parts = data.parts.map((part: any) => {
        const query = `${part.brand} ${part.name}`;
        return {
          ...part,
          storeSearchLinks: [
            { storeName: 'Shopee', url: generateStoreSearchUrl('Shopee', query) },
            { storeName: 'Lazada', url: generateStoreSearchUrl('Lazada', query) },
            { storeName: 'EasyPC', url: generateStoreSearchUrl('EasyPC', query) }
          ]
        };
      });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Gemini PC build error:", error);
    res.status(500).json({ 
      error: error.message || "Something went wrong while fetching custom PC build suggestions.",
      isApiKeyMissing: !process.env.GEMINI_API_KEY
    });
  }
});


// Vite / static file serving integration
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // In development mode, mount Vite dev server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    // In production mode, serve built static files from dist directory
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static files in production from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

bootstrap();
