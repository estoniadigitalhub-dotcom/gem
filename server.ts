import express from "express";
import path from "path";
import Stripe from "stripe";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Lazy initializer for Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Lazy initializer for Stripe
let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      stripeClient = new Stripe(key, {
        apiVersion: "2025-01-27.acacia" as any,
      });
    } else {
      console.warn("STRIPE_SECRET_KEY is not defined. Falling back to simulated Stripe mode.");
    }
  }
  return stripeClient;
}

// API endpoint for AI Landing Page Generation
app.post("/api/generate", async (req, res) => {
  try {
    const { businessName, category, description, audience, tone, themePreference } = req.body;

    const ai = getGeminiClient();
    
    const systemInstruction = 
      "You are an elite expert landing page designer, product copywriter, and conversion rate optimizer. " +
      "Your goal is to generate exceptionally high-converting, beautiful, copy-written landing pages. " +
      "Translate the inputs into tailored, high-converting product copy. Avoid any generic filler or placeholder text. " +
      "Structure the pricing plans, feature benefits, stats, FAQs, and quotes perfectly for their business model and category.";

    const prompt = `
      Create a stunning landing page for:
      - Business Name: ${businessName}
      - Category: ${category}
      - Description: ${description}
      - Target Audience: ${audience}
      - Tone: ${tone}
      - Theme/Color Style: ${themePreference}

      Please generate all content tailored to this input. Make the copy professional, persuasive, and directly speaking to ${audience}.
      Provide a highly relevant search query for Unsplash photos (under imageUrl) and a precise 40-word prompt for generating a custom hero illustration or photo using an AI image generator (under imagePrompt).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            businessName: { type: Type.STRING },
            tagline: { type: Type.STRING },
            theme: { type: Type.STRING },
            colors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING, description: "A beautiful primary color hex code fitting the theme." },
                primaryHover: { type: Type.STRING, description: "A slightly darker hover state hex code for the primary color." },
                secondary: { type: Type.STRING, description: "An accent or secondary color hex code fitting the theme." },
                background: { type: Type.STRING, description: "A light/dark ambient background hex code." },
                text: { type: Type.STRING, description: "A rich contrast text color hex code." },
                cardBg: { type: Type.STRING, description: "A clean matching card background hex code." },
                border: { type: Type.STRING, description: "A subtle border color hex code." },
              },
              required: ["primary", "primaryHover", "secondary", "background", "text", "cardBg", "border"]
            },
            hero: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                ctaPrimary: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    action: { type: Type.STRING },
                  },
                  required: ["label", "action"]
                },
                ctaSecondary: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    action: { type: Type.STRING },
                  },
                  required: ["label", "action"]
                },
                imageUrl: { type: Type.STRING, description: "A highly relevant Unsplash category search term or specific keyword, e.g. 'saas-analytics-app' or 'vintage-bakery-bread'." },
                imagePrompt: { type: Type.STRING, description: "A detailed 40-word prompt for generating a beautiful hero illustration or photo using an AI image generator." }
              },
              required: ["headline", "subheadline", "ctaPrimary", "ctaSecondary", "imageUrl", "imagePrompt"]
            },
            features: {
              type: Type.ARRAY,
              description: "A list of exactly 3 or 4 compelling core feature benefits.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  icon: { type: Type.STRING, description: "Lucide-react icon name, select strictly from: Zap, Shield, Sparkles, LineChart, Target, Heart, Layers, Cpu, Award, Globe, MessageSquare, Clock, Users, ArrowUpRight." }
                },
                required: ["id", "title", "description", "icon"]
              }
            },
            stats: {
              type: Type.ARRAY,
              description: "A list of exactly 3 relevant success stats.",
              items: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.STRING },
                  label: { type: Type.STRING }
                },
                required: ["value", "label"]
              }
            },
            testimonials: {
              type: Type.ARRAY,
              description: "A list of exactly 2 or 3 high-quality customer quotes/testimonials.",
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING },
                  author: { type: Type.STRING },
                  role: { type: Type.STRING },
                  avatarUrl: { type: Type.STRING, description: "Gender-appropriate UI initials descriptor or standard avatar description like 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'" }
                },
                required: ["quote", "author", "role", "avatarUrl"]
              }
            },
            pricing: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                tiers: {
                  type: Type.ARRAY,
                  description: "A list of 2 or 3 structured pricing plans, e.g., Starter, Pro, Enterprise.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      price: { type: Type.STRING },
                      period: { type: Type.STRING },
                      description: { type: Type.STRING },
                      features: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      isPopular: { type: Type.BOOLEAN },
                      stripePriceId: { type: Type.STRING, description: "An appropriate placeholder Stripe price ID, e.g., price_starter_123 or price_pro_123" }
                    },
                    required: ["id", "name", "price", "period", "description", "features", "isPopular"]
                  }
                }
              },
              required: ["title", "subtitle", "tiers"]
            },
            faqs: {
              type: Type.ARRAY,
              description: "A list of exactly 4 or 5 high-yield FAQs.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            },
            footer: {
              type: Type.OBJECT,
              properties: {
                copyright: { type: Type.STRING },
                links: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      href: { type: Type.STRING }
                    },
                    required: ["label", "href"]
                  }
                }
              },
              required: ["copyright", "links"]
            }
          },
          required: [
            "businessName",
            "tagline",
            "theme",
            "colors",
            "hero",
            "features",
            "stats",
            "testimonials",
            "pricing",
            "faqs",
            "footer"
          ]
        }
      }
    });

    const landingPageData = JSON.parse(response.text || "{}");
    
    // Inject a random ID
    landingPageData.id = "lp_" + Math.random().toString(36).substring(2, 11);
    
    res.json(landingPageData);
  } catch (error: any) {
    console.error("AI Generation failed:", error);
    res.status(500).json({ error: error.message || "Failed to generate landing page with Gemini." });
  }
});

// API endpoint for regenerating a specific section
app.post("/api/regenerate-section", async (req, res) => {
  try {
    const { sectionType, currentContent, prompt, businessName, tone } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = 
      "You are an elite expert landing page content writer. Your task is to rewrite a specific section " +
      "of a landing page based on the user's specific improvement request. Keep the JSON structure exactly " +
      "as given. Make the copywriting highly engaging and tailored to their business name.";

    const fullPrompt = `
      You are rewriting the "${sectionType}" section for the business "${businessName}".
      The current content is:
      ${JSON.stringify(currentContent, null, 2)}

      The user's refinement request is:
      "${prompt}"

      Rewrite this content to satisfy the refinement request.
      Tone should be: ${tone || "persuasive"}.
      Return the rewritten content in the EXACT same JSON schema/structure as the original currentContent object. No wrapping or extra fields.
    `;

    // Map section types to schema types for precise return JSON structures
    let sectionSchema: any = { type: Type.OBJECT };
    if (sectionType === "hero") {
      sectionSchema = {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          subheadline: { type: Type.STRING },
          ctaPrimary: {
            type: Type.OBJECT,
            properties: { label: { type: Type.STRING }, action: { type: Type.STRING } },
            required: ["label", "action"]
          },
          ctaSecondary: {
            type: Type.OBJECT,
            properties: { label: { type: Type.STRING }, action: { type: Type.STRING } },
            required: ["label", "action"]
          },
          imageUrl: { type: Type.STRING },
          imagePrompt: { type: Type.STRING }
        },
        required: ["headline", "subheadline", "ctaPrimary", "ctaSecondary", "imageUrl", "imagePrompt"]
      };
    } else if (sectionType === "features") {
      sectionSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            icon: { type: Type.STRING }
          },
          required: ["id", "title", "description", "icon"]
        }
      };
    } else if (sectionType === "pricing") {
      sectionSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          tiers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                price: { type: Type.STRING },
                period: { type: Type.STRING },
                description: { type: Type.STRING },
                features: { type: Type.ARRAY, items: { type: Type.STRING } },
                isPopular: { type: Type.BOOLEAN },
                stripePriceId: { type: Type.STRING }
              },
              required: ["id", "name", "price", "period", "description", "features", "isPopular"]
            }
          }
        },
        required: ["title", "subtitle", "tiers"]
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: sectionSchema
      }
    });

    const rewrittenData = JSON.parse(response.text || "{}");
    res.json(rewrittenData);
  } catch (error: any) {
    console.error("Section regeneration failed:", error);
    res.status(500).json({ error: error.message || "Failed to regenerate section." });
  }
});

// API endpoint to generate custom AI image using gemini-3.1-flash-lite-image
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio } = req.body;
    const ai = getGeminiClient();

    // Check if Stripe key or Premium access is simulated or real
    // We run the content generation for images
    console.log(`Generating image for prompt: "${prompt}" with aspect ratio: ${aspectRatio || "1:1"}`);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          { text: prompt || "A sleek modern corporate tech website background illustration, abstract, high tech, digital art." }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1"
        }
      }
    });

    let base64Image = "";
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (base64Image) {
      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } else {
      res.status(400).json({ error: "No image inline data returned from Gemini." });
    }
  } catch (error: any) {
    console.error("AI Image Generation failed:", error);
    // Return a nice fallback message rather than crashing, so if they don't have paid keys, they get a descriptive message
    res.status(500).json({ 
      error: error.message || "Failed to generate image.",
      isQuotaError: error.message?.toLowerCase().includes("quota") || error.message?.toLowerCase().includes("billing")
    });
  }
});

// API endpoint to create a Stripe checkout session (handles both Upgrade & Client Checkout)
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  try {
    const { itemType, itemName, priceAmount, successUrl, cancelUrl, pageId, tierId } = req.body;
    const stripe = getStripe();

    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const finalSuccessUrl = successUrl || `${appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=${itemType}&pageId=${pageId || ""}&tierId=${tierId || ""}`;
    const finalCancelUrl = cancelUrl || `${appUrl}/?payment_cancelled=true`;

    if (!stripe) {
      // FALLBACK: Simulated Stripe session because STRIPE_SECRET_KEY is missing
      const mockSessionId = "cs_mock_" + Math.random().toString(36).substring(2, 11);
      const simulatedCheckoutUrl = `/simulated-checkout?session_id=${mockSessionId}&itemType=${itemType}&itemName=${encodeURIComponent(itemName)}&priceAmount=${priceAmount}&successUrl=${encodeURIComponent(finalSuccessUrl)}&cancelUrl=${encodeURIComponent(finalCancelUrl)}`;
      
      return res.json({
        id: mockSessionId,
        url: simulatedCheckoutUrl,
        isMock: true,
        message: "Stripe is running in Demo/Simulated mode. Creating a gorgeous local sandbox checkout session."
      });
    }

    // REAL STRIPE SESSION CREATION
    // Ensure standard minimum amount ($0.50)
    const amountInCents = Math.max(Math.round(priceAmount * 100), 50);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: itemName,
              description: `Checkout for ${itemName} - Landing Page Builder Service`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        itemType,
        pageId: pageId || "",
        tierId: tierId || "",
      },
    });

    res.json({
      id: session.id,
      url: session.url,
      isMock: false
    });
  } catch (error: any) {
    console.error("Stripe Checkout creation failed:", error);
    res.status(500).json({ error: error.message || "Failed to initiate Stripe payment." });
  }
});

// API endpoint to verify Stripe payment / check status
app.get("/api/stripe/verify-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (sessionId.startsWith("cs_mock_")) {
      return res.json({
        status: "complete",
        payment_status: "paid",
        metadata: {
          mock: "true",
        }
      });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(400).json({ error: "Stripe client not configured." });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      status: session.status,
      payment_status: session.payment_status,
      metadata: session.metadata
    });
  } catch (error: any) {
    console.error("Failed to retrieve Stripe session:", error);
    res.status(500).json({ error: error.message || "Failed to retrieve payment details." });
  }
});

// Boot-up logic
async function startServer() {
  // Vite integration in development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Landing Page Generator Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
