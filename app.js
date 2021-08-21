// express, server
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io"); 
const io = new Server(server);
// const io = new require("socket.io")(server);


// DB
const MySQL = require("MySQL2");
const DB_config = require('./config/db.js');
const DB = MySQL.createConnection({
    host : DB_config.host,
    user : DB_config.user,
    password : DB_config.password,
    database : DB_config.database
});

// path
const PATH = require("path");

// request
const request = require('request');

// api
const API_config = require('./config/news_api.js');
const kospi_option = API_config.kospi_option;

// reference value
const ref = require('./event/app.js');

// user def function
const INET = require('./func/inet.js');

const aton = INET.aton;
const ntoa = INET.ntoa;

// static file location
app.use(express.static(PATH.join(__dirname, '/')));
// redirect HTTP to HTTPS 
// app.all('*', (req, res, next) => {
//     if (req.secure) { 
//         next(); 
//     } 
//     else {
//         let to = `https://${req.hostname}${req.url}`;
//         res.redirect(to); } 
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/page/main.html');
});
app.get('/account', (req, res) => {
    res.sendFile(__dirname + '/public/page/accountPage.html');
});

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

var clientsCount = 0;
var clientsNickname = [];
function printStatus(){
    console.log("clientsCount :", clientsCount);
    console.log("nickname list :" + clientsNickname);
};
function nicknameSplice(nickname){
    let index = clientsNickname.findIndex(Element => Element == nickname);
    if(index) clientsNickname.splice(index, 1);
};
function update_clientNum(){
    console.log(ref.UPDATE_CLIENTNUM + "() run");
    io.emit(ref.UPDATE_CLIENTNUM, clientsCount);
};
// use Promise
function check_ban_list(ip){
    return new Promise((resolve, reject) => {
        ip = aton(ip);
        console.log('aton :' + ip);
        DB.execute('SELECT ip FROM ban_list WHERE ip = ?',
            [ip], 
            function(err, results, fields) {
                if(err) console.log(err);
                console.log('check ban list :' + results[0]);
                if(results[0]){
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            }
        );
    });
}

io.on('connection', (socket) => {
    clientsCount++;
    socket.nickname = '개미';
    io.emit(ref.CONNECTED, clientsCount);
    printStatus();

    socket.on(ref.DISCONNECT, () => {
        --clientsCount;
        nicknameSplice(socket.nickname);
        update_clientNum();
    });
    socket.on(ref.CHAT_MSG, (msg) => {
        msg = socket.nickname + ' : ' + msg;
        console.log("msg :" + msg);
        socket.broadcast.emit(ref.CHAT_MSG, msg);
    });
    socket.on(ref.CHECK_USERNAME, (username, returnUnique) => {
        // use Prepared statement
        DB.execute(
            'SELECT account_name FROM account WHERE account_name = ?',
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
    socket.on(ref.CHECK_NICKNAME, (nickname, returnUnique) => {
        console.log('input nickname :' + nickname);
        nicknameSplice(socket.nickname);
        DB.execute(
            'SELECT nickname FROM account WHERE nickname = ?',
            [nickname],
            function(err, results, fields) {
                console.log(results);
                if(results[0]){
                    console.log("별명 중복");
                    returnUnique(false);
                }
                else{
                    if(clientsNickname.find(Element => Element == nickname)){
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
    socket.on(ref.CHECK_IP, (ip, returnUnique) => {
        console.log('ip :' + ip);
        ip = aton(ip);
        DB.execute(
            'SELECT account_name FROM account WHERE ip_address = ?',
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
    socket.on(ref.CHECK_ACCOUNT, (account, returnData) => {
        console.log(account);
        console.log('id :' + account.id);
        console.log('password :' + account.password);

        DB.execute(
            'SELECT * FROM account WHERE account_name = ?',
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
    socket.on(ref.SET_NICKNAME, (nickname) => {
        socket.nickname = nickname;
        clientsNickname.push(nickname);
        console.log("nickname list :" + clientsNickname);
    });
    socket.on(ref.CHECK_BAN_LIST, (ip) => {
        check_ban_list(ip).then((result) => {
            if(result){
                console.log('user ban!' + ip);
                socket.disconnect();
            }
        });
    });
    socket.on(ref.CREATE_ACCOUNT, (account) => {
        console.log('create account');
        console.log('id :' + account.id);
        console.log('password :' + account.password);
        console.log('nickname :' + account.nickname);

        account.ip = aton(account.ip);
        console.log('aton ip :' + account.ip);

        DB.execute(
            'INSERT INTO account VALUE(?, ?, ?, ?, ?)',
            [0, account.id, account.password, account.nickname, account.ip],
            function(err, results, fields) {
                if(err){
                    console.log(err);
                }
                console.log("계정 생성 성공");
            }   
        );
    });
    socket.on(ref.GET_NEWS, (returnNews) => {
        returnNews(daily_kospi_news);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

