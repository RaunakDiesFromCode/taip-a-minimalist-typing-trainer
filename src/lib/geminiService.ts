import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error(
    "NEXT_PUBLIC_GEMINI_API_KEY is missing from the environment variables."
  );
}

interface WordRequest {
  difficulty: number;
}

export async function fetchWords({
  difficulty,
}: WordRequest): Promise<string[]> {
  if (difficulty < 0 || difficulty > 3) {
    throw new Error("Invalid difficulty level");
  }
  const prompt: string = difficulty.toString();

  try {
    const genAI = new GoogleGenerativeAI(API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "the prompt is between number 0 to 3, where 0 is easy, 1 is medium, 2 is hard, and 3 is very hard. based on this prompt, generate a paragraph of meaningful words. the sentence will be then used for typing practice. the 3rd difficulty level is that level when the paragraph makes no sense, like random words will be there, else everythong will be normal. don't generate something regarding typing exerscise or anything related to that. and please dont use 'The quick brown fox jumps over the lazy dog' as the prompt. 0 diffculty, max 3 sentences and use simple words, 1 and 2 difficulty, max 2 and 3 sentences respectivly and use a lil harder words, 3 difficulty, max 2 sentence and use words that humans never know even existed.",
    });

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    return responseText.split(" ");
  } catch (error) {
    console.error("Error fetching words from Gemini:", error);
    return [];
  }
}
