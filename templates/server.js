const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('클라이언트가 연결되었습니다.');

  ws.on('message', function incoming(message) {
    console.log('클라이언트로부터 메시지를 수신했습니다: %s', message);
    
    // 받은 메시지를 모든 클라이언트에게 전달
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

server.listen(3800, function listening() {
  console.log('서버가 5500번 포트에서 실행 중입니다.');
});