const mysql = require('mysql');

class postDBManager {

    constructor() {
        // MySQL 서버 연결 정보
        this.connection = mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root', // 사용자 이름 입력
            // password: '', // 패스워드가 없음
            database: 'trpg_main_db'
        });
        console.log('userDBManager 연결 성공');
    }
    // 게시물 삽입
    insertPost(title, contents, user_nm, post_id) {
        const sql = `INSERT INTO post (title, contents, user_nm, post_id) VALUES (?, ?, ?, ?)`;
        const values = [title, contents, user_nm, post_id];

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log('게시물이 성공적으로 삽입되었습니다.');
        });
    }

    // 모든 게시물 조회
    getAllPosts(callback) {
        const sql = `SELECT * FROM post`;
        this.connection.query(sql, (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }

    // 게시물 삭제
    deletePost(id) {
        const sql = `DELETE FROM post WHERE post_id = ?`;
        this.connection.query(sql, id, (err, result) => {
            if (err) throw err;
            console.log(`ID가 ${id}인 게시물이 삭제되었습니다.`);
        });
    }
    
    countPost(callback) {
        const sql = `SELECT COUNT(*) AS total_rows FROM post`;
        this.connection.query(sql, (err, result) => {
            if (err) {
                callback(err, null); // 에러가 있을 경우 콜백에 에러를 전달하고 결과는 null
            } else {
                const totalRows = result[0].total_rows; // 결과에서 total_rows 값을 추출
                callback(null, totalRows); // 결과를 콜백에 전달
            }
        });
    }

}


module.exports = postDBManager;