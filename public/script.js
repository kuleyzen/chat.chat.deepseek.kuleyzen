
import {
  createThread,
  saveMessage,
  loadMessages,
  loadThreads
} from './supabase-functions.js';
// 🌐 globale Variablen
let chatHistory = [];
let currentThreadId = null;   // 👈 NEU: Thread-ID wird von Supabase gesetzt
let currentUser = "eris";
let currentModel = "deepseek-chat";

// 🧩 UI-Elemente
const chatOutput = document.getElementById("chat-output");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const userSelect = document.getElementById("user-select");
const modelSelect = document.getElementById("model-select");
const newChatBtn = document.getElementById("new-chat");

// 🧑 Benutzer- & Modellwahl
userSelect.addEventListener("change", () => {
  currentUser = userSelect.value;
});

modelSelect.addEventListener("change", () => {
  currentModel = modelSelect.value;
});

// 🆕 Neuer Chat
newChatBtn.addEventListener("click", async() => {
  chatHistory = [];
  chatOutput.innerHTML = "";
  try {
    const newThread = await createThread(currentUser, `Chat mit ${currentUser}`);
    currentThreadId = newThread.id;
    appendMessage("system", `Neuer Chat gestartet für ${currentUser}`);
  } catch (err) {
    console.error("Thread konnte nicht erstellt werden:", err);
    appendMessage("system", `⚠️ Fehler beim Erstellen des Chats`);
  }
});

// 📨 Senden per Button
sendBtn.addEventListener("click", () => {
  handleMessageSend();
});

// ⌨️ Senden per Enter
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleMessageSend();
  }
});

// 📩 Nachricht senden & anzeigen
async function handleMessageSend() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  chatHistory.push({ role: "user", content: userMessage });
  chatInput.value = "";

  // 🔁 Anfrage an deine Funktion
  const response = await fetch("/.netlify/functions/deepseek-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: currentModel,
      messages: chatHistory
    })
  });

  const data = await response.json();
  const botMessage = data.choices?.[0]?.message?.content || "(keine Antwort)";
  appendMessage("bot", botMessage);
  chatHistory.push({ role: "assistant", content: botMessage });
}

// 💬 Nachrichtenanzeige
function appendMessage(role, text) {
  const p = document.createElement("p");
  p.className = role;
  p.innerText = `${role === "user" ? "👤" : role === "bot" ? "🤖" : "📝"} ${text}`;
  chatOutput.appendChild(p);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}