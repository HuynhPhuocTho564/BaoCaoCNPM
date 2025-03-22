import Together from "together-ai";

const together = new Together({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY || '',
});

interface GenerateImageParams {
  prompt: string;
  negativePrompt: string;
  width?: number;
  height?: number;
  steps?: number;
}

interface TogetherResponse {
  data: Array<{
    b64_json: string;
  }>;
}

export async function generateImage({
  prompt,
  negativePrompt,
  width = 768,
  height = 1024,
  steps = 4,
}: GenerateImageParams): Promise<string> {
  try {
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt: prompt,
      negative_prompt: negativePrompt,
      width,
      height,
      steps: Math.min(steps, 4),
      n: 1,
      response_format: "base64"
    }) as unknown as TogetherResponse;

    const base64Data = response.data[0].b64_json;
    if (!base64Data) {
      throw new Error("Không nhận được dữ liệu ảnh");
    }
    
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    return cleanBase64;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
} 