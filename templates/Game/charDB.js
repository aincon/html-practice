const mysql = require('mysql');

class CharDB {
    constructor() {
        this.connection = mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            
            password: '',
            database: 'trpg_main_db'
        });
        console.log('DBManager 연결 성공');
    }

    insertCharacter(username, str, intelligence, appearance) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO characters (username, str, intelligence, appearance) VALUES (?, ?, ?, ?)`;
            this.connection.query(query, [username, str, intelligence, appearance], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = CharDB;
