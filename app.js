const express       = require('express');
const app           = express();
const http          = require('http');
const { Server }    = require('socket.io');
const httpServer    = http.createServer(app);
const io            = new Server(httpServer);
const port          = 3000;

const helmet        = require('helmet');
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const path          = require('path');
const logger        = require('morgan');

// Router
const mainRouter    = require('./routes/main');
const authRouter     = require('./routes/auth');
const signUpPageRouter = require('./routes/sign_up');
const articleRouter  = require('./routes/article');
const activityRouter = require('./routes/activity');
const roadmapRouter  = require('./routes/roadmap');
const projectRouter  = require('./routes/project');
const aboutRouter    = require('./routes/about');
const errorRouter    = require('./routes/error');
const usersRouter    = require('./routes/users');
const uploadRouter   = require('./routes/upload');

// hellper
const eventName     = require('./Helpers/event');
const INET          = require('./Helpers/inet.js');

// configuration
const mysql         = require("mysql2");
require('dotenv').config();

// model
const dbQuery       = require('./model/query');
const pool          = require("./model/db_pool_creater");
const sessionStore  = require('./model/session_store_creater');

// csp //Content Security Policy
const cspOptions = {
    directives: {
        // 기본 옵션을 가져옵니다.
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // 스크립트
        "script-src": ["'self'", "'unsafe-inline'", "*.jsdelivr.net", "*.jquery.com", "*.ipify.org"],
        // stylesheet
        "style-src": ["'self'", "'unsafe-inline'", "*.jsdelivr.net"],
        // 이미지
        "img-src": ["'self'", "data:", "*.github.com", "*.githubusercontent.com", "github.com"],
        // font
        "font-src": ["'self'", "https:", "data:", "*.jsdelivr.net"],
        // frame
        "frame-src": ["'self'", "https:", "data:", "*.ghbtns.com"],
        // connect
        "connect-src": ["wss:", "ipapi.co", "*.github.com", "devinner.co.kr", "*.devinner.co.kr"],
    }
}

app
.set('port', port)
.use(logger('dev'))
.use(helmet({
    contentSecurityPolicy: cspOptions,
}))
.use(express.json())
.use(express.urlencoded({ extended: true, limit: '5mb'}))
.use(cookieParser())
.use(session({
    key : process.env.COOKIE_KEY,
    secret : process.env.COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    //proxy: (process.env.NODE_ENV === 'production' ? true : false),
    //cookie: {
    //    httpOnly: true,
    //    secure: (process.env.NODE_ENV === 'production' ? true : false),
    //}
}));

app
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.use(express.static(path.join(__dirname, 'public')));

app
.use('/', mainRouter)
.use('/article', articleRouter)
.use('/signup', signUpPageRouter)
.use('/auth', authRouter)
.use('/activity', activityRouter)
.use('/roadmap', roadmapRouter)
.use('/project', projectRouter)
.use('/about', aboutRouter)
.use('/error', errorRouter)
.use('/users', usersRouter)
.use('/upload', uploadRouter);

app
.use(function(req, res, next) {
    res.redirect('/error/' + 404);
})
.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = (process.env.NODE_ENV === 'development' ? err : {});
    console.log(res.locals.message);
    console.log(res.locals.error);

    // render the error page
    res.redirect('/error/' + (err.status || 500));
});

const manager = require('./Helpers/client_manager');

io.on('connection', (socket) => {
    manager.addClientNum();
    io.emit(eventName.CONNECTED, manager.getClientNum());

    socket.on(eventName.DISCONNECT, () => {
        manager.subClientNum();
        io.emit(eventName.UPDATE_CLIENTNUM, manager.getClientNum());
    });
    socket.on(eventName.CHAT_MSG, (data) => {
        socket.broadcast.emit(eventName.CHAT_MSG, data);
    });
    socket.on(eventName.CHECK_BAN_LIST, async (ip, returnResult) => {
        let aton = INET.aton(ip);
        let checkQeury = mysql.format(dbQuery.CHECK_BAN_LIST, [aton]);

        let connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            let data = await connection.query(checkQeury);
            connection.release();

            if(data[0][0])
                returnResult(true);
            else
                returnResult(false);
        }
        catch (error) {
            connection.release();
            returnResult(false);
        }
    });
});

// bin/www 에서 사용될 app 모듈
module.exports = {"server" : httpServer, "port" : port};
