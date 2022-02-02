export { }
const express = require('express');
const router = express.Router()

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: '82.157.162.70',
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
        throw Error('插入出错');
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
        throw Error('删除出错');
      }
      console.log('删除成功！')
      resole(true)
    })
  })
}

router.get('/', async (req, res) => {
  const bookmarks = await selectBookmarks()
  res.send(bookmarks)
})

router.post('/', async (req, res) => {
  const { title, url } = req.body
  const result = await insertBookmarks(title, url)
  res.send(result)
})

router.delete('/', async (req, res) => {
  const { id } = req.query
  const result = await deleteBookmark(id)
  res.send(result)
})

module.exports = router