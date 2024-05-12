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

// 파일 선택 시 실행되는 함수
function changeImage() {
    var input = document.getElementById('imageInput');
    var file = input.files[0];

    // FileReader 객체를 사용하여 이미지를 읽어옴
    var reader = new FileReader();
    reader.onload = function (e) {
        var selectedImage = document.getElementById('selectedImage');
        selectedImage.src = e.target.result; // 선택한 이미지로 변경
    };
    reader.readAsDataURL(file); // 파일을 읽음
}