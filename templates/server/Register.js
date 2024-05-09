
const { urlencoded } = require('body-parser');
const DBManager = require('./DBManager');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require("cookie-parser");
// Express 앱 생성
const app = express();
const dbManager = new DBManager();
app.use(cors());


// 세션 설정
app.use(session({
    secret: 'my key', // 세션 암호화에 사용할 키
    resave: false,
    saveUninitialized: false,
}));


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
        password: req.body.password,
        uniqueNum: getRowCount(callback)
    };
    console.log('Received data:', req.body);
    // DBManager를 통해 데이터베이스에서 데이터를 가져옵니다.
    dbManager.insertData(userData, (results) => {

        // 성공적으로 처리되었음을 클라이언트에 응답
        res.redirect('http://localhost:5500/templates/Main/MainPage.html');
    });
});


let privateKey;

// 로그인 처리
app.post('/login', (req, res) => {
    const userData = {
        id: req.body.id,
        password: req.body.password
    };
    
    // DBManager를 통해 로그인 정보 확인
    dbManager.checkLogin(userData, (authenticated, username, uniqueNum) => {
        if (authenticated) {
            console.log('로그인 성공(server): ', userData);
            // 세션에 사용자 정보 저장
            privateKey = String(uniqueNum);
            userData['nm'] = username;
            session[privateKey] = userData;
            req.session.username = username;
            console.log('로그인 성공(session): ',session);
            res.redirect('http://localhost:5500/templates/Main/MainPage.html');
        } else {
            console.log('로그인 실패');
            res.redirect('http://127.0.0.1:5500/templates/LgnRgstr/LoginPage.html');
        }
    });
});
// 프로필 요청 처리
app.get('/profile', (req, res) => {
    // 세션에서 사용자 정보 가져오기
    console.log('profile:', session[privateKey].nm);
    const username = session[privateKey].nm;
    console.log('profile:', username);
        res.json({ username: username }); // 세션에 저장된 사용자 이름을 클라이언트에게 반환
    
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




