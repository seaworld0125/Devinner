// express, server
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io"); 
const io = new Server(server);
// const io = new require("socket.io")(server);

const session = require("express-session");
const MySQL = require("MySQL2");
const request = require('request');

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/account-page');

const eventName = require('./Helpers/event-name');
const dbQuery = require('./Helpers/query-string');
const INET = require('./Helpers/inet.js');

// config
const app_config = require('./conf/app.js');

const kospi_option = app_config.kospi_option;
const DB = MySQL.createConnection({
    host : app_config.db_host,
    user : app_config.db_user,
    password : app_config.db_password,
    database : app_config.db_database
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
    res.status(err.status || 500);
    res.render('error');
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/page/main.html');
// });
// app.get('/account', (req, res) => {
//     res.sendFile(__dirname + '/public/page/accountPage.html');
// });

var daily_kospi_news = new Array();
request(kospi_option, function (error, response) {
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

var clientManager = require('./Helpers/client-manager');

io.on('connection', (socket) => {
    socket.nickname = '개미';
    clientManager.addClientNum();
    clientManager.printStatus();
    io.emit(eventName.CONNECTED, clientManager.getClientNum());

    socket.on(eventName.DISCONNECT, () => {
        clientManager.subClientNum();
        clientManager.nicknameSplice(socket.nickname);
        io.emit(eventName.UPDATE_CLIENTNUM, clientManager.getClientNum());
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
    socket.on(eventName.CHECK_NICKNAME, (nickname, returnUnique) => {
        console.log('input nickname :' + nickname);
        clientManager.nicknameSplice(socket.nickname);
        DB.execute(
            dbQuery.CHECK_NICKNAME,
            [nickname],
            function(err, results, fields) {
                console.log(results);
                if(results[0]){
                    console.log("별명 중복");
                    returnUnique(false);
                }
                else{
                    if(clientManager.findNickname(nickname)){
                        console.log("별명 중복");
                        returnUnique(false);                        
                    }
                    else{
                        console.log("별명 중복아님");
                        returnUnique(true);
                    }
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
    socket.on(eventName.CHECK_ACCOUNT, (account, returnData) => {
        console.log(account);
        console.log('id :' + account.id);
        console.log('password :' + account.password);

        DB.execute(
            dbQuery.CHECK_ACCOUNT,
            [account.id],
            function(err, results, fields) {
                console.log(results);
                if(err){
                    console.log(err);
                }
                if(results[0]){
                    if(account.password == results[0].password){
                        console.log("로그인 성공");
                        returnData(results[0].nickname);
                    }
                }
                else{
                    console.log("로그인 실패");
                    returnData(null);
                }
            }   
        );
    });
    socket.on(eventName.SET_NICKNAME, (nickname) => {
        socket.nickname = nickname;
        clientManager.addNickname(nickname);
        console.log("nickname list :" + clientManager.getNicknameList());
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

// server.listen(3000, () => {
//     console.log('listening on *:3000');
// });

// bin/www 에서 사용된 app 모듈
module.exports = app;