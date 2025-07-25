async function frageStellen() {
  const frage = document.getElementById("frageInput").value;

  if (!frage) {
    alert("Bitte gib eine Frage ein!");
    return;
  }

  const [chatgpt, gemini, deepseek] = await Promise.all([
    frageChatGPT(frage),
    frageGemini(frage),
    frageDeepSeek(frage),
  ]);

  document.getElementById("chatgptOutput").textContent = chatgpt;
  document.getElementById("geminiOutput").textContent = gemini;
  document.getElementById("deepseekOutput").textContent = deepseek;

  vergleicheAntworten(chatgpt, gemini, deepseek);
}

function vergleicheAntworten(a, b, c) {
  const gleich = a === b && b === c;
  const vergleich = gleich
    ? "✅ Alle Antworten sind gleich."
    : "🔍 Unterschiede erkannt.";

  document.getElementById("vergleich").textContent = vergleich;
}

// --- API-Abfragen ---

async function frageChatGPT(frage) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer DEIN_OPENAI_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: frage }]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Keine Antwort";
}

async function frageGemini(frage) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=DEIN_GEMINI_API_KEY", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: frage }] }]
    })
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Keine Antwort";
}

async function frageDeepSeek(frage) {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer DEIN_DEEPSEEK_API_KEY"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: frage }]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Keine Antwort";
}
