const messagesContainer = document.getElementById('messages');
const topicSelect = document.getElementById('topic');

// Load messages based on the selected topic
function loadMessages() {
    const selectedTopic = topicSelect.value;
    const messages = JSON.parse(localStorage.getItem(selectedTopic)) || [];
    
    messagesContainer.innerHTML = ''; // Clear the container
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `<strong>${msg.alias}</strong>: ${msg.message} <em>(${msg.timestamp})</em>`;
        
        // If an image is attached, append it to the message
        if (msg.image) {
            const imgElement = document.createElement('img');
            imgElement.src = msg.image;
            imgElement.alt = 'Attached Image';
            imgElement.style.maxWidth = '200px'; // Adjust size as needed
            messageElement.appendChild(imgElement);
        }

        messagesContainer.appendChild(messageElement);
    });
}

// Function to post a new message
function postMessage() {
    const alias = document.getElementById('alias').value.trim();
    const message = document.getElementById('message').value.trim();
    const selectedTopic = topicSelect.value;
    const imageInput = document.getElementById('image').files[0]; // Get the file input

    if (alias && message) {
        let imageBase64 = null;

        // Check if an image is attached and if it's a PNG
        if (imageInput && imageInput.type === 'image/png') {
            const reader = new FileReader();
            reader.onloadend = function() {
                imageBase64 = reader.result; // Convert the image to base64

                const timestamp = new Date().toLocaleString();
                const newMessage = { alias, message, timestamp, image: imageBase64 };

                // Retrieve existing messages for the selected topic, add the new one, and save them
                const messages = JSON.parse(localStorage.getItem(selectedTopic)) || [];
                messages.push(newMessage);
                localStorage.setItem(selectedTopic, JSON.stringify(messages));

                // Clear input fields
                document.getElementById('alias').value = '';
                document.getElementById('message').value = '';
                document.getElementById('image').value = ''; // Clear the file input

                loadMessages(); // Refresh messages after posting

                // Set a timeout to remove the message after 3 days
                setTimeout(() => {
                    removeMessage(newMessage);
                }, 259200000); // 3 days in milliseconds
            };
            reader.readAsDataURL(imageInput); // Read the image as base64
        } else {
            const timestamp = new Date().toLocaleString();
            const newMessage = { alias, message, timestamp };

            // Retrieve existing messages for the selected topic, add the new one, and save them
            const messages = JSON.parse(localStorage.getItem(selectedTopic)) || [];
            messages.push(newMessage);
            localStorage.setItem(selectedTopic, JSON.stringify(messages));

            // Clear input fields
            document.getElementById('alias').value = '';
            document.getElementById('message').value = '';
            document.getElementById('image').value = ''; // Clear the file input

            loadMessages(); // Refresh messages after posting

            // Set a timeout to remove the message after 3 days
            setTimeout(() => {
                removeMessage(newMessage);
            }, 259200000); // 3 days in milliseconds
        }
    } else {
        alert('Please enter an alias and a message!');
    }
}

// Function to remove a message after 3 days
function removeMessage(messageToRemove) {
    const selectedTopic = topicSelect.value;
    let messages = JSON.parse(localStorage.getItem(selectedTopic)) || [];
    messages = messages.filter(msg => msg.timestamp !== messageToRemove.timestamp);
    localStorage.setItem(selectedTopic, JSON.stringify(messages));
    loadMessages(); // Refresh the displayed messages
}

// Admin function to clear all messages in the current topic
function clearMessages() {
    if (confirm('Are you sure you want to clear all messages?')) {
        const selectedTopic = topicSelect.value;
        localStorage.removeItem(selectedTopic);
        loadMessages(); // Refresh the displayed messages after clearing
        alert(`All messages for the topic "${selectedTopic}" have been cleared.`);
    }
}

// Load messages on page load
loadMessages();
