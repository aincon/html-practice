const mysql = require('mysql');

class charDBManager {

    constructor() {
        // MySQL 서버 연결 정보
        this.connection = mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root', // 사용자 이름 입력
            // password: '', // 패스워드가 없음
            database: 'trpg_main_db'
        });
        console.log('charDBManager 연결 성공');
    }
    // 속성 삽입
    insertChar(name_ch, stat1, a, stat2, b, stat3, c) {
        const sql = `INSERT INTO characters (name_ch, stat1, a, stat2, b, stat3, c) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [name_ch, stat1, a, stat2, b, stat3, c];

        this.connection.query(sql, values, (err, result) => {
            if (err) throw err;
            console.log('캐릭터 등록');
        });
    }

    // 캐릭터들 정보 조회
    getAllChars(callback) {
        const sql = `SELECT * FROM characters`;
        this.connection.query(sql, (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }
    // 캐릭터 이름으로 캐릭터 정보 조회
    getCharacterByName(name, callback) {
        const sql = `SELECT * FROM characters WHERE name = ?`;
        this.connection.query(sql, [name], (err, results) => {
            if (err) throw err;
            callback(results);
        });
    }
    // 삭제
    deleteChar(name) {
        const sql = `DELETE FROM characters WHERE name_ch = ?`;
        this.connection.query(sql, name, (err, result) => {
            if (err) throw err;
            console.log(`캐릭터 삭제`);
        });
    }



}


module.exports = charDBManager;