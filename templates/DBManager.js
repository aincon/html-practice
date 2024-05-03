const mysql = require('mysql');


class DBManager {

  constructor() {

    // MySQL 서버 연결 정보
    this.connection = mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root', // 사용자 이름 입력
      // password: '', // 패스워드가 없음
      database: 'trpg_main_db'
    });
      console.log('DBManager 연결 성공');
  }

  selectData(callback) {
    // 데이터 가져오기
    this.connection.query('SELECT * FROM userinfo', (error, results, fields) => {
      if (error) {
        console.error('쿼리 실행 실패:', error.stack);
        return;
      }
      console.log('데이터:', results);
      if(callback) callback(results);
    });
  }

  insertData(data, callback) {
    // 데이터 삽입
    const query = `INSERT INTO userinfo (user_nm, user_id, user_pw) VALUES ('${data.username}', '${data.id}', '${data.password}')`;
    this.connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('쿼리 실행 실패:', error.stack);
            return;
        }
        console.log('쿼리 실행 결과:', results);
        if(callback) callback(results);
    });
  } 

  updateData(id, title, callback) {
    // 데이터 업데이트
    const query = `UPDATE userinfo SET title = '${title}' WHERE id = ${id}`;
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('쿼리 실행 실패:', error.stack);
        return;
      }
      console.log('쿼리 실행 결과:', results);
      if(callback) callback(results);
    });
  }
  // 연결 종료
  closeConnection() {
    this.connection.end((err) => {
      if (err) {
        console.error('DB 연결 종료 실패:', err.stack);
        return;
      }
      console.log('DB 연결 종료 성공');
    });
  }
  checkLogin(userData, callback) {
    // 주어진 ID와 비밀번호를 가진 사용자가 있는지 확인하는 쿼리 실행
    const query = `SELECT * FROM userinfo WHERE user_id = '${userData.id}' AND user_pw = '${userData.password}'`;
    this.connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('쿼리 실행 실패:', error.stack);
            callback(false); // 쿼리 실행 중 오류 발생 시 로그인 실패
            return;
        }

        // 결과가 있는지 확인하여 로그인 성공 여부를 콜백으로 전달
        if (results.length > 0) {
            callback(true); // 사용자가 발견되면 로그인 성공
        } else {
            callback(false); // 사용자가 발견되지 않으면 로그인 실패
        }
    });
  }
  getUserId(callback) {
    // 데이터베이스에서 사용자 NM 가져오는 쿼리 실행
    const query = "SELECT user_nm FROM userinfo LIMIT 1"; // 예시 쿼리, 사용자 테이블에 따라 쿼리가 달라질 수 있음
    this.connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('쿼리 실행 실패:', error.stack);
            callback(null); // 오류가 발생하면 null을 콜백으로 전달
            return;
        }

        // 결과에서 사용자 NM 추출
        const userNM = results[0].user_nm; // 예시 결과에서 사용자 NM를 가져옴

        // 콜백으로 사용자 NM 전달
        callback(userNM);
    });
  }
}


module.exports = DBManager;