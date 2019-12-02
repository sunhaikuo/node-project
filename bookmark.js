var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '148.70.127.53',
  user: 'root',
  password: 'Luo3066590',
  database: 'sunhk_db'
});


connection.connect();

function selectBookmarks() {

  return new Promise((resolve, reject) => {
    connection.query('SELECT * from chrome_bookmark', function (error, results, fields) {
      if (error) throw error;
      resolve(results)
      console.log('查询出的数据行数: ', results.length);
    });
  })

}

function insertBookmarks(title, url) {
  return new Promise((resole, reject) => {
    connection.query('INSERT INTO chrome_bookmark(title, url) VALUE (?, ?)', [title, url], (err, results) => {
      if (err) {
        console.log('插入出错', err);
        reject(false)
        throw error;
      }
      console.log('插入成功！')
      resole(true)
    })
  })
}

function deleteBookmark(id) {
  return new Promise((resole, reject) => {
    connection.query('delete from  chrome_bookmark where id = ' + id, (err, results) => {
      if (err) {
        console.log('删除出错', err);
        reject(false)
        throw error;
      }
      console.log('删除成功！')
      resole(true)
    })
  })
}

module.exports = {
  selectBookmarks,
  deleteBookmark,
  insertBookmarks
}