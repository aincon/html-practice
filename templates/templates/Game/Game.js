
//캐릭터 생성
function CreateChar() {
    // 사용자 이름 받기
    var username = "fds";
    var character = document.createElement("div");
    character.id = "draggable";
    character.style = username;

    character.innerHTML = `${username}<img src="../source/charcterpic.png">`;

}
function onStatus() {// 캐릭터 시트 창에 DB불러와서 사용자 속성 설정

}
//버튼 눌러서 창 온오프
function toggleChar() {
    var div = document.getElementById('Char');
    var button = document.getElementById('CharButton');
    var bar = document.getElementById('LeftSidebar');
    if (div.style.display === 'none') {
        div.style.display = 'block';
        button.style.left = "40%";
        bar.style.left = "-0%";
    } else {
        div.style.display = 'none';
        button.style.left = "0";
        bar.style.left = "-60%";
    }
}
function toggleChat() {
    var div = document.getElementById('Chat');
    var button = document.getElementById('ChatButton');
    var bar = document.getElementById('RightSideBar');
    if (div.style.display === 'none') {
        div.style.display = 'block';
        button.style.right = "32%";
        bar.style.right = "-0%";

    } else {
        div.style.display = 'none';
        button.style.right = "0";
        bar.style.right = "-60%";
    }
}
function toggleMap() {
    var div = document.getElementById('Map')
    var button = document.getElementById('MapButton')
    var bar = document.getElementById('UpSideBar');
    if (div.style.display === 'none') {
        div.style.display = 'block';
        button.style.top = "24%";
        bar.style.top = "-0%";
    } else {
        div.style.display = 'none';
        button.style.top = 0;
        bar.style.top = "-60%";
    }
}
// 드래그로 맵 변경
function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    var files = event.dataTransfer.files;
    var reader = new FileReader();

    reader.onload = function (e) {
        var img = document.createElement("img");
        img.src = e.target.result;
        document.getElementById("dropzone").innerHTML = "";
        document.getElementById("dropzone").appendChild(img);
    };

    reader.readAsDataURL(files[0]);
}


// JavaScript를 사용하여 드래그 앤 드롭 기능을 구현합니다.
// 객체를 드래그하여 HTML 요소 내에서 움직이게 됩니다.

// 드래그 가능한 객체를 선택합니다.
var draggableElement = document.getElementById('draggable');

// 드래그 기능을 구현하는 함수
function dragElement(element) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(element.id + "-header")) {
        // 만약 헤더가 존재한다면, 해당 헤더를 드래그하도록 설정합니다.
        document.getElementById(element.id + "-header").onmousedown = dragMouseDown;
    } else {
        // 헤더가 없다면, 객체 전체를 드래그하도록 설정합니다.
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // 마우스 버튼을 클릭할 때의 객체의 초기 위치를 기록합니다.
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // 마우스를 움직일 때마다 객체를 이동시킵니다.
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // 마우스가 움직일 때마다 객체의 위치를 변경합니다.
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // 객체를 새 위치로 이동시킵니다.
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // 마우스 버튼을 놓을 때, 드래그 기능을 중단합니다.
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// 객체를 드래그 가능하게 만듭니다.
dragElement(draggableElement);
// 객체를 우클릭하여 배경색을 변경하는 함수
draggableElement.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    var customProperty = prompt("Enter custom property value:");
    if (customProperty !== null) {
        draggableElement.style.backgroundColor = customProperty;
    }
});

const chatWindow = document.getElementById("chat-window");

const ws = new WebSocket("ws://localhost:8001");
ws.onmessage = function(event) {
    const data = event.data;
    addMessageToChat(data.toString());
};

function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();

    if (message === "") {
        alert("메시지를 입력하세요.");
        return;
    }

    // 입력한 메시지를 서버로 전송
    ws.send(message);

    // 입력 상자 비우기
    messageInput.value = "";
}

function addMessageToChat(message) {
    const newMessage = document.createElement("div");
    newMessage.textContent = message;
    chatWindow.appendChild(newMessage);
}
// function sendMessage() {
//     // 사용자가 입력한 메시지 가져오기
//     var message = document.getElementById("message").value;

//     // 메시지가 비어 있는지 확인
//     if (message.trim() === "") {
//         alert("메시지를 입력하세요.");
//         return;
//     }

//     // WebSocket을 통해 서버로 메시지 전송
//     var ws = new WebSocket("ws://localhost:8001");
//     ws.onopen = function() {
//         ws.send(message);
//     };

//     // 서버로 메시지와 함께 요청을 보내서 사용자 ID를 가져옴
//     fetch('http://127.0.0.1:52271/getUserId')
//         .then(response => {
//             if (!response.ok) {
//                 console.error('오류 발생:',response);
//                 throw new Error('서버로부터 응답을 받을 수 없습니다.');
//             }
//             return response.json();
//         })
//         .then(data => {

//             var userNM = data.userNM;

//             // 채팅창에 메시지 추가
//             var chatWindow = document.getElementById("chat-window");
//             var newMessage = document.createElement("div");
//             newMessage.textContent = userNM + ": " + message;
//             chatWindow.appendChild(newMessage);

//             // 입력 상자 비우기
//             document.getElementById("message").value = "";
//         })
//         .catch(error => {
//             console.error('오류 발생:', error);
//             alert("사용자 ID를 가져오는 데 문제가 발생했습니다.");
//         });
