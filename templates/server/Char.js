const express = require('express');
const bodyParser = require('body-parser');
const db = require('../Game/charDB'); // 데이터베이스 모듈 불러오기

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 클라이언트로부터의 요청 처리
app.post('/submit', async (req, res) => {
    try {
        const { username, str, intelligence, appearance } = req.body;
        // 데이터베이스에 데이터 삽입
        await db.insertCharacter(username, str, intelligence, appearance);
        res.send('Character created successfully!');
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).send('Error creating character');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
