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
  const promptInputEl = document.getElementById('prompt-input');
  const fileInputEl = document.getElementById('image-input');
  const chatBoxEl = document.getElementById('chat-box');

  const prompt = promptInputEl.value;
  const imageFiles = fileInputEl.files;

  if (!prompt && imageFiles.length === 0) {
    alert('Please enter a prompt or select images.');
    return;
  }

  // Display user input in chat
  const userBubble = document.createElement('div');
  userBubble.classList.add('chat-bubble', 'user-bubble');
  userBubble.textContent = prompt;
  chatBoxEl.appendChild(userBubble);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const imageParts = await Promise.all([...imageFiles].map(fileToGenerativePart));
  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = await response.text();

  // Display bot response in chat
  const botBubble = document.createElement('div');
  botBubble.classList.add('chat-bubble', 'bot-bubble');
  botBubble.textContent = text;
  chatBoxEl.appendChild(botBubble);

  // Clear inputs
  promptInputEl.value = '';
  fileInputEl.value = '';
}

// Automatically scroll chat to the bottom
const chatBox = document.getElementById('chat-box');
const observer = new MutationObserver(() => chatBox.scrollTop = chatBox.scrollHeight);
observer.observe(chatBox, { childList: true });
