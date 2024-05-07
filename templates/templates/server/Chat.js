const express = require('express');
const session = require('express-session');
const http = require('http');
const { Server: WebSocketServer } = require('ws');

const app = express();

// Express.js 애플리케이션에 세션 미들웨어 추가
const sessionParser = session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
});
app.use(sessionParser);

// HTTP 서버 생성
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket 연결 시에 세션에서 사용자 ID 추출하여 처리
wss.on('connection', (ws, request) => {
    // 세션에서 사용자 ID 추출
    const userId = request.session.userId;

    // 연결된 모든 클라이언트에게 새로운 사용자 접속 알림
    wss.clients.forEach(client => {
        client.send(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`);
    });

    console.log(`새로운 유저 접속: ${userId}`);

    ws.on('message', data => {
        if (userId) {
            // 채팅 메시지에 사용자 ID 추가
            const messageWithUserId = `${userId}: ${data.toString()}`;

            // 연결된 모든 클라이언트에게 채팅 메시지 브로드캐스트
            wss.clients.forEach(client => {
                client.send(messageWithUserId);
            });
        }
    });

    ws.on('close', () => {
        wss.clients.forEach((client) => {
            client.send(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
        });
    });
});

server.listen(8002, () => {
    console.log('서버가 8002번 포트에서 실행 중입니다.');
});