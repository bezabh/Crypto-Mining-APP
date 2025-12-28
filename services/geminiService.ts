
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MiningStats, MiningAlgorithm, HardwareType, User, RiskAssessment, MarketNews, MarketCoin, MiningTask } from "../types";

export const getMiningOptimizationAdvice = async (
  stats: MiningStats,
  algorithm: MiningAlgorithm,
  hardware: HardwareType
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing. Please configure your environment.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a senior crypto mining engineer for TigAppMining. 
      Analyze telemetry: Algo: ${algorithm}, Hardware: ${hardware}, Hashrate: ${stats.hashrate} ${stats.hashrateUnit}, Temp: ${stats.temperature}°C, Power: ${stats.power}W.
      Provide 3 specific bullet points on how to improve efficiency or safety. Keep it technical and concise.`
    });

    return response.text || "No advice generated.";
  } catch (error) {
    return "Unable to connect to TigAppMining AI Engine.";
  }
};

/**
 * Generates a specialized high-performance strategy for the Bitcoin Maker portal.
 */
export const getBitcoinMakerStrategy = async (targetHashrate: string): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are the TigApp Bitcoin Overlord. A user wants to achieve a target hashrate of ${targetHashrate} for Bitcoin mining. 
      Generate an elite 'Mega-Mining' strategy. Describe a futuristic cooling solution, a specific overclocking voltage curve, and a proprietary stratum protocol tweak. 
      Use extremely high-tech, borderline sci-fi terminology. Keep it under 120 words.`
    });
    return response.text || "Strategy synthesis failed.";
  } catch (e) {
    return "The Bitcoin Logic Core is offline.";
  }
};

/**
 * Generates dynamic mining quests/tasks using AI.
 */
export const getDynamicTasks = async (): Promise<MiningTask[]> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 4 creative and technical tasks for a crypto mining dashboard. Each task should have a title, a brief description (1 sentence), a reward amount (number), a difficulty (EASY, MEDIUM, HARD, ELITE), and a category (MINING, AI, SECURITY, MARKET). Return as a JSON array.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              reward: { type: Type.NUMBER },
              difficulty: { type: Type.STRING, enum: ['EASY', 'MEDIUM', 'HARD', 'ELITE'] },
              category: { type: Type.STRING, enum: ['MINING', 'AI', 'SECURITY', 'MARKET'] }
            },
            required: ["title", "description", "reward", "difficulty", "category"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((item: any, index: number) => ({
      ...item,
      id: `task-${Date.now()}-${index}`,
      rewardType: 'POINTS',
      progress: 0,
      status: 'AVAILABLE'
    }));
  } catch (e) {
    return [];
  }
};

/**
 * Generates a technical whitepaper snippet for a custom forged coin.
 */
