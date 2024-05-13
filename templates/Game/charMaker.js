
// 저장된 캐릭터 전부 표시
function renderCharacterInfo() {
    // 세션 스토리지에 저장된 캐릭터 정보 표시
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key.startsWith('characterInfo_')) {
            const characterInfo = JSON.parse(sessionStorage.getItem(key));
            // 캐릭터 이름을 사용하여 렌더링합니다.
            renderCharacter(characterInfo);
        }
    }

    // 데이터베이스에서 저장된 캐릭터 정보 표시
    fetch('http://127.0.0.1:3001/getAllChars')
        .then(response => response.json())
        .then(data => {
            data.forEach(characterInfo => {
                // 캐릭터 정보를 렌더링합니다.
                renderCharacter(characterInfo);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // 오류가 발생하면 적절한 처리를 수행합니다.
        });
}
function renderCharacter(characterInfo) {
    // 캐릭터 이름을 가져옵니다.
    const username = characterInfo.name_ch;

    // 캐릭터 이름을 표시하는 레이블 생성
    const nameLabel = document.createElement('label');
    nameLabel.textContent = username;

    // 캐릭터 컨테이너 생성 및 스타일 지정
    const charContainer = document.createElement('div');
    charContainer.classList.add('character-container');
    charContainer.style.cursor = 'pointer'; // 클릭 가능한 커서 설정

    // 삭제 버튼을 추가합니다.
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('charDel');
    deleteButton.textContent = username + ' 삭제';
    deleteButton.addEventListener('click', function () {
        // 해당 캐릭터를 서버로부터 삭제합니다.
        const characterName = characterInfo.username;
        fetch(`http://127.0.0.1:3001/deleteCharacter/${characterName}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('캐릭터 삭제 중 오류가 발생했습니다.');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // 성공 메시지 출력
            // 성공적으로 삭제되면 해당 캐릭터 컨테이너를 삭제합니다.
            charContainer.remove();
        })
        .catch(error => {
            console.error('Error:', error);
            // 오류가 발생하면 적절한 처리를 수행합니다.
        });
    });
    nowChar.appendChild(deleteButton);

    // 캐릭터 이름을 컨테이너에 추가
    charContainer.appendChild(nameLabel);

    // 클릭 이벤트 핸들러 추가: 클릭하면 캐릭터 정보를 nowChar에 표시
    charContainer.addEventListener('dblclick', function () {
        showCharacterInfo(characterInfo);
    });

    // 캐릭터 컨테이너를 드래그 앤 드롭 가능하게 만듭니다.
    makeDraggable(charContainer);

    // 문서에 캐릭터 컨테이너를 추가합니다.
    document.getElementById('field').appendChild(charContainer);
}

// 캐릭터 정보를 char창에 표시
function showCharacterInfo(characterInfo) {
    const nowChar = document.getElementById('nowChar');
    nowChar.innerHTML = ''; // 이전에 표시된 정보를 초기화합니다.

    // 닉네임 정보를 추가합니다.
    const usernameLabel = document.createElement('label');

    usernameLabel.textContent = `닉네임: ${characterInfo.name_ch}`;
    nowChar.appendChild(usernameLabel);
    alert(JSON.stringify(characterInfo));

    nowChar.appendChild(document.createElement("br"));
    // 스탯 정보를 추가합니다.
    const statsLabel = document.createElement('label');
    statsLabel.textContent = '스탯:';
    nowChar.appendChild(statsLabel);

    const statsList = document.createElement('ul');
    characterInfo.stats.forEach(stat => {
        const statItem = document.createElement('li');
        statItem.textContent = `${stat.name}: ${stat.value}`;
        statsList.appendChild(statItem);
    });
    nowChar.appendChild(statsList);

    // 삭제 버튼을 추가합니다.
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('charDel');
    deleteButton.textContent = `${characterInfo.username} 삭제`;
    deleteButton.addEventListener('click', function () {
        // 해당 캐릭터를 서버로부터 삭제합니다.
        const characterName = characterInfo.username;
        fetch(`http://127.0.0.1:3001/deleteCharacter/${characterName}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('캐릭터 삭제 중 오류가 발생했습니다.');
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // 성공 메시지 출력
            // 성공적으로 삭제되면 채팅 창의 이름을 초기화합니다.
            const chatName = document.getElementById('chatName');
            chatName.textContent = '채팅:';
        })
        .catch(error => {
            console.error('Error:', error);
            // 오류가 발생하면 적절한 처리를 수행합니다.
        });
    });
    nowChar.appendChild(deleteButton);
}

