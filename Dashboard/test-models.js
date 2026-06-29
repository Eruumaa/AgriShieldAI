import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
// This SDK doesn't have an easy listModels in the JS client without an API call
// But let's just try gemini-1.5-flash-latest or gemini-pro
