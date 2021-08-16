const { Socket } = require("dgram");
const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const {Server} = require("socket.io"); 
const io = new Server(server);

const MySQL = require("MySQL2");
const path = require("path");
var DB = MySQL.createConnection({
    host : 'localhost',
    user : 'root',
    password : '989900ooPP@ktk',
    database : 'user_account'
});

app.use(express.static(path.join(__dirname,'/')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/page/index.html');
});
app.get('/account', (req, res) => {
    res.sendFile(__dirname + '/public/page/accountPage.html');
});

const CONNECTED = 'connected';
const DISCONNECT = 'disconnect';
const CHAT_MSG = 'chat-message';
const UPDATE_CLIENTNUM = 'update-clientNum';
const CHECK_NICKNAME = 'check-nickname';
const CHECK_USERNAME = 'check-username';
const CHECK_ACCOUNT = 'check-account';
const CHECK_IP = 'check-ip';
const CREATE_ACCOUNT = 'create-account';
const SET_NICKNAME = 'set-nickname';
const CHECK_BAN_LIST = 'check-ban-list';
const GET_ALERT = 'get-alert';

var clientsCount = 0;
var clientsNickname = [];

function inet_aton(ip){
    // split into octets
    var a = ip.split('.');
    var buffer = new ArrayBuffer(4);
    var dv = new DataView(buffer);
    for(var i = 0; i < 4; i++){
        dv.setUint8(i, a[i]);
    }
    return(dv.getUint32(0));
};
function inet_ntoa(num){
    var nbuffer = new ArrayBuffer(4);
    var ndv = new DataView(nbuffer);
    ndv.setUint32(0, num);

    var a = new Array();
    for(var i = 0; i < 4; i++){
        a[i] = ndv.getUint8(i);
    }
    return a.join('.');
};
function printStatus(){
    console.log("clientsCount :", clientsCount);
    console.log("nickname list :" + clientsNickname);
};
function nicknameSplice(nickname){
    let index = clientsNickname.findIndex(Element => Element == nickname);
    if(index) clientsNickname.splice(index, 1);
};
function update_clientNum(){
    console.log(UPDATE_CLIENTNUM + "() run");
    io.emit(UPDATE_CLIENTNUM, clientsCount);
};
// use Promise
function check_ban_list(ip){
    return new Promise((resolve, reject) => {
        console.log('inet_aton :' + inet_aton(ip));
        DB.execute('SELECT ip FROM ban_list WHERE ip = inet_aton(?)',
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
    io.emit(CONNECTED, clientsCount);
    printStatus();

    socket.on(DISCONNECT, () => {
        --clientsCount;
        nicknameSplice(socket.nickname);
        update_clientNum();
    });
    socket.on(CHAT_MSG, (msg) => {
        msg = socket.nickname + ' : ' + msg;
        console.log("msg :" + msg);
        socket.broadcast.emit(CHAT_MSG, msg);
    });
    socket.on(CHECK_USERNAME, (username, returnUnique) => {
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
    socket.on(CHECK_NICKNAME, (nickname, returnUnique) => {
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
    socket.on(CHECK_IP, (ip, returnUnique) => {
        console.log('ip :' + ip);
        DB.execute(
            'SELECT account_name FROM account WHERE ip_address = inet_aton(?)',
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
    socket.on(CHECK_ACCOUNT, (account, returnData) => {
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
    socket.on(SET_NICKNAME, (nickname) => {
        socket.nickname = nickname;
        clientsNickname.push(nickname);
        console.log("nickname list :" + clientsNickname);
    });
    socket.on(CHECK_BAN_LIST, (ip) => {
        check_ban_list(ip).then((result) => {
            if(result){
                console.log('user ban!' + ip);
                socket.disconnect();
            }
        });
    });
    socket.on(CREATE_ACCOUNT, (account) => {
        console.log('create account');
        console.log('id :' + account.id);
        console.log('password :' + account.password);
        console.log('nickname :' + account.nickname);

        account.ip = inet_aton(account.ip);
        console.log('inet_aton ip :' + account.ip);

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