// 캐릭터 삭제 함수
function removeCharacterInfo(name) {
    // 서버로 DELETE 요청을 보냅니다.
    fetch(`http://127.0.0.1:3001/deleteCharacter/${name}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('캐릭터 삭제 중 오류가 발생했습니다.');
        }
        return response.text();
    })
    .then(data => {
        console.log(data); // 성공 메시지 출력
        // 성공적으로 삭제되면 세션 스토리지에서 해당 캐릭터 정보를 삭제하고 화면에서도 삭제합니다.
        sessionStorage.removeItem(`characterInfo_${name}`);
        const characterContainer = document.querySelector(`[data-character-id="${name}"]`);
        if (characterContainer) {
            characterContainer.remove();
        }
        renderCharacterInfo();
    })
    .catch(error => {
        console.error('Error:', error);
        // 오류가 발생하면 적절한 처리를 수행합니다.
    });
}

// 캐릭터 생성 함수
function createCharacter() {
    // 닉네임 입력값 가져오기
    const usernameLabel = document.getElementById('usernameLabel').textContent;

    // 스탯 정보 가져오기
    const charStats = JSON.parse(sessionStorage.getItem('charStats')) || [];

    // 닉네임과 스탯 정보를 하나의 객체로 묶기
    const characterInfo = {
        username: usernameLabel,
        stats: charStats
    };
    //{"username":"ㅁㅁ","stats":[{"name":"ㅁㅁㅁ","value":"2"}]}
    // 서버로 POST 요청 보내기
    fetch('http://127.0.0.1:3001/createCharacter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterInfo)
    })
        .then(response => response.json())
        .then(data => {
            // 서버에서의 응답 처리
            alert(data.message); // 예를 들어, 성공 메시지 또는 에러 메시지를 받을 수 있음
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // 알림 표시
    alert('캐릭터가 생성되었습니다!');

    // 세션 스토리지에서 캐릭터 정보 초기화
    sessionStorage.removeItem('charStats');

    // 새로고침 없이 캐릭터 정보 초기화를 위해 스탯을 렌더링합니다.
    renderStats();

    // 세션 스토리지에서 저장된 모든 캐릭터 정보를 다시 렌더링합니다.
    renderCharacterInfo();

    location.reload()
}


// 닉네임 변경 함수
function nameEdit() {
    const newUsername = prompt('새로운 닉네임을 입력하세요:');

    // 닉네임 없는 경우
    if (!newUsername) {
        alert('닉네임을 입력하세요.');
        return;
    }

    // 닉네임 변경
    const usernameLabel = document.getElementById('usernameLabel');
    usernameLabel.textContent = newUsername;

    // 세션에 저장
    sessionStorage.setItem('username', newUsername);
    alert('닉네임이 변경되었습니다.');
}

function statAdd() {
    const statName = document.querySelector('#statName').value;
    const statValue = document.querySelector('#statValue').value;

    if (!statName || !statValue) {
        alert('속성과 값을 모두 입력하세요.');
        return;
    }
    let charStats = JSON.parse(sessionStorage.getItem('charStats')) || [];

    // 객체 생성
    const newStat = {
        name: statName,
        value: statValue
    };

    // 스탯 추가
    charStats.push(newStat);

    // 스탯창 세션에 저장
    sessionStorage.setItem('charStats', JSON.stringify(charStats));

    // 화면에 캐릭터 스탯을 표시합니다.
    renderStats();
}
function renderStats() {
    const charStats = JSON.parse(sessionStorage.getItem('charStats')) || [];
    const charStatsContainer = document.querySelector('#statList');

    // 스탯을 추가할 때마다 추가되는 요소를 모두 지우기 위해 자식 요소를 하나씩 삭제합니다.
    while (charStatsContainer.lastChild) {
        charStatsContainer.removeChild(charStatsContainer.lastChild);
    }

    // 새로운 스탯을 화면에 표시합니다.
    charStats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.textContent = `${stat.name}: ${stat.value}`;

        // 삭제 버튼 추가
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.onclick = function () {
            // 세션 스토리지에서 해당 스탯을 삭제합니다.
            const updatedStats = charStats.filter(s => s.name !== stat.name);
            sessionStorage.setItem('charStats', JSON.stringify(updatedStats));

            // 다시 렌더링
            renderStats();
        };

        charStatsContainer.appendChild(statElement);
        charStatsContainer.appendChild(deleteButton);
    });
}

// 드래그 앤 드롭을 처리하는 함수
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;

        const field = document.getElementById('field');
        const fieldRect = field.getBoundingClientRect();

        const x = e.clientX - fieldRect.left - offsetX;
        const y = e.clientY - fieldRect.top - offsetY;

        element.style.left = x + 'px';
        element.style.top = y + 'px';
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });
}