export const generateCoinWhitepaper = async (name: string, symbol: string, purpose: string): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional, highly technical 100-word executive summary for a new cryptocurrency named "${name}" (${symbol}). 
      Its primary objective is: ${purpose}. 
      Mention specific blockchain concepts like consensus mechanisms, TPS, and utility. Use a futuristic, high-tech tone.`
    });
    return response.text || "Description node synchronization failed.";
  } catch (e) {
    return "Whitepaper engine offline.";
  }
};

export const getMarketNewsWithSentiment = async (coinSymbol: string): Promise<MarketNews[]> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the latest 5 news headlines related to ${coinSymbol} cryptocurrency and its mining impact. 
      For each headline, provide:
      1. The title
      2. The source name
      3. The time (e.g. '2h ago')
      4. A sentiment rating (Positive, Negative, or Neutral) based on current market impact.
      Return the data in a valid JSON array format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              source: { type: Type.STRING },
              time: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'] }
            },
            required: ["title", "source", "time", "sentiment"]
          }
        }
      }
    });

    const newsData = JSON.parse(response.text || "[]");
    return newsData.map((item: any, index: number) => ({
      ...item,
      id: item.id || `news-${Date.now()}-${index}`
    }));
  } catch (e) {
    console.error("News fetch error:", e);
    return [];
  }
};

/**
 * Fetches official Binance announcements and platform news using search grounding.
 */
export const getBinanceSpecificNews = async (): Promise<MarketNews[]> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the latest 5 official announcements and platform news from Binance.com (e.g., new listings, maintenance, launchpool). 
      For each item, provide:
      1. The headline
      2. The specific sub-source (e.g., 'Binance Support', 'Binance Blog')
      3. The relative time (e.g. '30m ago')
      4. A brief sentiment analysis of how it affects platform users (Positive, Negative, or Neutral).
      Return as a JSON array.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              source: { type: Type.STRING },
              time: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'] }
            },
            required: ["title", "source", "time", "sentiment"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    return data.map((item: any, index: number) => ({
      ...item,
      id: `binance-news-${Date.now()}-${index}`
    }));
  } catch (e) {
    console.error("Binance news error:", e);
    return [];
  }
};

export const fetchFullMarketData = async (): Promise<MarketCoin[]> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Search for the current top 40 cryptocurrencies by market cap. Provide their name, symbol, current price in USD, 24h change percentage, market cap, and 24h volume. Return the results as a JSON array of objects.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              symbol: { type: Type.STRING },
              price: { type: Type.NUMBER },
              change24h: { type: Type.NUMBER },
              marketCap: { type: Type.STRING },
              volume24h: { type: Type.STRING },
              rank: { type: Type.NUMBER }
            },
            required: ["name", "symbol", "price", "change24h", "marketCap", "volume24h", "rank"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    return rawData.map((coin: any) => ({
      ...coin,
      id: coin.symbol.toLowerCase(),
      chartData: Array.from({ length: 10 }, () => coin.price * (0.95 + Math.random() * 0.1))
    }));
  } catch (e) {
    console.error("Market fetch error:", e);
    return [];
  }
};

export const getDetailedConsultation = async (
    userMessage: string,
    stats: MiningStats,
    isPro: boolean = false
): Promise<{ text: string, thinking?: string }> => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const context = `
        SYSTEM ARCHITECT CONTEXT:
        - Application: TigAppMining Pro
        - Node Status: ${stats.hashrate} ${stats.hashrateUnit} active
        - Thermal: ${stats.temperature.toFixed(1)}°C
        - Power: ${stats.power}W
        - Objective: Provide ultra-technical, professional, and actionable mining strategies.
    `;

    try {
        const response = await ai.models.generateContent({
            model: isPro ? "gemini-3-pro-preview" : "gemini-3-flash-preview",
            contents: `${context}\n\nUSER QUERY: ${userMessage}`,
            config: isPro ? {
                thinkingConfig: { thinkingBudget: 8000 }
            } : undefined
        });

        const thinking = response.candidates?.[0]?.content?.parts?.find(p => p.thought)?.thought;
        return { 
            text: response.text || "Handshake failed. No response generated.",
            thinking 
        };
    } catch (e) {
        return { text: "Neural uplink interrupted. Please check API connectivity." };
    }
};

export const getAutoPilotStrategy = async (stats: MiningStats): Promise<{ fanSpeed: number, frequency: number, voltage: number, explanation: string }> => {
    if (!process.env.API_KEY) throw new Error("API Key missing");

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Act as an AI Autopilot for an ASIC miner. 
            Current stats: Temp ${stats.temperature}°C, Power ${stats.power}W.
            Determine optimized settings for:
            1. Fan Speed (0-100)
            2. Core Frequency (MHz, around 600-800)
            3. Voltage (mV, around 12000-14000)
            Explain logic in 10 words.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fanSpeed: { type: Type.NUMBER },
                        frequency: { type: Type.NUMBER },
                        voltage: { type: Type.NUMBER },
                        explanation: { type: Type.STRING }
                    },
                    required: ["fanSpeed", "frequency", "voltage", "explanation"]
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { fanSpeed: 85, frequency: 725, voltage: 13200, explanation: "Fallback safe profile applied." };
    }
};

export const analyzeRigVision = async (base64Image: string): Promise<string> => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
                    { text: "Analyze this mining hardware setup. Identify components, potential airflow issues, or cable management hazards. Be concise and technical." }
                ]
            }
        });
        return response.text || "Vision analysis failed.";
    } catch (e) {
        return "Visual node connection timeout.";
    }
};

export const getStrategicThought = async (query: string): Promise<{ thought: string, answer: string }> => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: query,
            config: {
                thinkingConfig: { thinkingBudget: 4000 }
            }
        });
        
        const thought = response.candidates?.[0]?.content?.parts?.find(p => p.thought)?.thought || "Strategic reasoning internalized.";
        return { thought, answer: response.text || "" };
    } catch (e) {
        return { thought: "", answer: "Strategic core overloaded." };
    }
};

export const generateMiningArt = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A futuristic high-tech crypto mining rig avatar, ${prompt}, cinematic lighting, 8k resolution, cyberpunk aesthetic.` }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getGroundedNodeIntel = async (query: string): Promise<{ text: string, links: { uri: string, title: string }[] }> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the latest real-time information regarding: ${query}. Focus on crypto mining impact and price trends for 2024.`,
      config: { tools: [{ googleSearch: {} }] },
    });

    const links: { uri: string, title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) links.push({ uri: chunk.web.uri, title: chunk.web.title });
      });
    }

    return { text: response.text || "No intelligence found.", links: links.slice(0, 5) };
  } catch (e) {
    return { text: "Search grounding node offline.", links: [] };
  }
};

export const getVoiceBriefing = async (text: string): Promise<Uint8Array> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say in a professional tech voice: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const getAIChatResponse = async (userMessage: string): Promise<string> => {
    if (!process.env.API_KEY) return "I'm offline. Check your TigAppMining API config.";
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `You are TigAppMining AI. User Query: "${userMessage}". Be helpful and professional.`
        });
        return response.text || "I processed that, but have no response.";
    } catch (e) { return "Connection error to TigAppMining servers."; }
};

export const getAIGuide = async (topic: string): Promise<string> => {
    if (!process.env.API_KEY) return "I'm offline. Check your TigAppMining API config.";
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate a concise, professional guide for TigAppMining users on the following topic: "${topic}". Use bullet points where appropriate.`
        });
        return response.text || "I processed that, but have no guide content.";
    } catch (e) { return "Connection error to TigAppMining knowledge base."; }
};

export const getProfitabilityPrediction = async (currentMarketData: string): Promise<string> => {
    if (!process.env.API_KEY) return "API Key missing.";
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Predict best mining algo for next 24h based on: "${currentMarketData}". Short paragraph.`
        });
        return response.text || "Analysis failed.";
    } catch (e) { return "AI Prediction unavailable."; }
};

export const analyzeUserRisk = async (user: User): Promise<RiskAssessment> => {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analyze security risk for the following user profile and return a risk score and reason in JSON format: ${JSON.stringify(user)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        reason: { type: Type.STRING },
                        isFake: { type: Type.BOOLEAN },
                        lastChecked: { type: Type.STRING }
                    },
                    required: ["score", "reason", "isFake", "lastChecked"]
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { score: 0, reason: "Persistence error.", isFake: false, lastChecked: new Date().toISOString() };
    }
};
