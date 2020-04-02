const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    service: 'qq',
    port: 465,
    secureConnection: true,
    auth: {
        user: '369019497@qq.com',
        // 这里密码不是qq密码，是你设置的smtp授权码
        pass: 'sptxzolplggsbifd',
    }
});
let sendInfo = '';
let mailOptions = {
    from: '"阜外医院挂号" <369019497@qq.com>',
    to: 'sunhaikuo_2019@qq.com',
    subject: '挂号',
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: `<b>Yes！${sendInfo}</b>` // html body
};
module.exports = function send(params) {
    sendInfo = params;
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
    });
};
