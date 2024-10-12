const API_KEY = 'Authorization: Bearer OPENAI_API_KEY'; // Replace this with your OpenAI API key

function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    
    if (userInput.trim() === "") return;

    // Display user message
    let chatBox = document.getElementById("chat-box");
    let userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("user-message");
    userMessageDiv.innerHTML = `<div class="message">${userInput}</div>`;
    chatBox.appendChild(userMessageDiv);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Clear input
    document.getElementById("user-input").value = "";

    // Send the message to the OpenAI API and get the response
    getAIResponse(userInput).then((botResponse) => {
        let botMessageDiv = document.createElement("div");
        botMessageDiv.classList.add("bot-message");
        botMessageDiv.innerHTML = `<div class="message">${botResponse}</div>`;
        chatBox.appendChild(botMessageDiv);
        
        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

async function getAIResponse(input) {
    const apiEndpoint = "https://api.openai.com/v1/completions";
    
    const requestBody = {
        model: "text-davinci-003", // You can use the latest model like GPT-4 if available
        prompt: input,
        max_tokens: 150, // Adjust based on how long you want the response
        temperature: 0.7, // Higher values (closer to 1) produce more creative responses
    };
    
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
    };

    try {
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        return data.choices[0].text.trim(); // Return the generated response
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Oops, something went wrong. Please try again later.";
    }
}
