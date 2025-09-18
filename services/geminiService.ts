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
        description: "Um título conciso e descritivo para o item de trabalho.",
      },
      type: {
        type: Type.STRING,
        description: "O tipo do item de trabalho, conforme especificado pelo usuário.",
      },
      description: {
        type: Type.STRING,
        description: "Uma descrição detalhada da tarefa, incluindo critérios de aceitação se aplicável. Use markdown para formatação.",
      },
      tags: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "Uma lista de tags relevantes para categorização (ex: 'API', 'UI', 'Backend', 'Q1-2024').",
      },
    },
    required: ["title", "type", "description", "tags"],
  },
};

export async function generateTasksFromTranscription(
  transcription: string,
  systemInstructions: string,
  taskType: string
): Promise<AzureTask[]> {
  const finalPrompt = `
    Com base nos detalhes fornecidos, crie um ou mais itens de trabalho estruturados para o Azure DevOps.
    O tipo do item de trabalho DEVE ser '${taskType}'.
    Siga o formato e as convenções descritas no modelo/instruções do sistema.

    Detalhes do Card:
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
        throw new Error("A IA retornou dados em um formato inesperado.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Falha ao gerar tarefas a partir dos detalhes.");
  }
}