var nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'dev.hackernews.scraper@gmail.com',
            pass: '3uD83cb1XH3b4cU'
        }
    });

exports.sendMail = function (to, html) {
    transporter.sendMail(_getOptions(to, html), function (error, info) {
        console.log('send mail with err = ');
        console.dir(error);
        console.log('send mail with info = ');
        console.dir(info);
    });
};

function _getOptions(to, html) {
    return mailOptions = {
        to: to,
        from: 'dev.hackernews.scraper@gmail.com',
        subject: 'Hackernews Subscription',
        html: html
    };
}
