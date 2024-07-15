/*import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_GEMINI_API_KEY } from "./GoogleGeminiAPIKey";

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);

async function processAIRequest(input, format = "text", customPrompt = "") {
  console.log("API KEY: ", process.env.GOOGLE_GEMINI_API_KEY);
  console.log("Processing AI request with input:", input);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: format === "json" ? "application/json" : "text/plain",
    },
  });

  const prompt = `
${customPrompt}

Input:
${JSON.stringify(input, null, 2)}
`;

  try {
    let result = await model.generateContent(prompt);
    let responseText = result.response.text();
    console.log("AI response:", responseText);

    if (format === "json") {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "Failed to parse AI response as JSON. Error details:",
          parseError
        );
        console.error("Raw AI response:", responseText);
        return responseText; // Return raw text if JSON parsing fails
      }
    } else {
      return responseText;
    }
  } catch (error) {
    throw new Error(`Failed to process AI request: ${error.message}`);
  }
}

export async function getJSONResponse(input, customPrompt = "") {
  return processAIRequest(input, "json", customPrompt);
}

export async function getTextResponse(input, customPrompt = "") {
  return processAIRequest(input, "text", customPrompt);
}*/

import { GoogleGenerativeAI } from "@google/generative-ai";

// Use the environment variable for the API key
const GOOGLE_GEMINI_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

if (!GOOGLE_GEMINI_API_KEY) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);

async function processAIRequest(input, format = "text", customPrompt = "") {
  console.log("API KEY: ", GOOGLE_GEMINI_API_KEY);
  console.log("Processing AI request with input:", input);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: format === "json" ? "application/json" : "text/plain",
    },
  });

  const prompt = `
${customPrompt}

Input:
${JSON.stringify(input, null, 2)}
`;

  try {
    let result = await model.generateContent(prompt);
    let responseText = result.response.text();
    console.log("AI response:", responseText);

    if (format === "json") {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "Failed to parse AI response as JSON. Error details:",
          parseError
        );
        console.error("Raw AI response:", responseText);
        return responseText; // Return raw text if JSON parsing fails
      }
    } else {
      return responseText;
    }
  } catch (error) {
    throw new Error(`Failed to process AI request: ${error.message}`);
  }
}

export async function getJSONResponse(input, customPrompt = "") {
  return processAIRequest(input, "json", customPrompt);
}

export async function getTextResponse(input, customPrompt = "") {
  return processAIRequest(input, "text", customPrompt);
}
