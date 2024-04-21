// 필요한 모듈 가져오기
const express = require('express');
const bodyParser = require('body-parser');

// Express 앱 생성
const app = express();

// POST 요청을 처리하기 위해 body-parser 미들웨어 사용
app.use(bodyParser.urlencoded({ extended: true }))

// 변수를 선언합니다.
const users = [];

//라우트합니다.
app.get('/user', (request, response) => {
    response.send(users);
});

// POST 요청을 처리할 엔드포인트 생성
app.post('/', (req, res) => {
    // 사용자가 제출한 데이터 가져오기
    console.log("request.query");
    const username = req.body.username;
    const id = req.body.id;
    const password = req.body.password;

    // 여기서는 간단히 콘솔에 출력하겠지만, 실제로는 데이터베이스에 저장하거나 다른 작업을 수행해야 합니다.
    console.log('닉네임:', username);
    console.log('아이디:', id);
    console.log('비밀번호:', password);
    // 예외를 처리합니다.
    if (!username)
        return response.status(400).send('닉네임을 입력하시오');    
    else if (!id)
        return response.status(400).send('아이디를 입력하시오');
    else if (!password)
        return response.status(400).send('패스워드를 입력하시오');

    // 데이터를 저장합니다.
    const data = {
        username: username,
        id: id,
        password: password
    };
    users.push(data);
    // 성공적으로 처리되었음을 클라이언트에 응답
    res.redirect('http://localhost:5500/templates/RoleChoicePage.html');
});

// 서버 시작
const port = 52271;
app.listen(port, () => {
    console.log('Server Running at http://127.0.0.1:52271');
});
