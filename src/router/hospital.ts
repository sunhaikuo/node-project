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

let open = true
let inter
let preDate = '';

function guahao() {
  if (!open) {
    return
  }
  inter = setInterval(async () => {
    console.log(new Date, '检查中...')
    await checkData()
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


