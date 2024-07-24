import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace 'YOUR_API_KEY' with your actual API key
const API_KEY = 'AIzaSyCJIjJeVIs1lK9GjbRBihEwD4AwpvMWGMk';
const genAI = new GoogleGenerativeAI(API_KEY);

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-vision-pro" });
  const prompt = "What's different between these pictures?";

  const fileInputEl = document.querySelector("input[type=file]");
  const imageParts = await Promise.all(
    [...fileInputEl.files].map(fileToGenerativePart)
  );

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = await response.text();
  
  document.getElementById('result').innerText = text;
  console.log(text);
                 }
