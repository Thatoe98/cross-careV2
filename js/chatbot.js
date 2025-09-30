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
        // Sanitize input
        const message = userMessage.toLowerCase().trim();
        
        // Simulate API delay for better UX (remove this when integrating with n8n)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Enhanced response logic with more medical-specific responses
        if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greet')) {
            return "Hello! I'm your Cross-Care AI assistant. How can I help you today?";
        } else if (message.includes('help') || message.includes('assist') || message.includes('support')) {
            return "I'm here to help you with information about Cross-Care medical services. You can ask me about:\n• Our medical referral services\n• Hospital partners in Thailand\n• Appointment booking process\n• Contact information";
        } else if (message.includes('service') || message.includes('what do you do') || message.includes('about')) {
            return "Cross-Care provides comprehensive medical referral services, helping people from Myanmar access quality medical care in Thailand. We coordinate with trusted hospital partners to ensure you receive the best possible healthcare.";
        } else if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('reach')) {
            return "You can contact Cross-Care through:\n• Our website contact form\n• Facebook: Cross-Care Medical Services\n• Or fill out our consultation form on the website\n\nOur team will respond promptly to assist you.";
        } else if (message.includes('hospital') || message.includes('partner') || message.includes('clinic')) {
            return "We work with several trusted hospital partners across Thailand, specializing in various medical fields. You can find detailed information about our partner hospitals in the Partners section of our website.";
        } else if (message.includes('appointment') || message.includes('booking') || message.includes('schedule')) {
            return "To book a medical appointment or consultation:\n1. Fill out our contact form on the website\n2. Contact us via Facebook\n3. Our team will coordinate with the appropriate hospital partner\n4. We'll guide you through the entire process";
        } else if (message.includes('cost') || message.includes('price') || message.includes('fee') || message.includes('payment')) {
            return "For information about medical costs and our service fees, please contact us directly through our website form or Facebook page. Our team can provide detailed pricing based on your specific medical needs.";
        } else if (message.includes('myanmar') || message.includes('burma') || message.includes('language')) {
            return "Yes, we specifically serve the Myanmar community! Our team understands the cultural and language needs of Myanmar patients seeking medical care in Thailand.";
        } else if (message.includes('thailand') || message.includes('bangkok') || message.includes('location')) {
            return "We coordinate medical care across Thailand, with partner hospitals in major cities including Bangkok. Our team will help you choose the best location based on your medical needs and preferences.";
        } else if (message.includes('emergency') || message.includes('urgent') || message.includes('immediate')) {
            return "For medical emergencies, please contact local emergency services immediately. For urgent medical consultations, please call us directly or use our priority contact form on the website.";
        } else if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
            return "You're very welcome! Is there anything else I can help you with regarding Cross-Care medical services?";
        } else if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
            return "Goodbye! Feel free to reach out anytime if you need assistance with Cross-Care services. Take care of your health!";
        } else {
            return "Thank you for your message. I'm here to help with Cross-Care medical services. For specific medical inquiries or detailed assistance, please use our contact form or Facebook page where our medical coordinators can provide personalized support.";
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