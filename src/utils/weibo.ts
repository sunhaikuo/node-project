import { splitUrlToObj } from './url'

interface IToken {
    gsid: string;
    from: string;
    c: string;
    s: string;
}

const urlArr = [
    'https://api.weibo.cn/2/statuses/unread_hot_timeline?gsid=_2A25zguMTDeRxGeBG4lYV9SzNzjuIHXVuFnHbrDV6PUJbj9ANLXj8kWpNQfZvHWj18ikmF4z2M_R158Bner_8BHQv&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=10A3293010&sensors_device_id=019C6138-8C3E-462B-88CD-989677587E12&c=iphone&v_p=82&skin=default&s=8e344a45&v_f=1&networktype=wifi&b=0&lang=zh_CN&ua=iPhone12,5__weibo__10.3.2__iphone__os13.4&sflag=1&ft=1&aid=01AwC-VV0DeGEGMYFR4m_R9GzRErk_SEy-Q3NRyBluSBrnkIQ.&launchid=default',
    'https://api.weibo.cn/2/statuses/unread_hot_timeline?gsid=_2A25zguMTDeRxGeBG4lYV9SzNzjuIHXVuFnHbrDV6PUJbj9ANLXj8kWpNQfZvHWj18ikmF4z2M_R158Bner_8BHQv&sensors_mark=0&wm=3333_2001&sensors_is_first_day=false&from=10A3293010&sensors_device_id=019C6138-8C3E-462B-88CD-989677587E12&c=iphone&v_p=82&skin=default&s=8e344a45&v_f=1&networktype=wifi&b=0&lang=zh_CN&ua=iPhone12,5__weibo__10.3.2__iphone__os13.4&sflag=1&ft=1&aid=01AwC-VV0DeGEGMYFR4m_R9GzRErk_SEy-Q3NRyBluSBrnkIQ.&launchid=default',
]

const tokenArr: IToken[] = []

function randomToken(): IToken {
    const length = tokenArr.length
    const random = Math.floor(Math.random() * length)
    return tokenArr[random]
}

(function createToken() {
    urlArr.forEach((url) => {
        const { gsid, from, c, s } = splitUrlToObj(url)
        const token: IToken = {
            gsid, from, c, s
        }
        tokenArr.push(token)
    })
})()

export function createParam() {
    const token = randomToken()
    let param = []
    for (let key in token) {
        param.push(`&${key}=${token[key]}`)
    }
    return `?test=1${param.join('')}`
}
