"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
function selectBookmarks() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * from chrome_bookmark_py order by tm desc', function (error, results, fields) {
            if (error)
                throw error;
            resolve(results);
            console.log('查询出的数据行数: ', results.length);
        });
    });
}
function selectBookmarkByUrl(url) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * from chrome_bookmark_py where url = ?', [url], function (error, results, fields) {
            if (error)
                throw error;
            resolve(results);
            console.log('查询出的数据行数: ', results.length);
        });
    });
}
function insertBookmarks(title, url, isFavi, tm) {
    const pyList = pinyin(title, {
        style: pinyin.STYLE_INITIALS,
    });
    const noramlList = pinyin(title, {
        style: pinyin.STYLE_NORMAL,
    });
    console.log('insertBookmarks', arguments, pyList.join(','), noramlList.join(','));
    return new Promise((resole, reject) => {
        connection.query('INSERT INTO chrome_bookmark_py(title, url, pinyin, isFavi, tm) VALUE (?, ?, ?, ?, ?)', [title, url, pyList.join('') + '-' + noramlList.join(''), isFavi, tm], (err, results) => {
            if (err) {
                console.log('插入出错', err);
                reject(false);
                throw Error('插入出错');
            }
            console.log('插入成功！');
            resole(true);
        });
    });
}
function deleteBookmark(url) {
    return new Promise((resole, reject) => {
        connection.query('delete from  chrome_bookmark_py where url = ?', [url], (err, results) => {
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
router.post('/modify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, url, isFavi } = req.body;
    const bookmark = yield selectBookmarkByUrl(url);
    yield deleteBookmark(url);
    const result = yield insertBookmarks(title, url, isFavi !== null && isFavi !== void 0 ? isFavi : bookmark.isFavi, bookmark.tm);
    res.send(result);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield selectBookmarks();
    res.send(result);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, url, isFavi } = req.body;
    const bookmark = yield selectBookmarkByUrl(url);
    const tm = Date.now();
    console.log('query bookmark', bookmark);
    yield deleteBookmark(url);
    console.log('insertBookmarks', title, url, isFavi, tm);
    const result = yield insertBookmarks(title, url, isFavi !== null && isFavi !== void 0 ? isFavi : 0, tm);
    res.send(result);
}));
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    console.log('deleteBookmark', url);
    const result = yield deleteBookmark(url);
    res.send(result);
}));
module.exports = router;
