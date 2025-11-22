import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

declare global {
  interface Window {
    lucideReact: any;
  }
}

// We initialize safely, falling back to empty if not set
const getApiKey = () => process.env.API_KEY || localStorage.getItem('GEMINI_API_KEY') || '';

export const checkApiKey = (): boolean => {
  return !!getApiKey();
};

/**
 * Performs a search using Gemini with Google Search Grounding
 */
export const performGlobalSearch = async (query: string): Promise<SearchResult[]> => {
  try {
    if (!checkApiKey()) {
      return [{
        type: 'WEB',
        title: 'API Key Missing',
        content: 'Please add your Gemini API Key in Settings to use AI Search.',
      }];
    }

    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Search query: "${query}". 
      If this is a navigation request within the app (e.g. "go to settings"), ignore search and return a text saying "NAVIGATE: [View Name]".
      Otherwise, provide a summary of the search results.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const results: SearchResult[] = [];
    
    // 1. Extract Web Results from Grounding
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          results.push({
            type: 'WEB',
            title: chunk.web.title || 'Web Result',
            content: 'Source found via Google Search',
            url: chunk.web.uri,
            source: chunk.web.title
          });
        }
      });
    }

    // 2. Add the summary/AI response
    if (response.text) {
      results.unshift({
        type: 'INTERNAL',
        title: 'AI Summary',
        content: response.text,
        source: 'Google Gemini'
      });
    }

    return results;
  } catch (error) {
    console.error("Search error:", error);
    return [{
      type: 'WEB',
      title: 'Search Error',
      content: 'Could not perform search. Please check your network or API limits.',
    }];
  }
};

export const optimizePrompt = async (
  rawPrompt: string,
  tone: string,
  category: string
): Promise<string> => {
  try {
    if (!checkApiKey()) return "Please set your API Key in Settings to generate prompts.";

    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an expert prompt engineer. Convert raw ideas into professional prompts.
    Category: ${category}
    Target Tone: ${tone}
    Format: Return ONLY the optimized prompt text. Do not include markdown formatting or explanations.`;

    const response = await ai.models.generateContent({
      model,
      contents: rawPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Could not generate prompt.";
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    return "Error: " + (error as Error).message;
  }
};

export const generateAppCode = async (
  appName: string,
  description: string,
  features: string[]
): Promise<string> => {
  try {
    if (!checkApiKey()) throw new Error("API Key Missing");

    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const model = 'gemini-2.5-flash'; 
    
    const prompt = `Create a single-file React Functional Component for an app named "${appName}".
    Description: ${description}
    Features: ${features.join(', ')}
    
    CRITICAL RULES FOR BROWSER COMPATIBILITY:
    1. DO NOT import React. Assume 'React', 'useState', 'useEffect', 'useRef' are globally available.
    2. Use 'lucide-react' variables from window.lucideReact (e.g., const { Camera } = window.lucideReact;).
    3. Export the component as 'default'.
    4. Use Tailwind CSS for ALL styling.
    5. Return ONLY the code. No markdown blocks. No 'import' statements at the top.
    6. Make the UI look modern, dark mode, professional.
    7. Ensure the code is complete and has no syntax errors.
    
    Example Format:
    const { useState, useEffect } = React;
    const { User, Settings } = window.lucideReact || {};
    
    export default function App() { 
      return <div className="p-4 bg-slate-900 text-white">Hello</div> 
    }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    let code = response.text || "";
    
    // Aggressive cleanup to ensure code runs in browser
    code = code.replace(/```tsx/g, '').replace(/```javascript/g, '').replace(/```/g, '');
    // Remove standard imports
    code = code.replace(/^import .*$/gm, '');
    code = code.replace(/import .* from .*/g, '');
    
    // Ensure no 'export default' remains if we are going to wrap it, 
    // but for the builder logic, we actually need 'export default' to replace it with 'const App ='
    // So we ensure it EXISTS.
    if (!code.includes('export default')) {
       // If the AI just gave a function, wrap it
       if (code.includes('function App')) {
         code = code.replace('function App', 'export default function App');
       } else {
         code = `export default ${code}`;
       }
    }

    return code.trim();

  } catch (error) {
    console.error("Error generating app code:", error);
    throw error;
  }
};

// --- VIDEO GENERATION (VEO) ---

export const generateVideo = async (
  prompt: string, 
  imageBase64?: string,
  durationSeconds?: number
): Promise<string | null> => {
  // 1. Veo API Key Selection Flow
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  }

  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing. Please select a key in Settings.");

  // Create new instance right before call to ensure latest key
  const ai = new GoogleGenAI({ apiKey });
  const model = 'veo-3.1-fast-generate-preview'; 

  let operation;

  // Append duration request to prompt as config doesn't strictly support it in preview yet
  const enhancedPrompt = durationSeconds 
    ? `${prompt} (Duration: ${durationSeconds} seconds)` 
    : prompt;

  try {
    if (imageBase64) {
      // Image + Text to Video
      operation = await ai.models.generateVideos({
        model,
        prompt: enhancedPrompt, 
        image: {
          imageBytes: imageBase64,
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9' 
        }
      });
    } else {
      // Text to Video
      operation = await ai.models.generateVideos({
        model,
        prompt: enhancedPrompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p', 
          aspectRatio: '16:9'
        }
      });
    }

    // Polling loop with timeout protection
    const startTime = Date.now();
    const TIMEOUT_MS = 300000; // 5 minutes timeout

    while (!operation.done) {
      if (Date.now() - startTime > TIMEOUT_MS) {
        throw new Error("Video generation timed out. The model is taking too long.");
      }
      await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (downloadLink) {
      // We must append the key to fetch the actual bytes/stream
      return `${downloadLink}&key=${apiKey}`; 
    }
    return null;

  } catch (e: any) {
    console.error("Video Generation Error", e);
    
    // Specific handling for 404 Entity Not Found - usually implies wrong key/project for Veo
    const msg = e.message || JSON.stringify(e);
    if (msg.includes("Requested entity was not found") || e.status === 404 || e.code === 404) {
        if (typeof window !== 'undefined' && (window as any).aistudio) {
            await (window as any).aistudio.openSelectKey();
            throw new Error("Access Denied: The selected project does not have access to Veo. Please select a Paid Project with billing enabled.");
        }
    }
    if (msg.includes("quota") || e.status === 429) {
        throw new Error("Quota Exceeded: You have reached the limit for video generation. Please try again later.");
    }
    
    throw new Error(e.message || "Video generation failed.");
  }
};


// --- IMAGE GENERATION ---

export const generateImage = async (
  prompt: string,
  aspectRatio: string = "1:1",
  quality: 'standard' | 'hd' = 'standard'
): Promise<string | null> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey });

  // Rules: High Quality (Size options) = gemini-3-pro-image-preview
  // General = gemini-2.5-flash-image
  const model = quality === 'hd' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio, 
          imageSize: quality === 'hd' ? '2K' : undefined 
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Image Generation Error", e);
    throw e;
  }
};

export const generateMockAnalytics = async (): Promise<any> => {
  // Mock data for UI smoothness
  return [
      { name: 'Mon', users: 400, generations: 240 },
      { name: 'Tue', users: 300, generations: 139 },
      { name: 'Wed', users: 200, generations: 980 },
      { name: 'Thu', users: 278, generations: 390 },
      { name: 'Fri', users: 189, generations: 480 },
      { name: 'Sat', users: 239, generations: 380 },
      { name: 'Sun', users: 349, generations: 430 },
    ];
};