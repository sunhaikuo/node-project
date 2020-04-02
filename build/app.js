var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var request = require("request");
var express = require('express');
const fs = require('fs');
const path = require('path');
const bookmark = require('./bookmark');
var bodyParser = require("body-parser");
const { execSync } = require('child_process');
var app = express();
// var getNum = require('./number')
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/weibo', require('./router/weibo'));
app.get('/api/git', (req, res) => {
    syncGit();
    res.send('ok - g3');
});
app.post('/api/git', (req, res) => {
    syncGit();
    res.send('ok - p1');
});
function syncGit() {
    execSync(`
            git reset HEAD --hard;
            git clean -fd;
            git pull --force;
            pm2 restart all;
            `, { cwd: __dirname });
    execSync(`
            cd /home/ubuntu/GitHub/flutter/flutter_weibo;
            git reset HEAD --hard;git clean -fd;
            git pull --force;
            cp -r /home/ubuntu/GitHub/flutter/flutter_weibo/build/web /var/www/html;
          `, { cwd: __dirname });
}
app.get('/api/bookmark', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const bookmarks = yield bookmark.selectBookmarks();
    res.send(bookmarks);
}));
app.post('/api/bookmark', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { title, url } = req.body;
    const result = yield bookmark.insertBookmarks(title, url);
    res.send(result);
}));
app.delete('/api/bookmark', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { id } = req.query;
    const result = yield bookmark.deleteBookmark(id);
    res.send(result);
}));
app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
    // getNum()
});
