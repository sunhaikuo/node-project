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
const axios = require('axios');
const express = require('express');
const router = express.Router();
const email = require('./email');
/**
 * 阜外医院预约 - 吴瑛
 */
function getWuying() {
    return new Promise((resolve) => {
        axios.request({
            url: 'http://app.fuwaihospital.org:8181/OpAppt/DoctorNew',
            method: 'POST',
            params: { "doctorCode": "2131", "halfday": true }
        }).then((res) => {
            resolve(res.data);
        });
    });
}
router.get('/wuying', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/hospital/wuying
    const body = yield getWuying();
    res.send(body);
}));
let open = true;
let inter;
let preDate = '';
function guahao() {
    if (!open) {
        return;
    }
    inter = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        console.log(new Date, '检查中...');
        yield checkData();
    }), 10 * 1000);
}
guahao();
router.get('/close', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/hospital/close
    open = false;
    res.send('Open false');
}));
function checkData() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            let data = yield getWuying();
            let canHandleArr = [];
            if (data && Array.isArray(data)) {
                canHandleArr = data.filter((item) => {
                    return item['pm_info'] === '立即预约';
                });
            }
            if (canHandleArr && canHandleArr.length > 0) {
                const lastDate = canHandleArr[canHandleArr.length - 1].date;
                if (lastDate != preDate) {
                    preDate = lastDate;
                    console.log(lastDate + '有号了');
                    email('吴大夫有号了！' + lastDate);
                    reslove(lastDate);
                }
            }
        }));
    });
}
module.exports = router;
