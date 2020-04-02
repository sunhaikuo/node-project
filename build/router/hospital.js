const axios = require('axios');
const send = require('./sendEmail');
/**
 * 阜外医院预约
 */
function getData() {
    axios.request({
        url: 'http://app.fuwaihospital.org:8181/OpAppt/DoctorNew',
        method: 'POST',
        headers: {
            'Cookie': 'ASP.NET_SessionId=4x50jqa2b0zvzkupvi2ls1lg; ASP.NET_SessionId_NS_Sig=oenCV6mdnXYlvAnt',
            'FW-Push-Token': 'c5ca672f4dddedbb2edefc378e2d066b4627532e6d55c8aab178106aa4d422d0'
        },
        params: { "doctorCode": "2131", "halfday": true }
    }).then((res) => {
        const list = res.data;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (['约满', '', '停诊'].indexOf(item.pm_info) === -1) {
                send(item.pm_info);
                break;
            }
        }
    });
}
module.exports = function getNum(params) {
    setInterval(getData, 1000 * 60);
};
