import { GoogleGenAI, Type } from "@google/genai";
import { AzureTask } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A concise, descriptive title for the work item.",
      },
      type: {
        type: Type.STRING,
        description: "The type of work item. Must be one of: 'Task', 'Bug', 'User Story', 'Feature'.",
      },
      description: {
        type: Type.STRING,
        description: "A detailed description of the task, including acceptance criteria if applicable. Use markdown for formatting.",
      },
      tags: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "A list of relevant tags for categorization (e.g., 'API', 'UI', 'Backend', 'Q1-2024').",
      },
    },
    required: ["title", "type", "description", "tags"],
  },
};

export async function generateTasksFromTranscription(
  transcription: string,
  systemInstructions: string,
  userPrompt: string
): Promise<AzureTask[]> {
  const finalPrompt = `
    ${userPrompt ? `A specific instruction for this request is: "${userPrompt}". Please prioritize this.\n\n---\n\n` : ''}
    Based on the following meeting transcription, identify all actionable tasks, user stories, bugs, or features. 
    For each item, provide a clear title, a detailed description, a suitable work item type, and relevant tags.
    Ensure the description contains enough detail for a developer or team member to start work.

    Transcription:
    ---
    ${transcription}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        ...(systemInstructions.trim() && { systemInstruction: systemInstructions }),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const tasks = JSON.parse(jsonText);
    
    // Basic validation to ensure we have an array of objects
    if (Array.isArray(tasks) && tasks.every(task => 'title' in task && 'type' in task)) {
        return tasks as AzureTask[];
    } else {
        console.error("Parsed JSON is not in the expected format:", tasks);
        throw new Error("AI returned data in an unexpected format.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate tasks from transcription.");
  }
}