const axios = require('axios')
const send = require('./sendEmail')
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
    const list = res.data
    list.forEach((item) => {
      if (item.week == '四' && item.pm_info == '约满') {
        console.log(item.pm_info)
        send()
      }
    })
    // console.log(res.data)
  })
}

module.exports = function getNum(params) {
  setInterval(getData, 1000 * 60)
}

