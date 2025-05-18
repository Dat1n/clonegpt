const chat = document.getElementById('chat');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const modeToggle = document.getElementById('mode-toggle');
const body = document.body;

let darkMode = false;

modeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  body.classList.toggle('dark-mode', darkMode);
 modeToggle.textContent = darkMode ? '☀️' : '🌙';
});

function appendMessage(text, sender, isTyping = false) {
  const div = document.createElement('div');
  div.textContent = text;
  div.className = 'message ' + sender;
  if (isTyping) div.classList.add('typing');
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

async function getChatGPTResponse(message) {
  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (data.error) {
      console.error('API error details:', data.error);
      let errorMessage;
      try {
        const parsed = JSON.parse(data.error);
        errorMessage = parsed.error?.message || JSON.stringify(parsed);
      } catch {
        errorMessage = data.error;
      }
      throw new Error(errorMessage);
    }

    return data.choices[0]?.message?.content || 'No response from API.';

  } catch (error) {
    console.error('Error caught in getChatGPTResponse:', error);
    return `Error: ${error.message}`;
  }
}


sendBtn.addEventListener('click', async () => {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, 'user');
  input.value = '';

  const typingIndicator = appendMessage("Thinking", 'bot', true);

  const botResponse = await getChatGPTResponse(userMessage);

  typingIndicator.remove();
  appendMessage(botResponse, 'bot');
});


const codeSnippets = [
  "let x = 10;",
  "const fetchData = async () => {}",
  "if (a > b) return a;",
  "console.log('debug');",
  "for (let i = 0; i < arr.length; i++) {}",
  "document.querySelector('#app');",
  "setTimeout(() => {}, 1000);",
  "const sum = a + b;",
  "while (true) {}",
  "try { doSomething(); } catch (e) {}",
  "return x ?? 0;",
  "arr.map(i => i * 2);"
];

const totalLines = 200;
const container = document.getElementById("code-rain-container");

for (let i = 0; i < totalLines; i++) {
  const code = document.createElement("div");
  code.className = "code-line";
  code.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
  code.style.left = Math.random() * 100 + "vw";
  const delay = Math.random() * 10;
  const duration = 4 + Math.random() * 4;
  code.style.animationDelay = `${delay}s`;
  code.style.animationDuration = `${duration}s`;
  container.appendChild(code);
}

setInterval(() => {
  const code = document.createElement("div");
  code.className = "code-line";
  code.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
  code.style.left = Math.random() * 100 + "vw";
  const delay = 0;
  const duration = 4 + Math.random() * 4;
  code.style.animationDelay = `${delay}s`;
  code.style.animationDuration = `${duration}s`;
  container.appendChild(code);

  setTimeout(() => {
    code.remove();
  }, duration * 1000);
}, 200);

