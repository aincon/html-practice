
//버튼 눌러서 창 온오프
function toggleChar() {
    var div = document.getElementById('Char');
    var button = document.getElementById('CharButton');
    var bar = document.getElementById('LeftSidebar');
    if (div.style.display === 'none') {
        div.style.display = 'block';
        button.style.left = "40%";
        bar.style.left = "0%";
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


