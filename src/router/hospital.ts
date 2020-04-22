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

let open = false
let inter
let cnt = 0

router.get('/open', async (req, res) => {
  // http://127.0.0.1:5000/api/hospital/open
  if (open == false) {
    open = true
    inter = setInterval(async () => {
      const res = await checkData()
      if (res) {
        cnt++
        if (cnt > 2) {
          open = false
          clearInterval(inter)
        }
      }
    }, 60 * 1000)
  }
  res.send('Open')
})

async function checkData() {
  return new Promise(async (reslove) => {
    let data: any = await getWuying()
    data = JSON.stringify(data)
    // if (data && data.indexOf('立即预约') > -1) {
      if (data && data.indexOf('约满') > -1) {
      email('吴大夫有号了！')
      reslove(true)
    }
    reslove(false)
  })
}


module.exports = router


