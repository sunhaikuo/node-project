export { }
const axios = require('axios')
const express = require('express');
const router = express.Router()
const email = require('./email')
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
      resolve(res.data)
    })
  })
}


router.get('/wuying', async (req, res) => {
  // http://127.0.0.1:5000/api/hospital/wuying
  const body = await getWuying()
  res.send(body)
})


/**
 * 滴一的票
 */
function getDiyi() {
  return new Promise((resolve) => {
    axios.request({
      url: 'http://api.d1-bus.com/ticket/selDayTicket',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'd1_social_bus_uuid_api=16d8c88f-c4eb-4c87-808a-3064fb559b9b',
        'User-Agent': 'di yi ba shi/3.6.2 (iPhone; iOS 13.4.1; Scale/2.00)'
      },
      data: 'busLineID=1288&busLineTimeID=1987&dVersion=3.6.2&dVersionCode=3620&deviceID=905A4041-FC5A-49BF-8029-F68C0DEF2FA6&osType=iphone&rideStationID=16325&version=3.1.5'
    }).then((res) => {
      resolve(res.data)
    })
  })
}

router.get('/diyi', async (req, res) => {
  // http://127.0.0.1:5000/api/hospital/diyi
  const body = await getDiyi()
  console.log('body', body)
  res.send(body)
})

let open = true
let inter
let preDate = '';

function guahao() {
  if (!open) {
    return
  }
  inter = setInterval(async () => {
    console.log(new Date, '检查中...')
    // await checkData()
  }, 60 * 1000)
}

guahao()


router.get('/close', async (req, res) => {
  // http://127.0.0.1:5000/api/hospital/close
  open = false
  res.send('Open false')
})

async function checkData() {
  return new Promise(async (reslove) => {
    let data: any = await getWuying()
    let canHandleArr = []
    if (data && Array.isArray(data)) {
      canHandleArr = data.filter((item) => {
        return item['pm_info'] === '立即预约'
      })
    }
    if (canHandleArr && canHandleArr.length > 0) {
      const lastDate = canHandleArr[canHandleArr.length - 1].date
      if (lastDate != preDate) {
        preDate = lastDate
        console.log(lastDate + '有号了')
        email('吴大夫有号了！' + lastDate)
        reslove(lastDate)
      }
    }
  })
}


module.exports = router


