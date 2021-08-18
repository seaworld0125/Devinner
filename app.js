const { Socket } = require("dgram");
const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const {Server} = require("socket.io"); 
const io = new Server(server);

const MySQL = require("MySQL2");
const path = require("path");

const request = require('request');

const secret_ = require('./module_secret.js');
const ref = require('./app_reference.js');
const INET = require('./inet_func.js');
const NAVER_API = require('./news_url.js');

// static file location
app.use(express.static(path.join(__dirname,'/public/')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/page/index.html');
});
app.get('/account', (req, res) => {
    res.sendFile(__dirname + '/public/page/accountPage.html');
});

const DB = MySQL.createConnection({
    host : 'localhost',
    user : 'root',
    password : secret_.db_password,
    database : 'user_account'
});

var kospi_option = NAVER_API.kospi_option;
// request(kospi_option, function (error, response) {
//   if (error) throw new Error(error);
//   console.log(response.body);
// });

var clientsCount = 0;
var clientsNickname = [];

var aton = INET.aton;
var ntoa = INET.ntoa;

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
                console.log(results); // results contains rows returned by server
                //   console.log(fields); // fields contains extra meta data about results, if available
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
                console.log(results); // results contains rows returned by server
                //   console.log(fields); // fields contains extra meta data about results, if available
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
                console.log(results); // results contains rows returned by server
                //   console.log(fields); // fields contains extra meta data about results, if available
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
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

