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
const request = require("request");
const fs = require('fs');
const path = require('path');
const weibo_1 = require("../utils/weibo");
const router = express.Router();
function getParam(url, fid, containerid, max_id) {
    fid = fid || '102803_ctg1_600059_-_ctg1_600059';
    containerid = containerid || '102803_ctg1_600059_-_ctg1_600059';
    max_id = max_id || 0;
    return {
        url,
        headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: `refresh=init&group_id=102803600059&show_toplist=1&extparam=discover%7Cnew_feed&fid=${fid}&uicode=10000495&count=25&trim_level=1&trim_page_recom=0&containerid=${containerid}&fromlog=102803600059&uid=6088258732&orifid=&refresh_sourceid=10000365&featurecode=10000001&preAdInterval=-1&oriuicode=&daily_total_times=5&since_id=0&need_jump_scheme=1&${max_id == '0' ? '' : `max_id=${max_id}`}`
    };
}
function getUrls(type) {
    const urls = [
        `https://api.weibo.cn/2/comments/build_comments${weibo_1.createParam()}&is_show_bulletin=2`,
        `https://api.weibo.cn/2/statuses/unread_hot_timeline${weibo_1.createParam()}`,
        `https://api.weibo.cn/2/groups/allgroups${weibo_1.createParam()}&fetch_hot=1`,
        `https://api.weibo.cn/2/page${weibo_1.createParam()}&containerid=106003type%253D25%2526t%253D3%2526disable_hot%253D1%2526filter_type%253Drealtimehot`,
        `https://api.weibo.cn/2/searchall${weibo_1.createParam()}`
    ];
    if (type === 'comments') {
        return urls[0];
    }
    else if (type === 'list') {
        return urls[1];
    }
    else if (type === 'channel') {
        return urls[2];
    }
    else if (type === 'hotSearch') {
        return urls[3];
    }
    else if (type === 'search') {
        return urls[4];
    }
    else {
        return urls;
    }
}
function getComments(mid) {
    const url = `${getUrls('comments') + '&mid=' + mid + '&id=' + mid}`;
    return new Promise((resolve, reject) => {
        request.get(getParam(url), function (error, response, body) {
            console.log(url, body);
            resolve(JSON.parse(body));
        });
    });
}
function getWeiboList(fid, containerid, max_id) {
    const url = getUrls('list');
    const param = getParam(url, fid, containerid, max_id);
    console.log(param);
    return new Promise((resolve, reject) => {
        request.post(param, function (error, response, body) {
            console.log(url, body);
            resolve(JSON.parse(body));
        });
    });
}
function getChannel() {
    const url = `${getUrls('channel')}`;
    return new Promise((resolve, reject) => {
        request.get(getParam(url), function (error, response, body) {
            console.log(url, body);
            resolve(JSON.parse(body));
        });
    });
}
function getHotSearch() {
    const url = getUrls('hotSearch');
    return new Promise((resolve, reject) => {
        request.get(getParam(url), function (error, response, body) {
            console.log(url, body);
            resolve(JSON.parse(body));
        });
    });
}
function getSearch(q) {
    const url = getUrls('search') + `&containerid=${encodeURIComponent(`100103type=1&t=3&q=#${q}#`)}`;
    return new Promise((resolve, reject) => {
        request.get(getParam(url), function (error, response, body) {
            console.log(url);
            resolve(JSON.parse(body));
        });
    });
}
/**
 * 获取列表
 */
router.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/weibo/list?fid=102803_ctg1_600059_-_ctg1_600059&containerid=102803_ctg1_600059_-_ctg1_600059&max_id=1
    const { fid, containerid, max_id } = req.query;
    if (fid == null || containerid == null || max_id == null) {
        res.send('Node - 返回参数个数不正确！');
        return;
    }
    const body = yield getWeiboList(fid, containerid, max_id);
    res.send(body);
}));
/**
 * 获取频道
 */
router.get('/channel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/weibo/channel
    const body = yield getChannel();
    res.send(body);
}));
/**
 * 获取评论和明细
 */
router.get('/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/weibo/comments?mid=4489538971542816
    const { mid } = req.query;
    const body = yield getComments(mid);
    res.send(body);
}));
router.get('/urls', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/weibo/urls
    res.send({
        urls: getUrls()
    });
}));
router.get('/hot_search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/weibo/hot_search
    const body = yield getHotSearch();
    res.send(body);
}));
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/weibo/search
    const { q } = req.query;
    const body = yield getSearch(q);
    res.send(body);
}));
router.get('/image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    if (url) {
        const index = url.lastIndexOf('.');
        const ext = url.substr(index + 1);
        const readStream = request.get({ url, timeout: 30000 });
        const filename = Date.now();
        const filePath = path.resolve(__dirname, `images/${filename}.${ext}`);
        const writeStream = fs.createWriteStream(filePath);
        readStream.pipe(writeStream);
        writeStream.on('finish', function () {
            writeStream.end();
            res.setHeader("Content-Type", `image/${ext}`);
            res.sendFile(filePath, () => {
                setTimeout(() => {
                    fs.unlink(filePath, () => { });
                }, 60 * 1000);
            });
        });
    }
}));
module.exports = router;
