"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
// 静态资源
app.use('/static', express.static('static'));
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
app.use('/api/git', require('./router/git'));
app.use('/api/hospital', require('./router/hospital'));
app.use('/api/bookmark', require('./router/bookmark'));
app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});
