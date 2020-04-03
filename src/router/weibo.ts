export { }
const express = require('express');
const request = require("request");
const fs = require('fs')
const path = require('path')
import { createParam } from '../utils/weibo'

const router = express.Router()

function getParam(url, fid?, containerid?, max_id?) {
  fid = fid || '102803_ctg1_600059_-_ctg1_600059'
  containerid = containerid || '102803_ctg1_600059_-_ctg1_600059'
  max_id = max_id || 0
  return {
    url,
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: `refresh=init&group_id=102803600059&show_toplist=1&extparam=discover%7Cnew_feed&fid=${fid}&uicode=10000495&count=25&trim_level=1&trim_page_recom=0&containerid=${containerid}&fromlog=102803600059&uid=6088258732&orifid=&refresh_sourceid=10000365&featurecode=10000001&preAdInterval=-1&oriuicode=&daily_total_times=5&since_id=0&need_jump_scheme=1&${max_id == '0' ? '' : `max_id=${max_id}`}`
  }
}

function getComments(mid) {
  const url = `https://api.weibo.cn/2/comments/build_comments${createParam() + '&mid=' + mid + '&id=' + mid + '&is_show_bulletin=2'}`
  console.log('url', url)
  return new Promise((resolve, reject) => {
    request.get(getParam(url), function (error, response, body) {
      resolve(JSON.parse(body))
    });
  })
}
function getWeiboList(fid, containerid, max_id) {
  const url = `https://api.weibo.cn/2/statuses/unread_hot_timeline${createParam()}`;
  const param = getParam(url, fid, containerid, max_id)
  console.log(param)
  return new Promise((resolve, reject) => {
    request.post(param, function (error, response, body) {
      resolve(JSON.parse(body))
    });
  })
}

function getChannel() {
  const url = `https://api.weibo.cn/2/groups/allgroups${createParam() + '&fetch_hot=1'}`
  return new Promise((resolve, reject) => {
    request.get(getParam(url), function (error, response, body) {
      resolve(JSON.parse(body))
    });
  })
}

/**
 * 获取列表
 */
router.get('/list', async (req, res) => {
  // http://127.0.0.1:5000/api/weibo/list?fid=102803_ctg1_600059_-_ctg1_600059&containerid=102803_ctg1_600059_-_ctg1_600059&max_id=1
  const { fid, containerid, max_id } = req.query
  if (fid == null || containerid == null || max_id == null) {
    res.send('Node - 返回参数个数不正确！')
    return
  }
  const body = await getWeiboList(fid, containerid, max_id)
  res.send(body)
})

/**
 * 获取频道
 */
router.get('/channel', async (req, res) => {
  // http://127.0.0.1:5000/api/weibo/channel
  const body = await getChannel()
  res.send(body)
})

/**
 * 获取评论和明细
 */
router.get('/comments', async (req, res) => {
  // http://127.0.0.1:5000/api/weibo/comments?mid=4489538971542816
  const { mid } = req.query
  const body = await getComments(mid)
  res.send(body)
})

router.get('/image', async (req, res) => {
  const { url } = req.query
  if (url) {
    const index = url.lastIndexOf('.')
    const ext = url.substr(index + 1)
    const readStream = request.get({ url, timeout: 30000 })
    const filename = Date.now()
    const filePath = path.resolve(__dirname, `images/${filename}.${ext}`)
    const writeStream = fs.createWriteStream(filePath);
    readStream.pipe(writeStream);
    writeStream.on('finish', function () {
      writeStream.end();
      res.setHeader("Content-Type", `image/${ext}`)
      res.sendFile(filePath, () => {
        setTimeout(() => {
          fs.unlink(filePath, () => { })
        }, 60 * 1000)
      })
    });
  }
})

module.exports = router