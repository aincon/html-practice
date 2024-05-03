// 필요한 모듈 가져오기
const DBManager = require('../DBManager');
const express = require('express');
const bodyParser = require('body-parser');


// Express 앱 생성
const app = express();

// POST 요청을 처리하기 위해 body-parser 미들웨어 사용
app.use(bodyParser.urlencoded({ extended: true }))

// 변수를 선언합니다.
const dbManager = new DBManager();

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

    // DBManager를 통해 로그인 정보 확인
    dbManager.checkLogin(userData, (authenticated) => {
        if (authenticated) {
            console.log('로그인 성공'); 
            res.redirect('http://localhost:5500/templates/Game/RoleChoicePage.html');
        } else {
            console.log('로그인 실패');
            res.redirect('http://127.0.0.1:5500/templates/LgnRgstr/LoginPage.html'); 
        }
    });
});

// 서버 시작
const port = 52271;
app.listen(port, () => {
    console.log('Server Running at http://127.0.0.1:52271');
});
