// /api/ai/route.js

import { getJSONResponse } from "./service";

export async function POST(request) {
  try {
    const { context, prompt } = await request.json();

    const customPrompt = `
      ${context}
      ${prompt}
      Generate a goal with a title, date, and 3-5 substeps. Return the result as a JSON object with the following structure:
      {
        "title": "Goal Title",
        "date": "YYYY-MM-DD",
        "substeps": ["Substep 1", "Substep 2", "Substep 3"]
      }
    `;

    const response = await getJSONResponse({}, customPrompt);
    console.log("AI generated response:", response);

    if (!response || typeof response !== 'object' || !response.title || !response.date || !Array.isArray(response.substeps)) {
      throw new Error("Invalid response structure from AI");
    }

    return Response.json(response);
  } catch (error) {
    console.error("Error in AI route:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}