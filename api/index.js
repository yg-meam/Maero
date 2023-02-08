require("../module/db")
var WebClient = require('@slack/client').WebClient;
global.slackBot = new WebClient(config.slack.token);

process.on('SIGINT', function () {

    if (ENV == "development") {
        process.exit(1);
    } else {
        slackBot.chat.postMessage({
            channel: "build",
            "attachments": [{
                "color": color,
                "pretext": `[${ENV}][${config.host}][${require("os").hostname()}][${process.pid}]`,
                "title": `[${ENV}][${config.host}]웹서버 종료`,
                "title_link": config.host,
            }]
        }).then(function (res) {
            process.exit(1);
        });
    }

});
const axios = require("axios")
const express = require('express');
global.asyncForEach = require('async-await-foreach');
global.asyncHandling = require('express-async-handler')
global._ = require('underscore')
global.moment = require("moment")
var logger = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var qs = require("querystring")
var session = require('express-session');
var cors = require('cors');

app.use(cors());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(dbOptions);
app.use(bodyParser.json({
    limit: '500mb'
}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    key: 'key',
    secret: 'crowd!@!@',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 10 * 365 * 3600 * 1000
    }
}));
global.AWS = require('aws-sdk');
AWS.config.region = config.aws.region;
AWS.config.update({
    accessKeyId: config.aws.aws_access_key,
    secretAccessKey: config.aws.aws_secret_key
});

global.s3 = new AWS.S3({
    sslEnabled: false
});

app.get("/status", (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    res.json({ res: true })
})

app.use("/admin", require("../middleware/userCheck"), require("./admin"))
app.use("/file", require("./file_gcp"))
app.use(require("./api"))


// error handler
// app.use(Sentry.Handlers.errorHandler());
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err)
    // render the error page
    res.status(err.status || 500);
    res.json({
        res: false,
        msg: err.message
    })
    if (ENV == "production") {
        var color = "good";
        if (ENV == "staging") {
            color = "warning"
        }

        slackBot.chat.postMessage({
            channel: "error",
            "attachments": [{
                "color": color,
                "pretext": `[${ENV}][${config.host}][${require("os").hostname()}][${process.pid}][${err.stack}][${typeof err.stack}]`, "title": `[${ENV}]웹서버 오류발생`,
                "title_link": config.host,
            }]
        }).then(function (res) {

        });
    }


    // res.render('error');
});

if (ENV != "development") {
    var color = "good";
    var title = `[${ENV}][${config.host}]웹서버 시작`
    var link = config.host
    if (ENV == "staging") {
        color = "warning"
        title = `[${ENV}][${config.host}]웹서버 시작 체크후 Master로 Merge하기`
        link = "https://github.com/hhsoft/maero/compare/master...develop"
    }

    slackBot.chat.postMessage({
        channel: "build",
        "attachments": [{
            "color": color,

            "title": title,
            "title_link": link,
        }]
    }).then(function (res) { });


} else { }



module.exports = {
    path: '/api/v1',
    handler: app
}
