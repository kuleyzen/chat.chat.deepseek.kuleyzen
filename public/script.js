import {
  createThread,
  saveMessage,
  loadMessages,
  loadThreads
} from './supabase-functions.js';

// 🌐 globale Variablen
let chatHistory = [];
let currentThreadId = null;

// 🧑 Benutzerliste mit UUIDs
const userMap = {
  eris: "00000000-0000-0000-0000-000000000001",
  pinar: "00000000-0000-0000-0000-000000000002"
};

let currentUser = "eris"; // Standardanzeige
let currentUserId = userMap[currentUser];
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
  currentUserId = userMap[currentUser];
});

modelSelect.addEventListener("change", () => {
  currentModel = modelSelect.value;
});

// 🆕 Neuer Chat
newChatBtn.addEventListener("click", async () => {
  chatHistory = [];
  chatOutput.innerHTML = "";
  try {
    const newThread = await createThread(currentUserId, `Chat mit ${currentUser}`);
    currentThreadId = newThread.id;
    appendMessage("system", `🧵 Neuer Chat gestartet für ${currentUser}`);
  } catch (err) {
    console.error("❌ Thread konnte nicht erstellt werden:", err);
    appendMessage("system", "⚠️ Fehler beim Erstellen des Chats");
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
  if (!userMessage || !currentThreadId) return;

  appendMessage("user", userMessage);
  chatHistory.push({ role: "user", content: userMessage });
  chatInput.value = "";

  try {
    await saveMessage(currentThreadId, "user", userMessage);
  } catch (err) {
    console.error("❌ Fehler beim Speichern der User-Nachricht:", err);
  }

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

  try {
    await saveMessage(currentThreadId, "assistant", botMessage);
  } catch (err) {
    console.error("❌ Fehler beim Speichern der Bot-Antwort:", err);
  }
}

// 💬 Nachrichtenanzeige
function appendMessage(role, text) {
  const p = document.createElement("p");
  p.className = role;
  p.innerText = `${role === "user" ? "👤" : role === "bot" ? "🤖" : "📝"} ${text}`;
  chatOutput.appendChild(p);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}
