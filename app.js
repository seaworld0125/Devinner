
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
const mysql     = require("mysql2");
const pool      = require("./db/db_pool_creater");

const sessionStore  = require('./db/session_store_creater');
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
.use('/article', articleRouter)
.use('/signup', signUpPageRouter)
.use('/auth', authRouter)
.use('/', indexRouter);

app
.use(function(req, res, next) {
    next(createError(404));
})
.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    let status_ = err.status || 500;
    res.status(status_);
    res.render('error', {'error' : status_});
});

var manager = require('./Helpers/client_manager');

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
    socket.on(eventName.CHECK_BAN_LIST, (ip, returnResult) => {
        let aton = INET.aton(ip);
        let checkQeury = mysql.format(dbQuery.CHECK_BAN_LIST, [aton]);

        (async () => {
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
                console.log(error);
                connection.release();
                returnResult(false);
            }
        })();
    });
});

// bin/www 에서 사용될 app 모듈
module.exports = {"server" : httpServer, "port" : port};