
const { urlencoded } = require('body-parser');

const DBManager = require('./DBManager');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');


// Express 앱 생성
const app = express();
const dbManager = new DBManager();
app.use(cors());

// Body Parser 미들웨어 사용 설정
app.use(urlencoded({ extended: true }));


app.use(cookieParser());
// CORS 설정
app.use(cors());


//라우트합니다.
app.post('/register', (req, res) => {

    console.log('회원가입 중...');
    const userData = {
        username: req.body.username,
        id: req.body.id,
        password: req.body.password
    };
    console.log(userData);
    console.log('Received data:', req.body);
    // DBManager를 통해 데이터베이스에서 데이터를 가져옵니다.
    dbManager.insertData(userData, (results) => {

        // 성공적으로 처리되었음을 클라이언트에 응답
        res.redirect('http://localhost:5500/templates/Game/RoleChoicePage.html');
    });
});

app.post('/login', (req, res) => {
    // 로그인 폼에서 전송된 데이터
    const userData = {
        id: req.body.id,
        password: req.body.password
    };
    console.log(userData);
    // DBManager를 통해 로그인 정보 확인
    dbManager.checkLogin(userData, (authenticated, username) => {
        if (authenticated) {
            console.log('로그인 성공');
            // 쿠키에 사용자 정보 저장
            console.log(userData.id," ",username);
            res.cookie('userId', userData.id, { path: '/' });
            res.cookie('username', username, { path: '/' });
            res.redirect('http://localhost:5500/templates/Game/RoleChoicePage.html');
        } else {
            console.log('로그인 실패dfs');
            res.redirect('http://127.0.0.1:5500/templates/LgnRgstr/LoginPage.html');
        }
    });
});

app.get('/profile', (req, res) => {
    // 쿠키에서 사용자 정보 가져오기
    const username = decodeURIComponent(req.cookies.username);

    console.log("username!@: ", username);
    if (username) {
        res.json({ username: username }); // 쿠키에 저장된 사용자 이름을 클라이언트에게 반환
    } else {
        res.sendStatus(401); // 로그인되어 있지 않은 경우 401 Unauthorized 응답 반환
    }
});

// 로그아웃 라우트
app.get('/logout', (req, res) => {
    // 쿠키 삭제
    res.clearCookie('userId');
    res.clearCookie('username');
    res.redirect('/login');
});

// 사용자 ID를 가져오는 엔드포인트 설정
app.get('/getUserId', (req, res) => {

    console.log('user_nm불러오는 중..');
    // DBManager를 사용하여 데이터베이스에서 사용자 ID 가져오기
    dbManager.getUserId((user_nm) => {
        // 클라이언트에게 JSON 형식으로 응답으로 사용자 ID 전송
        res.json({ userNM: user_nm });
    });
});

// 서버 시작
const port = 52271;
app.listen(port, () => {
    console.log('Server Running at http://127.0.0.1:52271');
});




