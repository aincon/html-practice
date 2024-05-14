
// 클라이언트 측 JavaScript 코드
function addPost() {
    var title = prompt("게시글 제목을 입력하세요:");
    var contents = prompt("게시글 내용을 입력하세요:");
    var nickname = document.getElementById('profileInfo').getElementsByTagName('p')[1].textContent.trim();
    var nickname = nickname.replace('환영합니다 ', '').replace('님!', '');

    if (title && contents && nickname) {
        // 서버로부터 게시글 수를 가져오는 요청을 보냄
        fetch('http://localhost:3000/api/countPost')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            var post_id = data.count + 1; // 게시글 수 + 1을 새로운 게시물의 ID로 사용
            // 새로운 게시물 추가 요청을 서버로 보냄
            fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, contents: contents, user_nm: nickname, post_id: post_id })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                // UI에 새로운 게시물 추가
                var postDiv = document.createElement("div");
                postDiv.className = "post";
                postDiv.innerHTML = `
                    <h2>${title}</h2>
                    <p>${contents}</p>
                    <span>작성자: ${nickname}</span>
                    <button onclick="deletePost(${post_id})">삭제</button>`;
                document.getElementById("posts").appendChild(postDiv);
            })
            .catch(error => {
                console.error('Error adding new post:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching post count:', error);
        });
    }
}
function deletePost(post_id) {
    // 서버로 해당 게시물을 삭제하는 요청을 보냄
    fetch('http://127.0.0.1:3000/api/posts/' + post_id, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('게시물이 성공적으로 삭제되었습니다.');
        // UI에서 해당 게시물 삭제
        var postElement = document.querySelector(`[data-post-id="${post_id}"]`);
        if (postElement) {
            postElement.remove();
        } else {
            console.error('Cannot find post element with ID:', post_id);
        }
        window.location.reload();
    })
    .catch(error => {
        console.error('Error deleting post:', error);
    });
}


// 서버로 데이터 전송하는 함수
function savePostToServer(title, post, nickname, post_id) {
    fetch('http://127.0.0.1:3000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title, contents: post, user_nm:nickname, post_id })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('게시물이 성공적으로 저장되었습니다.');
    })
    .catch(error => {
        console.error('Error saving post:', error);
    });
}

// 서버로부터 게시글 정보 받아오기
function fetchPosts() {
    fetch('http://127.0.0.1:3000/api/posts')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {
            var postDiv = document.createElement("div");
            postDiv.className = "post";
            postDiv.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.contents}</p>
                <span>작성자: ${post.user_nm}</span>
                <button onclick="deletePost(${post.post_id})">삭제</button>`;
            document.getElementById("posts").appendChild(postDiv);
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
}

// 페이지 로드 시 게시글 정보 불러오기
document.addEventListener('DOMContentLoaded', fetchPosts);

function countPost(callback) {
    fetch('http://localhost:3000/api/countPost')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        callback(null, data.count);
    })
    .catch(error => {
        callback(error, null);
    });
}

function fetchProfile() {
    fetch('http://127.0.0.1:52271/profile', {
        method: 'GET',
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            return response.json();
        })
        .then(profileData => {
            // 프로필 정보를 받아와서 HTML에 추가
            const username = profileData.username;
            if (!profileData.username) {
                // 프로필 정보가 없으면 로그인 페이지로 이동
                window.location.href = '../LgnRgstr/LoginPage.html';
                return;
            }
            const profileInfoDiv = document.getElementById('profileInfo');
            profileInfoDiv.innerHTML = `
                <p>User Profile:</p>
                <p>환영합니다 ${username}님!</p>
                `;
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            window.location.href = '../LgnRgstr/LoginPage.html';
        });
}


function logout() {
    fetch('http://127.0.0.1:52271/logout', {
        method: 'GET',
        credentials: 'same-origin'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
            // 로그아웃 성공 시 로그인 페이지로 이동
            window.location.href = '../LgnRgstr/LoginPage.html';
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
}

// 페이지 로드 시 프로필 정보 요청
window.onload = function () {
    fetchProfile();
};