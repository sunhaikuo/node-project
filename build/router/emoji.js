const fs = require('fs');
var request = require("request");
var map = {
    "[心]": "https://h5.sinaimg.cn/m/emoticon/icon/others/l_xin-6912791858.png",
    "[喵喵]": "https://h5.sinaimg.cn/m/emoticon/icon/others/d_miao-61fe2a7aaa.png",
    "[思考]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_sikao-c599fd085f.png",
    "[挖鼻]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_wabishi-842338e697.png",
    "[跪了]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_guile-7b3e474f7f.png",
    "[哆啦A梦开心]": "https://h5.sinaimg.cn/m/emoticon/icon/doraemon/dr_kaixin-99e3f5911d.png",
    "[二哈]": "https://h5.sinaimg.cn/m/emoticon/icon/others/d_erha-0fecc90ac1.png",
    "[赞]": "https://h5.sinaimg.cn/m/emoticon/icon/others/h_zan-e3d1e596da.png",
    "[怒]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_nu-54e54e160b.png",
    "[doge]": "https://h5.sinaimg.cn/m/emoticon/icon/others/d_doge-861403219c.png",
    "[允悲]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_yunbei-9aa3c436a4.png",
    "[摊手]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_tanshou-3abaa4ed77.png",
    "[笑而不语]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_heiheihei-f7ca09d6e8.png",
    "[给你小心心]": "https://h5.sinaimg.cn/m/emoticon/icon/others/qixi2018_xiaoxinxin-afb8c6ea83.png",
    "[泪]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_lei-1b4b02f8b1.png",
    "[并不简单]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_bingbujiandan-e0c6936005.png",
    "[失望]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_shiwang-7925938d93.png",
    "[可爱]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_keai-7a5bf88086.png",
    "[羞嗒嗒]": "https://h5.sinaimg.cn/m/emoticon/icon/lxh/lxh_xiudada-f44e8f5688.png",
    "[憧憬]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_xingxingyan-06a3ca0ae4.png",
    "[感冒]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_ganmao-d66b25d11a.png",
    "[疑问]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_yiwen-40a816d206.png",
    "[嘻嘻]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_xixi-813ededea2.png",
    "[偷笑]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_touxiao-15afb1c739.png",
    "[求关注]": "https://h5.sinaimg.cn/m/emoticon/icon/lxh/lxh_qiuguanzhu-9953fab258.png",
    "[作揖]": "https://h5.sinaimg.cn/m/emoticon/icon/others/h_zuoyi-cb12e18fd5.png",
    "[费解]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_feijie-bac8e40ab4.png",
    "[哈哈]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_haha-dd1c6d36cf.png",
    "[酷]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_ku-6fa1a42f7b.png",
    "[黑线]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_heixian-bde08b426c.png",
    "[太开心]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_taikaixin-97bd3f82d6.png",
    "[微风]": "https://h5.sinaimg.cn/m/emoticon/icon/others/w_weifeng-33be96b05d.png",
    "[悲伤]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_beishang-f8d6de06c8.png",
    "[佐伊卖萌]": "https://h5.sinaimg.cn/m/emoticon/icon/movies/angrybirds_09-9f728a11e7.png",
    "[笑cry]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_xiaoku-d320324f00.png",
    "[蛋糕]": "https://h5.sinaimg.cn/m/emoticon/icon/others/o_dangao-57caf5f65f.png",
    "[米奇比心]": "https://h5.sinaimg.cn/m/emoticon/icon/movies/mickey_01-f93c4eac57.png",
    "[鼓掌]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_guzhang-a35dfd4d70.png",
    "[吃瓜]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_chigua-c95cd5ba58.png",
    "[兔子]": "https://h5.sinaimg.cn/m/emoticon/icon/others/d_tuzi-ff7bf5a0f1.png",
    "[good]": "https://h5.sinaimg.cn/m/emoticon/icon/others/h_good-644bcfa993.png",
    "[伤心]": "https://h5.sinaimg.cn/m/emoticon/icon/others/l_shangxin-934f730572.png",
    "[酸]": "https://h5.sinaimg.cn/m/emoticon/icon/others/h_suan-a1ba7ede34.png",
    "[哆啦A梦吃惊]": "https://h5.sinaimg.cn/m/emoticon/icon/doraemon/dr_chijing-1b0e255e0f.png",
    "[衰]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_shuai-3dcd4d86c5.png",
    "[中国赞]": "https://h5.sinaimg.cn/m/emoticon/icon/others/d_chnlike-2c6f482dac.png",
    "[爱你]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_aini-4a23c0524a.png",
    "[委屈]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_weiqu-b069337758.png",
    "[污]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_wu-12f8564d2b.png",
    "[可怜]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_kelian-3e00ccdc26.png",
    "[话筒]": "https://h5.sinaimg.cn/m/emoticon/icon/others/o_huatong-a3c5f9bcc2.png",
    "[拳头]": "https://h5.sinaimg.cn/m/emoticon/icon/others/h_quantou-0a4441543d.png",
    "[微笑]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_hehe-039d0a6a8a.png",
    "傻眼": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_shayan-c1a5f8fbc5.png",
    "[色]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_huaxin-36e1b80629.png",
    "[汗]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_han-0e7b8aa6d1.png",
    "[好喜欢]": "https://h5.sinaimg.cn/m/emoticon/icon/lxh/lxh_haoxihuan-8b4400e556.png",
    "[亲亲]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_qinqin-ec0877767a.png",
    "[星星]": "https://h5.sinaimg.cn/m/emoticon/icon/_/x_star1-a80a7785a2.png",
    "[馋嘴]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_chanzui-01ee2388fd.png",
    "[挤眼]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_jiyan-feeb0a726c.png",
    "[ok]": "https://h5.sinaimg.cn/m/emoticon/icon/others/h_ok-4bd9b83e8e.png",
    "[太阳]": "https://h5.sinaimg.cn/m/emoticon/icon/others/w_taiyang-90b439dadf.png",
    "[佩奇]": "https://h5.sinaimg.cn/m/emoticon/icon/others/a_peiqi-f1d74484da.png",
    "[音乐]": "https://h5.sinaimg.cn/m/emoticon/icon/others/o_yinyue-89aa67be16.png\" /></span>】意大利艺术家silvia nair为巴蒂的纪录片《Number.9-Gabriel Batistuta》中创作的主题曲！<span class=\"url-icon\"><img alt=[话筒] src=\"//h5.sinaimg.cn/m/emoticon/icon/others/o_huatong-a3c5f9bcc2.png\" style=\"width:1em; height:1em;",
    "[拜拜]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_baibai-71b47dffdc.png",
    "[雷神]": "https://h5.sinaimg.cn/m/emoticon/icon/movies/avengers_thor-61cea97153.png",
    "[抱抱]": "https://h5.sinaimg.cn/m/emoticon/icon/default/d_baobao-b928ba5761.png"
};
const arr = [
    // "102803", 
    "102803_ctg1_7978_-_ctg1_7978",
    "102803_ctg1_4388_-_ctg1_4388",
    "102803_ctg1_1988_-_ctg1_1988",
    "102803_ctg1_4288_-_ctg1_4288",
    "102803_ctg1_4188_-_ctg1_4188",
    "102803_ctg1_5088_-_ctg1_5088",
    "102803_ctg1_1388_-_ctg1_1388",
    "102803_ctg1_5188_-_ctg1_5188",
    "102803_ctg1_3288_-_ctg1_3288",
    "102803_ctg1_4888_-_ctg1_4888"
];
function getMlog(gid) {
    request.get(`https://m.weibo.cn/api/container/getIndex?containerid=${gid}&openApp=0`, (error, response, body) => {
        const data = JSON.parse(body);
        const cards = data.data.cards;
        cards.forEach((item) => {
            const mblog = item.mblog;
            if (mblog.text.indexOf('<img alt=[') > -1) {
                // console.log(new Date(), mblog.text + '\n')
                getTextAndUrl(mblog.text, gid);
            }
        });
    });
}
function getTextAndUrl(text, gid) {
    const imgUrl = text.match(/<img alt=\[.+\] src=".+" style=".+" \/>/mg);
    if (imgUrl) {
        imgUrl.forEach((item) => {
            item = item.replace('style="width:1em; height:1em;" ', '');
            const i1 = item.indexOf('[');
            const i2 = item.indexOf(']') + 1;
            const key = item.substring(i1, i2);
            const k1 = item.indexOf('"') + 3;
            const k2 = item.lastIndexOf('"');
            const value = item.substring(k1, k2);
            if (!map[key]) {
                map[key] = `https://${value}`;
                console.log(gid, key, value);
            }
        });
    }
    fs.writeFile('map.txt', JSON.stringify(map, null, '\n'), () => {
    });
}
let cnt = 0;
setInterval(() => {
    getMlog(arr[cnt % arr.length]);
    cnt++;
}, 10 * 1000);
// getMlog(arr[0])
