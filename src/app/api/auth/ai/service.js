import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

async function processAIRequest(input, format = "text", customPrompt = "") {
  console.log("Processing AI request with input:", input);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_FLASH_MODEL,
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
        console.error("Error parsing AI response as JSON:", parseError);
        return responseText; // Return raw text if JSON parsing fails
      }
    } else {
      return responseText;
    }
  } catch (error) {
    console.error("Error processing AI request:", error);
    throw new Error("Failed to process AI request");
  }
}

export async function getJSONResponse(input, customPrompt = "") {
  return processAIRequest(input, "json", customPrompt);
}

export async function getTextResponse(input, customPrompt = "") {
  return processAIRequest(input, "text", customPrompt);
}
