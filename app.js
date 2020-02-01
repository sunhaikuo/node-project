var request = require("request");
var express = require('express');
const fs = require('fs')
const path = require('path')
const bookmark = require('./bookmark')
var bodyParser = require("body-parser")
const { execSync } = require('child_process')
var app = express();

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

var getNum = require('./number')
function getOption(url) {
  return {
    url,
    // json: true,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=utf-8",
    },//req.headers
    body: "extparam=discover%7Cnew_feed&fid=102803&uicode=10000495&count=25&trim_level=1&trim_page_recom=0&containerid=102803&fromlog=102803&uid=6894452157&orifid=&refresh_sourceid=10000365&featurecode=10000001&preAdInterval=2&oriuicode=&daily_total_times=9&since_id=4413935291614270&need_jump_scheme=1"
  }
}

function getWeiboList() {
  const url = 'https://api.weibo.cn/2/statuses/unread_hot_timeline?gsid=_2A25zDRKEDeRxGeBO41oT9SbLyD6IHXVRmyFMrDV6PUJbkdAKLWHEkWpNRbgUgipW6LAu9FJlfHoZrTc2Rxkz0dCG&sensors_mark=0&wm=3333_2001&sensors_is_first_day=true&from=109C393010&b=0&c=iphone&networktype=wifi&skin=default&v_p=80&v_f=1&s=7f247ef8&sensors_device_id=0A3D4E51-89B6-465D-9C31-2A1301EBD21D&lang=zh_CN&sflag=1&ua=iPhone8,1__weibo__9.12.3__iphone__os12.4&ft=0&aid=01AylOcmGTpYv4mLLh2Lb0ibHWogzZWpF5xMfSOxWrEckgXwo.&launchid=10000365--x'
  return new Promise((resolve, reject) => {
    request.post(getOption(url), function (error, response, body) {
      console.info('body: ' + body);
      resolve(JSON.parse(body))
    });
  })
}

function getContent(sid) {
  const url = `https://api.weibo.cn/2/comments/build_comments?gsid=_2A25zIHWoDeRxGeBO41oT9SbLyD6IHXVudI5grDV6PUJbkdAKLWHEkWpNRbgUgndNH9DarSWJbDun67K11e0cMDNf&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=10A1193010&b=0&c=iphone&networktype=wifi&skin=default&v_p=81&v_f=1&s=be08ec41&sensors_device_id=0A3D4E51-89B6-465D-9C31-2A1301EBD21D&lang=zh_CN&sflag=1&ua=iPhone8,1__weibo__10.1.1__iphone__os12.4&ft=0&aid=01AylOcmGTpYv4mLLh2Lb0ibHWogzZWpF5xMfSOxWrEckgXwo.&is_reload=1&is_append_blogs=1&mid=4462461660985878&refresh_type=1&uicode=10000002&count=20&trim_level=1&moduleID=feed&is_show_bulletin=2&sourcetype=feed&fetch_level=0&fromlog=100016088258732&id=${sid}&lack=0&luicode=10000001&request_type=default&orifid=100016088258732&featurecode=10000001&oriuicode=10000001&since_id=0&is_mix=1&page=0&lfid=100016088258732&rid=10_0_8_3079867146144091573_1_0_0&launchid=10000365--x`
  return new Promise((resolve, reject) => {
    request.get(getOption(url), function (error, response, body) {
      console.info('body: ' + body);
      resolve(JSON.parse(body))
    });
  })
}


function getComments(mid) {
  const url = `https://api.weibo.cn/2/comments/build_comments?gsid=_2A25zE5RbDeRxGeBO41oT9SbLyD6IHXVRiKCTrDV6PUJbkdAKLVb9kWpNRbgUgl7f32cqAHaC1Ls0X9PeVl1MirD5&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=10A1293010&b=0&c=iphone&networktype=wifi&skin=default&v_p=81&v_f=1&s=f6774209&sensors_device_id=F30F16C3-C2DD-483D-B4EE-BB9FF831E70A&lang=zh_CN&sflag=1&ua=iPhone12,5__weibo__10.1.2__iphone__os13.3&ft=0&aid=01A-GfF8-NJ3WvuRJbTQEgz8EUewecnx5I6QOKMPmHIts8nh8.&is_reload=1&is_append_blogs=1&mid=${mid}&refresh_type=1&uicode=10000002&count=20&trim_level=1&moduleID=feed&is_show_bulletin=2&fetch_level=0&_status_id=${mid}&fromlog=102803&id=${mid}&lack=0&request_type=default&luicode=10000495&orifid=102803&featurecode=10000001&oriuicode=10000495&since_id=0&is_mix=1&page=0&lfid=102803&rid=0_0_0_3069719993828589219_0_0_0&launchid=10000365--x`
  return new Promise((resolve, reject) => {
    request.get(getOption(url), function (error, response, body) {
      console.info('body: ' + body);
      resolve(JSON.parse(body))
    });
  })
}

app.get('/api', async (req, res) => {
  const body = await getWeiboList()
  res.send(body)
})

app.get('/api/image', async (req, res) => {
  const { url } = req.query
  if (url) {
    const index = url.lastIndexOf('.')
    const ext = url.substr(index + 1)
    const readStream = request.get(url)
    const filename = Date.now()
    const filePath = path.resolve(__dirname, `images/${filename}.${ext}`)
    const writeStream = fs.createWriteStream(filePath);
    readStream.pipe(writeStream);
    writeStream.on('finish', function () {
      writeStream.end();
      res.setHeader("Content-Type", `image/${ext}`)
      res.sendFile(filePath,()=> {
        fs.unlink(filePath, () => {
          console.log(`${filePath} 删除成功`)
        })
      })
    });
  }
})


app.get('/api/comments', async (req, res) => {
  const { mid } = req.query
  const body = await getComments(mid)
  res.send(body)
})

app.get('/api/detail', async (req, res) => {
  const { sid } = req.query
  const body = await getContent(sid)
  res.send(body)
})

app.get('/api/git', (req, res) => {
  syncGit()
  res.send('ok - g3')
})

app.post('/api/git', (req, res) => {
  syncGit()
  res.send('ok - p1')
})

function syncGit() {
  execSync(
            `
            git reset HEAD --hard;
            git clean -fd;
            git pull --force;
            pm2 restart all;
            `, { cwd: __dirname })
  execSync(`
            cd /home/ubuntu/GitHub/flutter/flutter_weibo;
            git reset HEAD --hard;git clean -fd;
            git pull --force;
            cp -r /home/ubuntu/GitHub/flutter/flutter_weibo/build/web /var/www/html;
          `, { cwd: __dirname })
}

app.get('/api/bookmark', async (req, res) => {
  console.log('bookmark', bookmark)
  const bookmarks = await bookmark.selectBookmarks()
  console.log('bookmarks', bookmarks)
  res.send(bookmarks)
})

app.post('/api/bookmark', async (req, res) => {
  const { title, url } = req.body
  console.log('value', title, url)
  const result = await bookmark.insertBookmarks(title, url)
  console.log('post result', result)
  res.send(result)
})

app.delete('/api/bookmark', async (req, res) => {
  const { id } = req.query
  console.log('id', id, req.query)
  const result = await bookmark.deleteBookmark(id)
  console.log('delete result', result)
  res.send(result)
})

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
  // getNum()
});

