// 필요한 모듈 가져오기
const express = require('express');
const bodyParser = require('body-parser');

// Express 앱 생성
const app = express();

// POST 요청을 처리하기 위해 body-parser 미들웨어 사용
app.use(bodyParser.urlencoded({ extended: true }));

// POST 요청을 처리할 엔드포인트 생성
app.post('/submit.txt', (req, res) => {
    // 사용자가 제출한 데이터 가져오기
    const username = req.body.username;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;

    // 여기서는 간단히 콘솔에 출력하겠지만, 실제로는 데이터베이스에 저장하거나 다른 작업을 수행해야 합니다.
    console.log('닉네임:', username);
    console.log('비밀번호:', password);
    console.log('비밀번호 확인:', passwordConfirmation);

    // 성공적으로 처리되었음을 클라이언트에 응답
    res.send('회원가입이 완료되었습니다.');
});

// 서버 시작
const port = 5500;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
