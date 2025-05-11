const apiKey = "AIzaSyAnGcAswWC4aYnoGlBChLHjGapSGeyAxQc";
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const moodButtons = document.getElementById("mood-buttons");
const moreButtons = document.getElementById("more-buttons");
let currentMood = "";

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message");
    messageDiv.classList.add(isUser ? "user-message" : "bot-message");
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing";
    typingDiv.classList.add("chat-message", "bot-message");
    typingDiv.textContent = "typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}


function removeTyping() {
    const typingDiv = document.getElementById("typing");
    if (typingDiv) typingDiv.remove();
}


function generatePrompt(mood, userInput) {
    const prompts = [];
    
    if (mood) {
        prompts.push(
            `Share a thoughtful and uplifting message for someone feeling ${mood} as if you were a therapist. Make it original and heartfelt! Since this program's name is ReMind, give them a mindful message.`,
            `Compose a warm, reassuring message for a person experiencing ${mood} as if you were a therapist. Make it genuine and unique. Since this program's name is ReMind, give them a mindful message.`,
            `Motivate with a supportive message for someone who is feeling ${mood} as if you were a therapist. Keep it comforting and one-of-a-kind. Since this program's name is ReMind, give them a mindful message.`,
            `Craft a positive and meaningful message for a person in a ${mood} mood as if you were a therapist. Ensure it feels relatable and unique. Since this program's name is ReMind, give them a mindful message.`,
            `Offer an empathetic and inspiring message to someone who feels ${mood} as if you were a therapist. Keep it honest and encouraging. Since this program's name is ReMind, give them a mindful message.`,
            `Provide a sincere and supportive message for someone feeling ${mood} as if you were a therapist. Make it unique and heartwarming. Since this program's name is ReMind, give them a mindful message.`,
            `Say an uplifting message for someone in a ${mood} mood, acting as if you were a listening, validating human. Make it sound thoughtful and realistic, like a human. Since this program's name is ReMind, give them a mindful message.`,
            `Encouraging message for feeling ${mood} as if you were a therapist. Keep it fresh and motivating. Since this program's name is ReMind, give them a mindful message.`,
            `Write a thoughtful and compassionate message for a person experiencing ${mood}, as if you were a therapist. Make sure the message is gentle yet motivating. Since the name of this program is ReMind, inspire them with a message that encourages mindfulness and self-compassion.`,
            `Compose a thoughtful message for someone feeling ${mood}, offering guidance with a compassionate, therapist-like approach. Ensure the message is unique and mindful. With ReMind in mind, encourage them to stay present and be gentle with themselves.`
        );
    } else if (userInput) {
        prompts.push(
            `Respond to this message as if you were a caring and supportive someone: ${userInput}`,
            `Respond to this message as if you were a wise and reassuring someone: ${userInput}`,
            `Respond to this message as if you were an inspiring and encouraging someone: ${userInput}`,
            `Respond to this message as if you were a wise and caring friend: ${userInput}`,
            `Respond to this message as if you were an optimistic and motivating someone: ${userInput}`,
            `Respond to this message as if you were a balanced and empathetic someone: ${userInput}`
        );
    }

    return prompts[Math.floor(Math.random() * prompts.length)];
}

async function getMotivationalMessage(prompt) {
    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 1, maxOutputTokens: 5000 }
            }),
        });
        const data = await response.json();
        const candidates = data.candidates || [];
        if (candidates.length > 0) {
            const content = candidates[0].content || {};
            const parts = content.parts || [];
            if (parts.length > 0) {
                return parts[0].text.trim();
            }
        }
        return "Sorry, I couldn't fetch a motivational message. Try again later.";
    } catch (error) {
        return "Sorry, I couldn't fetch a motivational message. Try again later.";
    }
}

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message");
    messageDiv.classList.add(isUser ? "user-message" : "bot-message");
    messageDiv.textContent = text;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    setTimeout(() => {
        messageDiv.classList.add("show"); 
    }, 50); 
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = "";
        showTyping();

        const prompt = generatePrompt(null, message);
        const response = await getMotivationalMessage(prompt);

        removeTyping();
        addMessage(response);
    }
}

async function handleMood(mood) {
    currentMood = mood;
    addMessage(`I feel ${mood}`, true);
    moodButtons.style.display = "none";
    showTyping();

    const prompt = generatePrompt(mood, null);
    const response = await getMotivationalMessage(prompt);

    removeTyping();
    addMessage(response);
    moreButtons.style.display = "block";
}

function handleMore(response) {
    addMessage(response, true);
    moreButtons.style.display = "none";
    if (response === "Yes") {
        addMessage("Okay, here's more for you!");
        handleMood(currentMood);
    } else {
        addMessage("Got it! Let me know if you need more support.");
    }
}

function botGreeting() {
    setTimeout(() => {
        addMessage("Hi! How are you today, my dear?");
        moodButtons.style.display = "flex";  
    }, 300);  
}

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
})
;

window.onload = botGreeting;
