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
function getUrlVars(url) {
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}
const router = express.Router();
const tokenParamArr = [];
tokenParamArr.push('?gsid=_2A25zgf3CDeRxGeBO41oT9SbLyD6IHXVuF3YKrDV6PUJbkdAKLWHEkWpNRbgUglBKbnJKn0j01XWvqabFpG6QrBDx');
tokenParamArr.push('&from=10A3193010');
tokenParamArr.push('&c=iphone');
tokenParamArr.push('&s=8b370efb');
const urlArr = [
    'https://api.weibo.cn/2/statuses/unread_hot_timeline?gsid=_2A25zguMTDeRxGeBG4lYV9SzNzjuIHXVuFnHbrDV6PUJbj9ANLXj8kWpNQfZvHWj18ikmF4z2M_R158Bner_8BHQv&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=10A3293010&sensors_device_id=019C6138-8C3E-462B-88CD-989677587E12&c=iphone&v_p=82&skin=default&s=8e344a45&v_f=1&networktype=wifi&b=0&lang=zh_CN&ua=iPhone12,5__weibo__10.3.2__iphone__os13.4&sflag=1&ft=1&aid=01AwC-VV0DeGEGMYFR4m_R9GzRErk_SEy-Q3NRyBluSBrnkIQ.&launchid=default',
];
urlArr.forEach((url) => {
    const { gsid, from, c, s } = getUrlVars(url);
    console.log(gsid, from, c, s);
});
function getParam(url, fid, containerid, max_id) {
    url = url.replace(/[\r\n]/g, '').replace('\ +', '');
    fid = fid || '102803_ctg1_600059_-_ctg1_600059';
    containerid = containerid || '102803_ctg1_600059_-_ctg1_600059';
    max_id = max_id || 0;
    return {
        url,
        // json: true,
        headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        body: `refresh=init&group_id=102803600059&show_toplist=1&extparam=discover%7Cnew_feed&fid=${fid}&uicode=10000495&count=25&trim_level=1&trim_page_recom=0&containerid=${containerid}&fromlog=102803600059&uid=6088258732&orifid=&refresh_sourceid=10000365&featurecode=10000001&preAdInterval=-1&oriuicode=&daily_total_times=5&since_id=0&need_jump_scheme=1&${max_id == '0' ? '' : `max_id=${max_id}`}`
    };
}
function getContent(sid) {
    const url = `https://api.weibo.cn/2/comments/build_comments?gsid=_2A25zIHWoDeRxGeBO41oT9SbLyD6IHXVudI5grDV6PUJbkdAKLWHEkWpNRbgUgndNH9DarSWJbDun67K11e0cMDNf&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=10A1193010&b=0&c=iphone&networktype=wifi&skin=default&v_p=81&v_f=1&s=be08ec41&sensors_device_id=0A3D4E51-89B6-465D-9C31-2A1301EBD21D&lang=zh_CN&sflag=1&ua=iPhone8,1__weibo__10.1.1__iphone__os12.4&ft=0&aid=01AylOcmGTpYv4mLLh2Lb0ibHWogzZWpF5xMfSOxWrEckgXwo.&is_reload=1&is_append_blogs=1&mid=4462461660985878&refresh_type=1&uicode=10000002&count=20&trim_level=1&moduleID=feed&is_show_bulletin=2&sourcetype=feed&fetch_level=0&fromlog=100016088258732&id=${sid}&lack=0&luicode=10000001&request_type=default&orifid=100016088258732&featurecode=10000001&oriuicode=10000001&since_id=0&is_mix=1&page=0&lfid=100016088258732&rid=10_0_8_3079867146144091573_1_0_0&launchid=10000365--x`;
    return new Promise((resolve, reject) => {
        request.get(getParam(url), function (error, response, body) {
            resolve(JSON.parse(body));
        });
    });
}
function getComments(mid) {
    const url = `https://api.weibo.cn/2/comments/build_comments?gsid=_2A25zE5RbDeRxGeBO41oT9SbLyD6IHXVRiKCTrDV6PUJbkdAKLVb9kWpNRbgUgl7f32cqAHaC1Ls0X9PeVl1MirD5&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=10A1293010&b=0&c=iphone&networktype=wifi&skin=default&v_p=81&v_f=1&s=f6774209&sensors_device_id=F30F16C3-C2DD-483D-B4EE-BB9FF831E70A&lang=zh_CN&sflag=1&ua=iPhone12,5__weibo__10.1.2__iphone__os13.3&ft=0&aid=01A-GfF8-NJ3WvuRJbTQEgz8EUewecnx5I6QOKMPmHIts8nh8.&is_reload=1&is_append_blogs=1&mid=${mid}&refresh_type=1&uicode=10000002&count=20&trim_level=1&moduleID=feed&is_show_bulletin=2&fetch_level=0&_status_id=${mid}&fromlog=102803&id=${mid}&lack=0&request_type=default&luicode=10000495&orifid=102803&featurecode=10000001&oriuicode=10000495&since_id=0&is_mix=1&page=0&lfid=102803&rid=0_0_0_3069719993828589219_0_0_0&launchid=10000365--x`;
    return new Promise((resolve, reject) => {
        request.get(getParam(url), function (error, response, body) {
            resolve(JSON.parse(body));
        });
    });
}
/**
 * 获取列表
 * @param {} fid
 * @param {*} containerid
 * @param {*} max_id
 */
function getWeiboList(fid, containerid, max_id) {
    const url = `https://api.weibo.cn/2/statuses/unread_hot_timeline${tokenParamArr.join('')}`;
    const param = getParam(url, fid, containerid, max_id);
    console.log(param);
    return new Promise((resolve, reject) => {
        request.post(param, function (error, response, body) {
            resolve(JSON.parse(body));
        });
    });
}
/**
 * 获取频道数据
 */
function getChannel() {
    const channelArr = [].concat(tokenParamArr);
    channelArr.push('&fetch_hot=1');
    const url = `https://api.weibo.cn/2/groups/allgroups${channelArr.join('')}`;
    return new Promise((resolve, reject) => {
        request.get(getParam(url), function (error, response, body) {
            resolve(JSON.parse(body));
        });
    });
}
router.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 测试URL=http://127.0.0.1:5000/api/weibo/list?fid=102803_ctg1_600059_-_ctg1_600059&containerid=102803_ctg1_600059_-_ctg1_600059&max_id=1
    const { fid, containerid, max_id } = req.query;
    if (fid == null || containerid == null || max_id == null) {
        res.send('Node - 返回参数个数不正确！');
        return;
    }
    const body = yield getWeiboList(fid, containerid, max_id);
    res.send(body);
}));
router.get('/channel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 测试URL：http://127.0.0.1:5000/api/weibo/channel
    const body = yield getChannel();
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
router.get('/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mid } = req.query;
    const body = yield getComments(mid);
    res.send(body);
}));
router.get('/detail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sid } = req.query;
    const body = yield getContent(sid);
    res.send(body);
}));
module.exports = router;
