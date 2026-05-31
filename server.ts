import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client safety
let clientInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!clientInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    clientInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return clientInstance;
}

// Map tool names to system instructions
const EXPLANATION_INSTRUCTIONS = `
Avoid dry corporate tone. Be encouraging, viral-optimized, and direct. Support YouTube Growth hacks, CTR, and search retention metrics.
`;

// Build schemas using Gemini type declarations
const schemas: Record<string, any> = {
  "title-generator": {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Highly engaging, viral YouTube video title matching the selected language, niche, and topic. Do not include quotes." },
        engagementHook: { type: Type.STRING, description: "Brief analysis of the human curiosity hook (e.g. fear, curiosity, self-benefit) or SEO advantage." }
      },
      required: ["title", "engagementHook"]
    }
  },
  "script-writer": {
    type: Type.OBJECT,
    properties: {
      hook: { type: Type.STRING, description: "0-10 second ultra high-retention visual & vocal opening to prevent scroll/bounce." },
      introduction: { type: Type.STRING, description: "10-30 second setup explaining what is in store, raising stakes." },
      mainContent: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: { type: Type.STRING, description: "Visual setting/Scene details or title card (e.g. 'Scene: Screen share setup', 'Key Point 1: The Mistake')." },
            content: { type: Type.STRING, description: "Narration dialogue or host speech script, detailed and natural." }
          },
          required: ["section", "content"]
        }
      },
      callToAction: { type: Type.STRING, description: "Seamless, unobtrusive but effective action trigger mid/end video." },
      ending: { type: Type.STRING, description: "Outro optimized to keep viewer click-through on default end-screen cards instead of classic fade-outs." }
    },
    required: ["hook", "introduction", "mainContent", "callToAction", "ending"]
  },
  "thumbnail-generator": {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        thumbnailText: { type: Type.STRING, description: "Short punchy text to go on the thumbnail image itself. Ideally 2-4 words maximum. Extremely readable." },
        conceptEmotion: { type: Type.STRING, description: "Suggested thumbnail background design concept visual details and emotion being triggered (curiosity, shock, relief)." }
      },
      required: ["thumbnailText", "conceptEmotion"]
    }
  },
  "shorts-generator": {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        idea: { type: Type.STRING, description: "Trending vertical short idea/concept title." },
        description: { type: Type.STRING, description: "Story or exact sequence of events for a 15-50 second micro-video." },
        estimatedInterest: { type: Type.STRING, description: "Interest score formatted as percentage e.g., '96%' or '93%' based on trendiness." },
        tips: { type: Type.STRING, description: "Strategic audio loop recommendation or caption typography key." }
      },
      required: ["idea", "description", "estimatedInterest", "tips"]
    }
  },
  "hashtag-generator": {
    type: Type.OBJECT,
    properties: {
      trending: { type: Type.ARRAY, items: { type: Type.STRING }, description: "High volume trending hashtags. Include the '#' character prefix." },
      niche: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Niche specific hashtags. Include the '#' character prefix." },
      broad: { type: Type.ARRAY, items: { type: Type.STRING }, description: "General/Broad categorizations. Include the '#' character prefix." }
    },
    required: ["trending", "niche", "broad"]
  },
  "comment-replies": {
    type: Type.OBJECT,
    properties: {
      friendly: { type: Type.STRING, description: "Heartfelt, appreciative, community building reply." },
      funny: { type: Type.STRING, description: "Clever, witty, or humorous response which can trend." },
      professional: { type: Type.STRING, description: "Authoritative, brand-safe, polite customer-support style answer." },
      motivational: { type: Type.STRING, description: "Inspiring and encouraging reply pushing them to action." }
    },
    required: ["friendly", "funny", "professional", "motivational"]
  },
  "video-description": {
    type: Type.OBJECT,
    properties: {
      hooks: { type: Type.STRING, description: "First 150 characters designed with high-intent keywords to show before the YouTube 'Show More' button." },
      aboutVideo: { type: Type.STRING, description: "An SEO optimized, fluid paragraphs describing the video timeline, topics, and value proposition." },
      keyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Bullets of key topics covered." },
      timestamps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            time: { type: Type.STRING, description: "MM:SS format timestamp." },
            label: { type: Type.STRING, description: "Chapter label explanation." }
          },
          required: ["time", "label"]
        }
      },
      linksAndSocials: { type: Type.STRING, description: "Standard placeholders where social links and standard disclaimers belong." },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended 5-10 SEO hashtags with '#' character included." }
    },
    required: ["hooks", "aboutVideo", "keyPoints", "timestamps", "linksAndSocials", "hashtags"]
  },
  "trending-content": {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Hot, high-growth trending topic/video idea title for the niche." },
        trendAngle: { type: Type.STRING, description: "What trigger or dynamic makes this extremely viral right now (news momentum, visual format, challenge, controversy, product release)." },
        whyItWorks: { type: Type.STRING, description: "Human psychology justification of why people will click this." },
        difficulty: { type: Type.STRING, description: "Difficulty level to produce (Easy, Medium, or Hard)." }
      },
      required: ["title", "trendAngle", "whyItWorks", "difficulty"]
    }
  }
};

