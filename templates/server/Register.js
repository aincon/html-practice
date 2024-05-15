const bodyParser = require('body-parser');
const DBManager = require('../DBMS/userDBManager');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
// Express 앱 생성
const app = express();
const dbManager = new DBManager();



// CORS 설정
app.use(cors());
// 세션 설정
app.use(session({
    secret: 'my key', // 세션 암호화에 사용할 키
    resave: false,
    saveUninitialized: false,
}));


// Body-parser 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//라우트합니다.
app.post('/register', (req, res) => {

    console.log('회원가입 중...');
    dbManager.getRowCount(rowCount => {
        const userData = {
            username: req.body.username,
            id: req.body.id,
            password: req.body.password,
            uniqueNum: rowCount+1
        };
        console.log('Received data:', userData);
        
        // DBManager를 통해 데이터베이스에 데이터를 삽입합니다.
        dbManager.insertData(userData, (results) => {
            // 성공적으로 처리되었음을 클라이언트에 응답합니다.
            res.redirect('http://127.0.0.1:5500/templates/LgnRgstr/LoginPage.html');
        });
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
            req.session.username = {
                username: username
            };
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
    //const username = req.session.data;
    const username = session[privateKey].nm;
    res.json({ username: username }); // 세션에 저장된 사용자 이름을 클라이언트에게 반환

});

// 로그아웃 라우트
app.get('/logout', (req, res) => {
    // 세션 제거
    delete session[privateKey];
    res.redirect('http://127.0.0.1:5500/templates/LgnRgstr/LoginPage.html');
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
    console.log(`유저 관리 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});




