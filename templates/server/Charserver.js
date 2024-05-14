const express = require('express');
const charDBManager = require('../DBMS/charDBManager');
const app = express();
const cors = require('cors');
const port = 3001;
const dbManager = new charDBManager(); // charDBManager 인스턴스 생성


// POST 요청의 본문을 파싱하기 위해 body-parser 미들웨어 사용
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
    dbManager.insertChar(username, stat1, a, stat2, b, stat3, c,250,250, (err, result) => {
        if (err) {
            console.error('캐릭터 추가 중 오류 발생:', err);
            res.status(500).send('캐릭터 추가 중 오류 발생');
        } else {
            console.log('캐릭터가 성공적으로 추가되었습니다.');
            res.send('캐릭터가 성공적으로 추가되었습니다.');
        }
    });
});

// 캐릭터 삭제
app.delete('/deleteCharacter/:name', (req, res) => {
    const name = req.params.name; // 클라이언트로부터 전달된 캐릭터 이름
    console.log(JSON.stringify(name));
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

// 클라이언트로부터 좌표를 받아서 데이터베이스에 저장하는 라우트
app.post('/updateCoordinates', (req, res) => {
    const { x, y, name } = req.body; // 클라이언트에서 전송한 좌표 추출

    // x와 y가 모두 null이 아닌 경우에만 데이터베이스에 좌표 저장
    if (x !== null && y !== null) {
        // 데이터베이스에 좌표 저장
        dbManager.updateCoordinates(x, y, name);
        res.status(200).send('좌표가 업데이트되었습니다.');
    } else {
        res.status(400).send('유효하지 않은 좌표입니다.');
    }
});

// 캐릭터 이름을 통해 좌표를 반환하는 라우트
app.get('/getCoordinates', (req, res) => {
    const characterName = req.query.name; // 요청으로부터 캐릭터 이름을 가져옵니다.

    // 데이터베이스에서 해당 캐릭터의 좌표를 가져옵니다.
    getCharacterCoordinates(characterName, (err, coordinates) => {
        if (err) {
            console.error('캐릭터 좌표 조회 중 오류 발생:', err);
            res.status(500).send('서버 오류');
            return;
        }

        if (!coordinates) {
            // 해당 캐릭터가 존재하지 않을 경우
            console.log(`'${characterName}' 캐릭터를 찾을 수 없습니다.`);
            res.status(404).send('캐릭터를 찾을 수 없습니다.');
            return;
        }

        // 좌표를 JSON 형식으로 클라이언트에 응답합니다.
        res.json(coordinates);
    });
});
// 서버 시작
app.listen(port, () => {
    console.log(`캐릭터 관리 서버가 http://localhost:${port} 에서 실행 중입니다.`);

});