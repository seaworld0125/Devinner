
const express       = require('express');
const app           = express();
const http          = require('http');
const { Server }    = require('socket.io');
const httpServer    = http.createServer(app);
const io            = new Server(httpServer);
const port          = 3000;

const request       = require('request');
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const path          = require('path');
const logger        = require('morgan');
const createError   = require('http-errors');

// Router
const indexRouter   = require('./routes/main');
const authRouter    = require('./routes/auth');
const signUpPageRouter = require('./routes/sign_up');
const articleRouter = require('./routes/article');

// hellper
const eventName     = require('./Helpers/event');
const dbQuery       = require('./Helpers/query');
const INET          = require('./Helpers/inet.js');

// configuration
const news_config   = require('./conf/news-api.js');

const mysql         = require('mysql2');
const dbOptions     = require('./db/db');
const DB            = mysql.createConnection(dbOptions);

const sessionStore  = require('./db/session-db');
const sessionOption = require('./conf/session');

app
.set('port', port)
.use(logger('dev'))
.use(express.json())
.use(express.urlencoded({ extended: true }))
.use(cookieParser())
.use(session({
    key: sessionOption.key,
    secret: sessionOption.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));

app
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.use(express.static(path.join(__dirname, 'public')));

app
.use('/', indexRouter)
.use('/auth', authRouter)
.use('/signup', signUpPageRouter)
.use('/article', articleRouter);

app
.use(function(req, res, next) {
    next(createError(404));
})
.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {'error' : err.status});
});

var daily_kospi_news = new Array();
request(news_config.kospi_option, function (error, response) { // 이것도 메인 라우터에서 ㄱㄱ
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
var manager = require('./Helpers/client_manager');

io.on('connection', (socket) => {
    manager.addClientNum();
    io.emit(eventName.CONNECTED, manager.getClientNum());

    socket.on(eventName.DISCONNECT, () => {
        manager.subClientNum();
        io.emit(eventName.UPDATE_CLIENTNUM, manager.getClientNum());
    });
    socket.on(eventName.CHAT_MSG, (msg) => {
        
        console.log('msg :' + msg);
        socket.broadcast.emit(eventName.CHAT_MSG, msg);
    });
    socket.on(eventName.CHECK_IP, (ip, returnUnique) => {// 이건 회원가입페이지 접속 라우팅 부분에서 해결
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
    socket.on(eventName.CHECK_BAN_LIST, (ip, returnResult) => { // 이것도 최초 접속했을 때 확인 // 벤이면 벤 페이지 렌더링하기
        console.log('ip :' + ip);
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
                    returnResult(true);
                }
                else {
                    console.log("normal user");
                    returnResult(false);
                }
            }
        );
    });
    socket.on(eventName.GET_NEWS, (returnNews) => {// 이것도 메인 라우터에서 ㄱㄱ
        returnNews(daily_kospi_news);
    });
});

// bin/www 에서 사용될 app 모듈
module.exports = {"server" : httpServer, "port" : port};