

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
  if (!API_KEY) {
    console.error("No API Key found");
    return;
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await res.json();
    console.log("AVAILABLE MODELS:");
    if (data.models) {
      data.models.forEach(m => {
        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
          console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}

listModels();
