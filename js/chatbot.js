// Chatbot JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    let isOpen = false;

    // Toggle chat box
    chatToggle.addEventListener('click', function() {
        toggleChat();
    });

    // Close chat box
    chatClose.addEventListener('click', function() {
        closeChat();
    });

    // Send message on button click
    chatSend.addEventListener('click', function() {
        sendMessage();
    });

    // Send message on Enter key press
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function toggleChat() {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    function openChat() {
        chatBox.style.display = 'flex';
        chatBox.setAttribute('aria-hidden', 'false');
        chatToggle.style.transform = 'scale(0.9)';
        chatToggle.setAttribute('aria-label', 'Close Cross-Care AI Assistant');
        setTimeout(() => chatInput.focus(), 100);
        isOpen = true;
    }

    function closeChat() {
        chatBox.style.display = 'none';
        chatBox.setAttribute('aria-hidden', 'true');
        chatToggle.style.transform = 'scale(1)';
        chatToggle.setAttribute('aria-label', 'Open Cross-Care AI Assistant');
        chatToggle.focus();
        isOpen = false;
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeChat();
        }
    });

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '' || message.length > 500) return;

        // Disable input and send button
        chatInput.disabled = true;
        chatSend.disabled = true;

        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        try {
            // Generate bot response with async support
            const botResponse = await getBotResponse(message);
            hideTypingIndicator();
            addMessage(botResponse, 'bot');
        } catch (error) {
            hideTypingIndicator();
            addMessage("I'm sorry, I'm experiencing technical difficulties. Please try again later or use our contact form.", 'bot');
            console.error('Chatbot error:', error);
        } finally {
            // Re-enable input and send button
            chatInput.disabled = false;
            chatSend.disabled = false;
            chatInput.focus();
        }
    }

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
        typingDiv.id = 'typing-indicator';
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = '<i class="fas fa-circle"></i> <i class="fas fa-circle"></i> <i class="fas fa-circle"></i>';
        messageContent.style.animation = 'typing 1.4s infinite';
        
        typingDiv.appendChild(messageContent);
        chatMessages.appendChild(typingDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async function getBotResponse(userMessage) {
        try {
            console.log('Calling API with message:', userMessage);
            
            // Call the Vercel serverless function
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    timestamp: new Date().toISOString()
                })
            });

            console.log('API response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('API response data:', data);
                return data.response || "I'm sorry, I couldn't process that request. Please try again or contact us directly.";
            } else {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                
                // Try to parse as JSON, fallback to text
                let errorMessage;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorText;
                } catch (e) {
                    errorMessage = errorText;
                }
                
                return `I'm experiencing technical difficulties: ${errorMessage}. Please contact us through our website form or Facebook page.`;
            }
        } catch (error) {
            console.error('Error calling chatbot API:', error);
            
            // Check if it's a network error or API not found
            if (error.message.includes('fetch')) {
                return "I'm having trouble connecting to our AI service. This might be because the API endpoint is not properly deployed. Please contact us directly through our website form or Facebook page for immediate assistance.";
            }
            
            // Fallback to basic responses if API fails
            const message = userMessage.toLowerCase().trim();
            
            if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
                return "Hello! I'm your Cross-Care AI assistant. I'm currently experiencing connection issues, but I'm here to help. For immediate assistance, please contact us through our website form or Facebook page.";
            } else if (message.includes('help') || message.includes('contact')) {
                return "I'm having trouble connecting to our AI service right now. For immediate help with Cross-Care medical services, please:\n• Use our website contact form\n• Message us on Facebook: Cross-Care Medical Services\n• Our team will respond promptly to assist you.";
            } else {
                return "I'm currently experiencing technical difficulties connecting to our AI service. Please contact us directly through our website form or Facebook page (Cross-Care Medical Services) for immediate assistance with your medical needs.";
            }
        }
    }
});

// Add typing animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes typing {
        0%, 60%, 100% { opacity: 1; }
        30% { opacity: 0.4; }
    }
    
    .typing-indicator .message-content i {
        animation: typing 1.4s infinite;
        margin: 0 2px;
        font-size: 8px;
    }
    
    .typing-indicator .message-content i:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator .message-content i:nth-child(3) {
        animation-delay: 0.4s;
    }
`;
document.head.appendChild(style);