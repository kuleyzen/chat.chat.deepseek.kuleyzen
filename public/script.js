async function sendMessage(message) {
    try {
      const response = await fetch("/.netlify/functions/deepseek-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: message }],
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Fehler:", error);
      return { error: "API-Anfrage fehlgeschlagen" };
    }
  }
  
  // Chat-UI Beispiel (einfache Implementierung)
  document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input");
    const chatOutput = document.getElementById("chat-output");
  
    chatInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const userMessage = e.target.value;
        chatOutput.innerHTML += `<p><strong>Sie:</strong> ${userMessage}</p>`;
        e.target.value = "";
  
        const botResponse = await sendMessage(userMessage);
        if (botResponse.choices?.[0]?.message) {
          chatOutput.innerHTML += `<p><strong>Bot:</strong> ${botResponse.choices[0].message.content}</p>`;
        } else {
          chatOutput.innerHTML += `<p style="color: red;">Fehler: Keine Antwort vom Bot.</p>`;
        }
      }
    });
  });