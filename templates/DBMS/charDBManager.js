const mysql = require('mysql');

class charDBManager {

    constructor() {
        // MySQL 서버 연결 정보
        this.connection = mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root', 
            password: '',
            database: 'trpg_main_db'
        });
        console.log('charDBManager 연결 성공');
    }
    // 속성 삽입
    insertChar(name_ch, stat1, a, stat2, b, stat3, c, nowX, nowY) {
        const sql = `INSERT INTO characters (name_ch, stat1, a, stat2, b, stat3, c, nowX, nowY) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [name_ch, stat1, a, stat2, b, stat3, c, nowX, nowY];

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
    updateCoordinates(x, y, name) {
        // x와 y가 모두 null이 아닌 경우에만 쿼리 실행
        if (x !== null && y !== null) {
            const sql = 'UPDATE characters SET nowX = ?, nowY = ? WHERE name_ch = ?';
            this.connection.query(sql, [x, y, name], (err, result) => {
                if (err) {
                    console.error('좌표를 업데이트하는 중 오류가 발생했습니다:', err);
                    return;
                }
                console.log('좌표가 성공적으로 업데이트되었습니다. x:', x, 'y:', y);
            });
        } else {
            console.error('유효하지 않은 좌표입니다. 업데이트를 건너뜁니다.');
        }
    }
    
    // 데이터베이스에서 캐릭터의 좌표를 가져오는 함수
    getCharacterCoordinates(name, callback) {
        const sql = 'SELECT nowX, nowY FROM characters WHERE name_ch = ?';
        connection.query(sql, [name], (err, result) => {
            if (err) {
                console.error('좌표를 조회하는 중 오류가 발생했습니다:', err);
                callback(err, null);
                return;
            }

            if (result.length === 0) {
                // 해당 이름의 캐릭터가 없을 경우
                callback(null, null);
                return;
            }

            // 좌표를 콜백 함수로 전달합니다.
            const { nowX, nowY } = result[0];
            callback(null, { x: nowX, y: nowY });
        });
    }


}


module.exports = charDBManager;