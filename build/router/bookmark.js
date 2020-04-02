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
const connection = mysql.createConnection({
    host: '148.70.127.53',
    user: 'root',
    password: 'Luo3066590',
    database: 'sunhk_db'
});
connection.connect();
function selectBookmarks() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * from chrome_bookmark', function (error, results, fields) {
            if (error)
                throw error;
            resolve(results);
            console.log('查询出的数据行数: ', results.length);
        });
    });
}
function insertBookmarks(title, url) {
    return new Promise((resole, reject) => {
        connection.query('INSERT INTO chrome_bookmark(title, url) VALUE (?, ?)', [title, url], (err, results) => {
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
function deleteBookmark(id) {
    return new Promise((resole, reject) => {
        connection.query('delete from  chrome_bookmark where id = ' + id, (err, results) => {
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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmarks = yield selectBookmarks();
    res.send(bookmarks);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, url } = req.body;
    const result = yield insertBookmarks(title, url);
    res.send(result);
}));
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const result = yield deleteBookmark(id);
    res.send(result);
}));
module.exports = router;
