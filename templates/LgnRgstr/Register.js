// 필요한 모듈 가져오기
const DBManager = require('../DBManager');
const express = require('express');
const bodyParser = require('body-parser');

const session = require('express-session');
const cors = require('cors');
const { WebSocketServer } = require("ws");



// Express 앱 생성
const app = express();
const dbManager = new DBManager();
app.use(cors());

// Body Parser 미들웨어 사용 설정
app.use(bodyParser.urlencoded({ extended: true }));

// 세션 설정
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const wss = new WebSocketServer({ port: 8001 });
wss.on("connection", (ws, request) => {
    // 연결된 모든 클라이언트에게 새로운 사용자 접속 알림
    wss.clients.forEach(client => {
        client.send(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`);
    });

    console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`);

    ws.on("message", data => {
        // 클라이언트로부터 받은 메시지와 함께 사용자 ID를 데이터베이스에서 가져오기
        dbManager.getUserId((userId) => {
            // 채팅 메시지에 사용자 ID 추가
            const messageWithUserId = `${userId}: ${data.toString()}`;

            // 연결된 모든 클라이언트에게 채팅 메시지 브로드캐스트
            wss.clients.forEach(client => {
                client.send(messageWithUserId);
            });
        });
    });

    ws.on("close", () => {
        wss.clients.forEach((client) => {
            client.send(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
        });
    });
});


//라우트합니다.
app.post('/register', (req, res) => {

    console.log('회원가입 중...'); 
    const userData = {
        username: req.body.username,
        id: req.body.id,
        password: req.body.password
    };
    console.log('Received data:', req.body); 
    // DBManager를 통해 데이터베이스에서 데이터를 가져옵니다.
    dbManager.insertData(userData, (results) => {
    
    // 성공적으로 처리되었음을 클라이언트에 응답
    res.redirect('http://localhost:5500/templates/Game/RoleChoicePage.html');
    });
});

app.post('/login', (req, res) => {
    console.log('로그인 중...'); 
    // 로그인 폼에서 전송된 데이터
    const userData = {
        id: req.body.id,
        password: req.body.password
    };

    console.log('로그인 중...1'); 
    // DBManager를 통해 로그인 정보 확인
    dbManager.checkLogin(userData, (authenticated) => {
        if (authenticated) {
            console.log('로그인 성공'); 
            // 세션에 ID 저장
            req.session.userId = userData.id;
            
            res.redirect('http://localhost:5500/templates/Game/RoleChoicePage.html');
        } else {
            console.log('로그인 실패');
            res.redirect('http://127.0.0.1:5500/templates/LgnRgstr/LoginPage.html'); 
        }
    });
});

// 로그아웃 라우트
app.get('/logout', (req, res) => {
    // 세션 삭제
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
});

// 사용자 ID를 가져오는 엔드포인트 설정
app.get('/getUserId', (req, res) => {
    
    console.log('user_nm불러오는 중..'); 
    // DBManager를 사용하여 데이터베이스에서 사용자 ID 가져오기
    dbManager.getUserId((userNM) => {
        // 클라이언트에게 JSON 형식으로 응답으로 사용자 ID 전송
        res.json({ userNM: userNM });
    });
});

// 서버 시작
const port = 52271;
app.listen(port, () => {
    console.log('Server Running at http://127.0.0.1:52271');
});
