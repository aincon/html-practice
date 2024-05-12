const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', function connection(ws) {
    // 클라이언트로부터 메시지를 받았을 때
    ws.on('message', function incoming(data) {
        // 데이터를 JSON 형식으로 파싱하여 캐릭터 이름과 메시지를 분리
        const { characterName, message } = JSON.parse(data);
        const formattedMessage = `${characterName}: ${message}`;

        // 모든 클라이언트에게 캐릭터 이름과 메시지를 함께 전송
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(formattedMessage);
            }
        });
    });
});

const PORT = process.env.PORT || 8002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});