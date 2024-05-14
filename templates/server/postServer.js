// 서버 측 API (예: Node.js + Express)
const express = require('express');
const cors = require('cors');
const postDBManager = require('../DBMS/postDBManager'); // 이전에 만든 데이터베이스 관리자 클래스
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const dbManager = new postDBManager();
// body-parser 미들웨어 사용
app.use(bodyParser.json());
app.use(cors());

// 모든 게시물 가져오기 API
app.get('/api/posts', (req, res) => {
  dbManager.getAllPosts((posts) => {
    console.log(posts);
    res.json(posts);
  });
});
// 새로운 게시물 추가하기 API
app.post('/api/posts', (req, res) => {
    const { title, contents, user_nm, post_id } = req.body;
    if (!title || !contents) {
      res.status(400).json({ error: '제목과 내용은 필수 입력 항목입니다.' });
    } else {
      dbManager.insertPost(title, contents, user_nm, post_id);
      res.status(201).json({ message: '게시물이 성공적으로 추가되었습니다.' });
    }
  });

// 게시물 수 가져오기
app.get('/api/countPost', (req, res) => {
  dbManager.countPost((err, count) => {
      if (err) {
          console.error('Error fetching post count:', err);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.status(200).json({ count });
      }
  });
});

// DELETE 엔드포인트 정의
app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id; // req.params.post_id 대신 req.params.id를 사용
  dbManager.deletePost(postId, (err, result) => {
    if (err) {
      console.error('Error deleting post:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log(`게시물 ID ${postId}가 삭제되었습니다.`);
      res.status(200).json({ message: `게시물 ID ${postId}가 삭제되었습니다.` });
    }
  });
});
app.listen(port, () => {
  console.log(`게시글 관리 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});