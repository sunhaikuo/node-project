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
let open = false;
let inter;
let cnt = 0;
router.get('/open', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://127.0.0.1:5000/api/hospital/open
    if (open == false) {
        open = true;
        inter = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield checkData();
            if (res) {
                cnt++;
                if (cnt > 2) {
                    open = false;
                    clearInterval(inter);
                }
            }
        }), 60 * 1000);
    }
    res.send('Open');
}));
function checkData() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((reslove) => __awaiter(this, void 0, void 0, function* () {
            let data = yield getWuying();
            data = JSON.stringify(data);
            if (data && data.indexOf('立即预约') > -1) {
                email('吴大夫有号了！');
                reslove(true);
            }
            reslove(false);
        }));
    });
}
module.exports = router;
