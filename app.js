var request = require("request");
var express = require('express');
const bookmark = require('./bookmark')
var bodyParser = require("body-parser")
var app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

var getNum = require('./number')

var options = {
  url: 'https://api.weibo.cn/2/statuses/unread_hot_timeline?gsid=_2A25wd8pVDeRxGeBG4lYV9SzNzjuIHXVRJVqdrDV6PUJbj9ANLUqnkWpNQfZvHWmenGEYUf1zPBbtoOaHpN2eM0Q4&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=1098493010&b=0&c=iphone&networktype=wifi&skin=default&v_p=76&v_f=1&s=979a0db4&sensors_device_id=C19F5EEA-1507-43CC-9256-EC1AC43F9BC2&lang=zh_CN&sflag=1&ua=iPhone11,6__weibo__9.8.4__iphone__os12.4&ft=0&aid=01AoUyMdlKzjcOYZpgvJToGSrWRnFy7Ev5b-wWZrVicVaGrRs.',//req.query
  // json: true,
  headers: {
    "content-type": "application/x-www-form-urlencoded; charset=utf-8",
  },//req.headers
  body: "extparam=discover%7Cnew_feed&fid=102803&uicode=10000495&count=25&trim_level=1&trim_page_recom=0&containerid=102803&fromlog=102803&uid=6894452157&orifid=&refresh_sourceid=10000365&featurecode=10000001&preAdInterval=2&oriuicode=&daily_total_times=9&since_id=4413935291614270&need_jump_scheme=1"
};

function getWeiboList() {
  return new Promise((resolve, reject) => {
    request.post(options, function (error, response, body) {
      console.info('body: ' + body);
      resolve(JSON.parse(body))
    });

  })
}

app.get('/', async (req, res) => {
  const body = await getWeiboList()
  res.send(body)
})

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
  getNum()
});

