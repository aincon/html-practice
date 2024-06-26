const mysql = require('mysql');

class userDBManager {

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
      if (callback) callback(results);
    });
  }

  insertData(data, callback) {
    // 데이터 삽입
    const query = `INSERT INTO userinfo (user_nm, user_id, user_pw, unique_num) VALUES ('${data.username}', '${data.id}', '${data.password}', '${data.uniqueNum}')`;
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        return;
      }
      if (callback) callback(results);
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
      if (callback) callback(results);
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
  // 사용자 인증 메소드
  checkLogin(userData, callback) {
    const query = `SELECT * FROM userinfo WHERE user_id = ? AND user_pw = ?`;
    this.connection.query(query, [userData.id, userData.password], (err, results) => {
      if (err) {
        console.error('쿼리 실행 오류:', err);
        callback(false); // 쿼리 실행 오류 발생 시 인증 실패
      } else {
        if (results.length > 0) {
          const username = results[0].user_nm; // 결과가 있으면 사용자 이름 가져오기
          const uniqueNum = results[0].unique_num;
          callback(true, username, uniqueNum); // 사용자 인증 성공 및 사용자 이름 반환
        } else {
          callback(false); // 결과가 없으면 인증 실패
        }
      }
    });
  }
  // 데이터의 행의 개수를 가져오는 메소드
  getRowCount(callback) {
    // 데이터베이스에서 행의 개수를 가져오는 쿼리 실행
    const query = "SELECT COUNT(*) AS rowCount FROM userinfo"; // userinfo 테이블의 행의 개수를 가져오는 쿼리
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('쿼리 실행 실패:', error.stack);
        callback(null); // 오류가 발생하면 null을 콜백으로 전달
        return;
      }

      // 결과에서 행의 개수 추출
      const rowCount = results[0].rowCount; // 결과에서 행의 개수를 가져옴

      // 콜백으로 행의 개수 전달
      callback(rowCount);
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


module.exports = userDBManager;