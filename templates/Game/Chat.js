const socket = new WebSocket('ws://localhost:8002');

function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value;

    if (message.trim() !== '') {
        const characterName = document.getElementById('chatName').textContent;
        const data = JSON.stringify({ characterName, message });
        socket.send(data);
        messageInput.value = '';
    }
}

socket.onmessage = function (event) {
    const message = event.data;
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
};