// API Endpoint for generation
app.post("/api/generate", async (req, res): Promise<any> => {
  try {
    const {
      tool,
      language = "english",
      topic = "",
      niche = "general",
      commentText = "",
      scriptType = "long",
      channelName = "",
      extraOptions = {}
    } = req.body;

    if (!tool || !schemas[tool]) {
      return res.status(400).json({ error: `Invalid or missing 'tool' parameter. Must be one of: ${Object.keys(schemas).join(", ")}` });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not defined in the workspace env. Please verify in Secrets."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isOpenRouter = apiKey.startsWith("sk-or-");

    let userPrompt = "";
    let systemInstruction = `You are the core intelligence of "Rana AI Creator Studio", an advanced AI assistant built for YouTube growth hacking and video creation. Your main goal is to generate extremely high CTR and high-retention YouTube metadata/scripts. You are friendly, creative, and optimized for success. `;

    if (language === "hindi") {
      systemInstruction += "Output all generated text using the Hindi Devanagari script (e.g. 'शीर्षक विचार', 'विवरण' etc.) where appropriate, ensuring correct grammatical syntax.";
    } else if (language === "hinglish") {
      systemInstruction += "Output all written spoken script/text in Hinglish (Hindi language spoken structure written using standard English/Latin alphabet, e.g., 'Aapka video is tarah viral hoga!', 'Aaj ke video me hum baat karenge...'). Ensure it sounds natural and appealing to broad South Asian audiences.";
    } else {
      systemInstruction += "Output everything in English. Keep it punchy and modern.";
    }

    systemInstruction += "\n" + EXPLANATION_INSTRUCTIONS;

    switch (tool) {
      case "title-generator":
        userPrompt = `Generate exactly 20 viral, high-CTR YouTube video titles optimized for click-through rate, curiosity, and search relevance.
Topic or Keyword: "${topic}"
Niche Selected: "${niche}"
Language: ${language}
${channelName ? `Personalize for YouTube creator named: "${channelName}"` : ""}`;
        break;

      case "script-writer":
        userPrompt = `Write a complete YouTube script for a ${scriptType === "short" ? "Short-Form (Vertical Shorts/TikTok, length 15-60s)" : "Long-Form video (length 5-10 minutes)"}.
Topic: "${topic}"
Niche: "${niche}"
Language: ${language}
Include:
1. Hook: Catchy, instant visual/speaker hook
2. Introduction: Introduce the topic, raise stakes
3. Main Content: Broken down into logical sections or scene beats
4. Call to Action (CTA): Guide viewers to subscribe/comment naturally
5. Ending Outro: Short and optimized for default end-screen redirection`;
        break;

      case "thumbnail-generator":
        userPrompt = `Generate exactly 20 distinct, high-impact thumbnail text ideas and layout concepts.
Topic of the video: "${topic}"
Niche Selected: "${niche}"
Language for text assets: ${language}
Text on thumbnails must be mega short (1 to 4 words), high curiosity or contrast, easy to read on mobile. Avoid repeating text ideas. Describe the targeted emotional trigger for each.`;
        break;

      case "shorts-generator":
        userPrompt = `Generate exactly 50 creative YouTube Shorts content ideas designed to capture attention quickly and match viral styles.
Primary Topic: "${topic}"
Niche Selected: "${niche}"
Language: ${language}
Include estimated audience interest scores and tactical creation tips for every idea. Keep descriptions concise and simple so it compiles into a clean structured list without cutting off.`;
        break;

      case "hashtag-generator":
        userPrompt = `Generate 30 highly relevant, categorized hashtags for YouTube SEO and discoverability.
Topic of video: "${topic}"
Niche: "${niche}"
Language / Audience format: ${language}
Categorize them strictly into:
- 10 Trending (high volume general hashtags)
- 10 Niche specific (targeted context)
- 10 Broad tags (general categorizations)`;
        break;

      case "comment-replies":
        userPrompt = `Review and analyze this viewer comment, and generate 4 distinct, engaging reply options:
Original Viewer Comment: "${commentText}"
Creator Identity Name to sign off: "${channelName || "Creator"}"
Genre Niche context: "${niche}"
Language: ${language}
Generate:
- Friendly: Caring, welcoming, encouraging community connection.
- Funny: Playful, witty, charming response.
- Professional: Helpful, formal, expert tone.
- Motivational: Inspiring, high energy, call to action.`;
        break;

      case "video-description":
        userPrompt = `Create an SEO-optimized YouTube video description to maximize indexing.
Video Title / Topic: "${topic}"
Niche Selected: "${niche}"
Channel Name: "${channelName || "My Channel"}"
Language: ${language}
Include:
- Compelling first 2 lines (Hooks)
- "About the Video" section with secondary keyphrases embedded fluidly
- Key insights list
- Visual Timestamp chapter landmarks list (e.g. 00:00 - Introduction, 01:15 - Core Secrets, etc.)
- Social media and link templates
- Hashtags at the very end`;
        break;

      case "trending-content":
        userPrompt = `Analyze the "${niche}" niche and suggest trending high-growth YouTube video ideas that are hot right now or exploding globally.
Focus on topics that represent recent interest peaks (or general high-performer archetypes if topic is search-bound).
Niche: "${niche}"
Language: ${language}
Provide actionable trend angles and explanation of why people love this idea. Define production difficulty.`;
        break;
    }

    let parsedJson;

    if (isOpenRouter) {
      const schemaStr = JSON.stringify(schemas[tool]);
      const fullSystemInstruction = `${systemInstruction}\nYou MUST return a JSON object/array strictly complying with this JSON Schema:
${schemaStr}

Return ONLY the raw JSON content. Do NOT wrap your response in markdown code blocks. Your output must be directly parseable as JSON.`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "https://ais-dev-qixlidhiyqlyadedfwsems.us-east1.run.app",
          "X-Title": "Rana AI Creator Studio"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: fullSystemInstruction },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API failed (${response.status}): ${errorText}`);
      }

      const data: any = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No response content from OpenRouter.");
      }

      let cleaned = content.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```json?\s*/i, "").replace(/\s*```$/, "");
      }
      parsedJson = JSON.parse(cleaned);
    } else {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schemas[tool],
          temperature: 0.8,
        }
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("Failed to retrieve text content from Gemini's response.");
      }
      parsedJson = JSON.parse(textOutput.trim());
    }

    return res.json({ success: true, result: parsedJson });

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred during Gemini AI Generation."
    });
  }
});

// App Entry Points
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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
    console.log(`Server starting and listening on port ${PORT}`);
  });
}

startServer();
