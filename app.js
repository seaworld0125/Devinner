// express, server
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const ejs = require("ejs");

const app = express();
const port = 3000;
app.set('port', port);

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const session = require("express-session");
const request = require('request');

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const accountPageRouter = require('./routes/sign_up');
const articleRouter = require('./routes/article');

// hellper
const eventName = require('./Helpers/event');
const dbQuery = require('./Helpers/query');
const INET = require('./Helpers/inet.js');

// configuration
const news_config = require('./conf/news-api.js');

const mysql = require("mysql2");
const dbOptions = require('./db/db');
const DB = mysql.createConnection(dbOptions);

const sessionStore = require('./db/session-db');
const sessionOption = require('./conf/session');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    key: sessionOption.key,
    secret: sessionOption.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/account', accountPageRouter);
app.use('/article', articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {'err' : err.status});
});

var daily_kospi_news = new Array();
request(news_config.kospi_option, function (error, response) {
    if (error) throw new Error(error);
    let arr = JSON.parse(response.body);
    Object.values(arr)[4].forEach(element => {
        let {title, link, description} = element;
        daily_kospi_news.push({
            title : title, 
            link : link, 
            description : description
        });
    });
});

io.on('connection', (socket) => {
    manager.addClientNum();
    io.emit(eventName.CONNECTED, manager.getClientNum());

    socket.on(eventName.DISCONNECT, () => {
        manager.subClientNum();
        io.emit(eventName.UPDATE_CLIENTNUM, manager.getClientNum());
    });
    socket.on(eventName.CHAT_MSG, (msg) => {
        msg = socket.nickname + ' : ' + msg;
        console.log("msg :" + msg);
        socket.broadcast.emit(eventName.CHAT_MSG, msg);
    });
    socket.on(eventName.CHECK_USERNAME, (username, returnUnique) => {
        // use Prepared statement
        DB.execute(
            dbQuery.CHECK_USERNAME,
            [username],
            function(err, results, fields) {
                console.log(results);
                if(results[0]){
                    console.log("Id 중복");
                    returnUnique(false);
                }
                else{
                    console.log("Id 중복아님");
                    returnUnique(true);
                }
            }   
        );
    });
    socket.on(eventName.CHECK_IP, (ip, returnUnique) => {
        console.log('ip :' + ip);
        ip = INET.aton(ip);
        DB.execute(
            dbQuery.CHECK_IP,
            [ip],
            function(err, results, fields) {
                console.log(results);
                if(results[0]){
                    console.log("ip 중복");
                    returnUnique(false);
                }
                else{
                    console.log("ip 중복아님");
                    returnUnique(true);
                }
            }   
        );
    });
    socket.on(eventName.CHECK_NICKNAME, (data, returnUnique) => {
        console.log('input nickname :' + data.new);
        DB.execute(
            dbQuery.CHECK_NICKNAME,
            [data.new],
            function(err, results, fields) {
                console.log(results);
                if(results[0]){
                    console.log("별명 중복");
                    returnUnique(false);
                }
                else{
                    console.log("별명 중복아님");
                    DB.execute(
                        dbQuery.SET_NICKNAME, 
                        [data.new, data.old],
                        function(err, results, fields) {
                            console.log("별명 변경완료");
                        }
                    )
                    returnUnique(true);
                }
            }   
        );
    });
    socket.on(eventName.CHECK_BAN_LIST, (ip) => {
        console.log("ip :" + ip);
        let aton = INET.aton(ip);
        console.log('aton :' + aton);
        DB.execute(
            dbQuery.CHECK_BAN_LIST,
            [aton], 
            function(err, results, fields) {
                if(err) console.log(err);
                console.log('check ban list :' + results[0]);
                if(results[0]) {
                    console.log('user ban!' + ip);
                    socket.disconnect();
                }
                else {
                    console.log("normal user");
                }
            }
        );
    });
    socket.on(eventName.CREATE_ACCOUNT, (account) => {
        console.log('create account');
        console.log('id :' + account.id);
        console.log('password :' + account.password);
        console.log('nickname :' + account.nickname);

        account.ip = INET.aton(account.ip);
        console.log('aton ip :' + account.ip);

        DB.execute(
            dbQuery.CREATE_ACCOUNT,
            [0, account.id, account.password, account.nickname, account.ip],
            function(err, results, fields) {
                if(err){
                    console.log(err);
                }
                console.log("계정 생성 성공");
            }   
        );
    });
    socket.on(eventName.GET_NEWS, (returnNews) => {
        returnNews(daily_kospi_news);
    });
});

// bin/www 에서 사용된 app 모듈
module.exports = {server : httpServer, port : port};