export { }
const express = require('express');
const request = require("request");
const fs = require('fs-extra')
const path = require('path')
import { createParam } from '../utils/weibo'
import { url } from 'inspector';

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

function getUrls(type?: 'comments' | 'list' | 'channel' | 'hotSearch' | 'search') {
  const urls = [
    `https://api.weibo.cn/2/comments/build_comments${createParam()}&is_show_bulletin=2`,
    `https://api.weibo.cn/2/statuses/unread_hot_timeline${createParam()}`,
    `https://api.weibo.cn/2/groups/allgroups${createParam()}&fetch_hot=1`,
    `https://api.weibo.cn/2/page${createParam()}&containerid=106003type%253D25%2526t%253D3%2526disable_hot%253D1%2526filter_type%253Drealtimehot`,
    `https://api.weibo.cn/2/searchall${createParam()}`
  ]

  console.log(urls.join('\n'))

  if (type === 'comments') {
    return urls[0]
  } else if (type === 'list') {
    return urls[1]
  } else if (type === 'channel') {
    return urls[2]
  } else if (type === 'hotSearch') {
    return urls[3]
  } else if (type === 'search') {
    return urls[4]
  } else {
    return urls
  }
}

function getComments(mid) {
  const url = `${getUrls('comments') + '&mid=' + mid + '&id=' + mid}`
  return new Promise((resolve, reject) => {
    request.get(getParam(url), function (error, response, body) {
      // console.log(url, body)
      resolve(JSON.parse(body))
    });
  })
}
function getWeiboList(fid, containerid, max_id) {
  const url = getUrls('list')
  const param = getParam(url, fid, containerid, max_id)
  console.log(param)
  return new Promise((resolve, reject) => {
    request.post(param, function (error, response, body) {
      // console.log(url, body)
      resolve(JSON.parse(body))
    });
  })
}

function getChannel() {
  const url = `${getUrls('channel')}`
  return new Promise((resolve, reject) => {
    request.get(getParam(url), function (error, response, body) {
      // console.log(url, body)
      resolve(JSON.parse(body))
    });
  })
}

function getHotSearch() {
  const url = getUrls('hotSearch');
  return new Promise((resolve, reject) => {
    request.get(getParam(url), function (error, response, body) {
      // console.log(url, body)
      resolve(JSON.parse(body))
    });
  })
}

function getSearch(q) {
  const url = getUrls('search') + `&containerid=${encodeURIComponent(`100103type=1&t=3&q=#${q}#`)}`;
  return new Promise((resolve, reject) => {
    request.get(getParam(url), function (error, response, body) {
      // console.log(url)
      resolve(JSON.parse(body))
    });
  })
}


function getHotVideo() {
  const url = 'https://api.weibo.cn/2/cardlist?gsid=_2A25zWNWKDeRxGeBO41oT9SbLyD6IHXVuTG5CrDV6PUJbkdAKLWHEkWpNRbgUgmxiE1ItdyGMjr7kjnCp1ZBRnozs&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=10A2293010&b=0&c=iphone&networktype=wifi&skin=default&v_p=81&v_f=1&s=6091e88b&sensors_device_id=0A3D4E51-89B6-465D-9C31-2A1301EBD21D&lang=zh_CN&sflag=1&ua=iPhone8,1__weibo__10.2.2__iphone__os12.4&ft=0&aid=01AylOcmGTpYv4mLLh2Lb0ibHWogzZWpF5xMfSOxWrEckgXwo.&orifid=0%24%24231643_888&count=20&luicode=10000838&containerid=231643_9_4418213501411061&fid=231643_9_4418213501411061&uicode=10000011&st_bottom_bar_new_style_enable=0&feed_mypage_card_remould_enable=1&need_head_cards=1&need_new_pop=1&page=1&client_key=75e2c9bcd65d13ac61c877ddaa458060&lfid=231643_888&moduleID=pagecard&oriuicode=0_10000838&launchid=10000365--x';
  return new Promise((resolve, reject) => {
    request.get(getParam(url), function (error, response, body) {
      // console.log(url, body)
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

router.get('/urls', async (req, res) => {
  // http://127.0.0.1:5000/api/weibo/urls
  res.send({
    urls: getUrls()
  })
})

router.get('/hot_search', async (req, res) => {
  // http://127.0.0.1:5000/api/weibo/hot_search
  const body = await getHotSearch()
  res.send(body)
})

router.get('/search', async (req, res) => {
  // http://127.0.0.1:5000/api/weibo/search
  const { q } = req.query
  const body = await getSearch(q)
  res.send(body)
})

router.get('/hot_video', async (req, res) => {
  // http://127.0.0.1:5000/api/weibo/hot_video
  const body = await getHotVideo()
  res.send(body)
})

router.get('/timeout3', async (req, res) => {
  setTimeout(() => {
    res.send({ ok: 1 })
  }, 3 * 1000)
})

router.get('/image', async (req, res) => {
  const { url } = req.query
  if (url) {
    const index = url.lastIndexOf('.')
    const ext = url.substr(index + 1)
    const readStream = request.get({ url, timeout: 30000 })
    const filename = Date.now()
    const imageUrl = path.resolve(__dirname, '../', 'images')
    fs.ensureDir(imageUrl, err => {
      const filePath = path.resolve(`${imageUrl}/${filename}.${ext}`)
      const writeStream = fs.createWriteStream(filePath);
      readStream.pipe(writeStream);
      writeStream.on('finish', function () {
        writeStream.end();
        res.setHeader("Content-Type", `image/${ext}`)
        res.sendFile(filePath, () => {
          setTimeout(() => {
            fs.unlink(filePath, () => { })
          }, 10 * 60 * 1000)
        })
      });
    })

  }
})

module.exports = router