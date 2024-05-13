const express = require('express');
const charDBManager = require('./charDBManager');
const app = express();
const cors = require('cors');
const port = 3001;


const dbManager = new charDBManager(); // charDBManager 인스턴스 생성

app.use(express.json());

app.use(cors());
// 모든 캐릭터 가져오기
app.get('/getAllChars', (req, res) => {
    dbManager.getAllChars((results) => {
        res.json(results);
    });
});

// 캐릭터 추가
//{"username":"ㅁㅁ","stats":[{"name":"ㅁㅁㅁ","value":"2"}]}
app.post('/createCharacter', (req, res) => {
    const { username, stats } = req.body; // 클라이언트로부터 받은 이름과 스탯 데이터 추출
    const stat1 = stats[0] ? stats[0].name : null;
    const a = stats[0] ? stats[0].value : null;
    const stat2 = stats[1] ? stats[1].name : null;
    const b = stats[1] ? stats[1].value : null;
    const stat3 = stats[2] ? stats[2].name : null;
    const c = stats[2] ? stats[2].value : null;
    // dbManager.insertChar 함수에 데이터 전달
    dbManager.insertChar(username, stat1, a, stat2, b, stat3, c, (err, result) => {
        if (err) {
            console.error('캐릭터 추가 중 오류 발생:', err);
            res.status(500).send('캐릭터 추가 중 오류 발생');
        } else {
            console.log('캐릭터가 성공적으로 추가되었습니다.');
            res.send('캐릭터가 성공적으로 추가되었습니다.');
        }
    });
});

// 캐릭터 삭제 요청을 처리하는 엔드포인트
app.delete('/deleteCharacter/:username', (req, res) => {
    const name = req.params.username;

    // 여기에서 dbManager에 해당 캐릭터를 삭제하는 함수를 호출합니다.
    // 예를 들어, deleteCharacterByName 함수를 사용한다고 가정합니다.
    dbManager.deleteChar(name, (err, result) => {
        if (err) {
            console.error('캐릭터 삭제 중 오류 발생:', err);
            res.status(500).send('캐릭터 삭제 중 오류 발생');
        } else {
            console.log('캐릭터가 성공적으로 삭제되었습니다.');
            res.send('캐릭터가 성공적으로 삭제되었습니다.');
        }
    });
});
// 서버 시작
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});