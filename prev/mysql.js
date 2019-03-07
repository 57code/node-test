const mysql = require("mysql");
// co-mysql
const cfg = {
  host: "localhost",
  user: "root",
  password: "admin",
  database: "test"
};

// 封装
function query(conn, sql, param = null) {
  return new Promise((resolve, reject) => {
    conn.query(sql, param, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// 创建连接对象
const conn = mysql.createConnection(cfg);

// 连接数据库
const CREATE_SQL = `CREATE TABLE IF NOT EXISTS test (
    id INT NOT NULL AUTO_INCREMENT,
    message VARCHAR(45) NULL,
    PRIMARY KEY (id))`;
const INSERT_SQL = `INSERT INTO test(message) VALUES(?)`;
const SELECT_SQL = `SELECT * FROM test`;
conn.connect(err => {
  if (err) {
    throw err;
  }
  console.log("连接成功");
  // 1.创建表
  conn.query(CREATE_SQL, err => {
    // 2.插入数据
    const sql = mysql.format(INSERT_SQL, "hello")
    console.log(sql);
    
    conn.query(sql, (err, result) => {
      console.log(result);

      // 3.查询
      conn.query(SELECT_SQL, (err, results) => {
        console.log(results);
        conn.end();
      });
    });
  });

  query(conn, SELECT_SQL)
    .then(results => console.log(results))
    .catch(err => console.log(err));
});
