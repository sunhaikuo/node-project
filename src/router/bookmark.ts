export {};
const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const pinyin = require('pinyin');
const connection = mysql.createConnection({
    host: '82.157.162.70',
    user: 'root',
    password: 'Luo3066590',
    database: 'sunhk_db',
});

connection.connect();

interface IBookmark {
    id: number;
    title: string;
    url: string;
    isFavi: number;
    tm: number;
}

function selectBookmarks() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * from chrome_bookmark_py order by tm desc', function (error, results, fields) {
            if (error) throw error;
            resolve(results);
            console.log('查询出的数据行数: ', results.length);
        });
    });
}

function selectBookmarkByUrl(url: string): Promise<IBookmark> {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * from chrome_bookmark_py where url = ?', [url], function (error, results, fields) {
            if (error) throw error;
            resolve(results);

            console.log('查询出的数据行数: ', results.length);
        });
    });
}

function insertBookmarks(title, url, isFavi, tm) {
    const pyList = pinyin(title, {
        style: pinyin.STYLE_INITIALS, // 设置拼音风格
    });

    const noramlList = pinyin(title, {
        style: pinyin.STYLE_NORMAL, // 设置拼音风格
    });

    console.log('insertBookmarks', arguments, pyList.join(','), noramlList.join(','));

    return new Promise((resole, reject) => {
        connection.query(
            'INSERT INTO chrome_bookmark_py(title, url, pinyin, isFavi, tm) VALUE (?, ?, ?, ?, ?)',
            [title, url, pyList.join('') + '-' + noramlList.join(''), isFavi, tm],
            (err, results) => {
                if (err) {
                    console.log('插入出错', err);
                    reject(false);
                    throw Error('插入出错');
                }
                console.log('插入成功！');
                resole(true);
            },
        );
    });
}

function deleteBookmark(url) {
    return new Promise((resole, reject) => {
        connection.query('delete from chrome_bookmark_py where url = ?', [url], (err, results) => {
            if (err) {
                console.log('删除出错', err);
                reject(false);
                throw Error('删除出错');
            }
            console.log('删除成功！');
            resole(true);
        });
    });
}

function deleteBookmarkById(id) {
    return new Promise((resole, reject) => {
        connection.query('delete from chrome_bookmark_py where id = ?', [id], (err, results) => {
            if (err) {
                console.log('删除出错', err);
                reject(false);
                throw Error('删除出错');
            }
            console.log('删除成功！');
            resole(true);
        });
    });
}

function updateBookmark(id, isFavi) {
    return new Promise((resole, reject) => {
        connection.query('update chrome_bookmark_py SET isFavi = ?, tm = ? where id = ?', [isFavi, Date.now(), id], (err, results) => {
            if (err) {
                console.log('修改出错', err);
                reject(false);
                throw Error('修改出错');
            }
            console.log('修改成功！');
            resole(true);
        });
    });
}

router.post('/modifyFavi', async (req, res) => {
    const { id, isFavi } = req.body;
    const result = await updateBookmark(id, isFavi);
    res.send(result);
});

router.get('/', async (req, res) => {
    const result = await selectBookmarks();
    res.send(result);
});

router.post('/', async (req, res) => {
    const { title, url, isFavi } = req.body;
    const bookmark = await selectBookmarkByUrl(url);
    const tm = Date.now();
    console.log('query bookmark', bookmark);
    await deleteBookmark(url);
    console.log('insertBookmarks', title, url, isFavi, tm);
    const result = await insertBookmarks(title, url, isFavi ?? 0, tm);
    res.send(result);
});

router.delete('/', async (req, res) => {
    const { id } = req.query;
    console.log('deleteBookmark', id);
    const result = await deleteBookmarkById(id);
    res.send(result);
});

module.exports = router;
