// chat
const msgForm = document.getElementById('form-msg');
const messages = document.getElementById('messages');
const inputMsg = document.getElementById('input-msg');
const msgBox = document.getElementById('box-msg');
const countBox = document.getElementById('box-count');
const levelName = document.getElementById('level-name');

// chat event
const CONNECTED = 'connected';
const UPDATE_CLIENTNUM = 'update-clientNum';
const CHAT_MSG = 'chat-message';
const CHECK_BAN_LIST = 'check-ban-list';

const socket = io.connect('devinner.co.kr', { transports: ['websocket'] });

const chat_color = (function(_isAlpha) {
    let r = getRand(0, 255),
    g = getRand(0, 255),
    b = getRand(0, 255),
    a = getRand(0, 10) / 10;
  
    let rgb = _isAlpha ? 'rgba' : 'rgb';
    rgb += '(' + r + ',' + g + ',' + b;
    rgb += _isAlpha ? ',' + a + ')' : ')';
  
    return rgb;
  
    function getRand(min, max) {

        if (min >= max) return false;
        return ~~(Math.random() * (max - min + 1)) + min;
    };
})(false);

// chat
let nick_name;
let level;
let level_name;
let message_count;
let last_message;

// ip
let ip_address = "";

// 밴 리스트 확인 함수 // 모듈로 분리 예정 // ajax 사용
function getIp(){
    return new Promise((resolve, reject) => {
        $.getJSON('https://api.ipify.org?format=jsonp&callback=?', (data) => {
        resolve(data.ip);
        });
    });
};
getIp().then((ip) => {
    ip_address = ip;

    socket.emit(CHECK_BAN_LIST, ip, (result) => {

        if(result) {
            alert("사이트 이용이 정지되었습니다. 정지기간(* 일)");
            window.close();
        }
    });
});

(() => {
    nick_name = $('#nick_name').text();
    level = Number($('#level').text());

    if(level == 0) level_name = '404';
    else if(level <= 5) level_name = '입문자';
    else if(level <= 10) level_name = '초보자';
    else if(level <= 20) level_name = '주니어';
    else if(level <= 40) level_name = '미드';
    else if(level <= 70) level_name = '시니어';
    else if(level <= 99) level_name = '고인물';
    else level_name = 'Hacker';
  
    levelName.innerText = level_name;
})();

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];

        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

let appendMsg = (data) => {
    let item = document.createElement("li");
    data.name = (data.name || "개미");
    item.innerHTML = `<span style='color: ${data.color}'>${data.name}</span>: ${data.msg}`;

    messages.appendChild(item);
    // 스크롤 기능 추가해야함
    msgBox.scrollTo(0, msgBox.scrollHeight);
};

const bad_word = /씨발|시발|개새끼|개쉐끼|니미|꺼져|섹스|좆까|조까/g;

msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if(inputMsg.value) {
        let chat_cookie = getCookie('stop_chat');

        if(chat_cookie) {
            let time = new Date();
            let check_time = (time.getHours() * 3600) + (time.getMinutes() * 60) + time.getSeconds();
    
            alert("채팅 도배로 인해 3분간 이용할 수 없습니다.");
            return;
        }
        message_count++;
        let time = new Date();
        let message_time = (time.getHours() * 3600) + (time.getMinutes() * 60) + time.getSeconds();
    
        if(message_time - (last_message || message_time) <= 2) {

            if(message_count >= 8) {
                setCookie('stop_chat', message_time, {'path' : '/', 'max-age' : 180});
                return;
            }
        }
        else 
        {
            message_count = 0;
        }
        last_message = message_time;

        let message = inputMsg.value.replace(/<[^>]+>/g, '').replace(bad_word, "ooo");
        let data = {"msg": message, "name": nick_name, "ip": ip_address, "color": chat_color};
        socket.emit(CHAT_MSG, data);
        appendMsg(data);

        inputMsg.value = '';
    }
});

socket.on(CONNECTED, (count) => {
    countBox.textContent = "접속자 수 : " + count;
});
  
socket.on(UPDATE_CLIENTNUM, (count) => {
    countBox.textContent = "접속자 수 : " + count;
});
  
socket.on(CHAT_MSG, (data) => {
    appendMsg(data);
});
