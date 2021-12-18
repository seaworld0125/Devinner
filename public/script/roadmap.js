// 자취방
// const socket = io.connect('121.127.175.142', { transports: ['websocket'] });

// 수원 집
const socket = io.connect('localhost:3000', { transports: ['websocket'] });

// sector01 under area
const msgForm = document.getElementById('form-msg');
const messages = document.getElementById('messages');
const inputMsg = document.getElementById('input-msg');
const msgBox = document.getElementById('box-msg');

// sector01 top area 
const titleBox = document.getElementById('box-title');
const countBox = document.getElementById('box-count');
const levelName = document.getElementById('level-name');

// sector02 login area 
const loginForm = document.getElementById('form-login');
const buttonLogin = document.getElementById('button-login');
const inputId = document.getElementById('input-id');
const inputPassword = document.getElementById('input-password');
const signUpPage = document.getElementById('button-create-account');

// sector02 logout area 
const mypageButton = document.getElementById('button-mypage');

// socket.io Event naming
const CONNECTED = 'connected';
const UPDATE_CLIENTNUM = 'update-clientNum';
const CHAT_MSG = 'chat-message';
const CHECK_NICKNAME = 'check-nickname';
const CHECK_ACCOUNT = 'check-account';
const CHECK_IP = 'check-ip';
const SET_NICKNAME = 'set-nickname';
const CHECK_BAN_LIST = 'check-ban-list';
const GET_ALERT = 'get-alert';
const GET_NEWS = 'get-news';

// set parameter
let ip_address = "";
let nick_name = "";
let level = "";
let level_name = "";
let message_count = 0;
let last_message;

let stop_chat = false;
let stop_chat_time;

function getIp(){
  return new Promise((resolve, reject) => {
    $.getJSON('https://api.ipify.org?format=jsonp&callback=?', (data) => {
      resolve(data.ip);
    });
  });
};
getIp().then((ip) => {
  ip_address = ip;
  nick_name = $('#nick_name').text();
  level = Number($('#level').text());
  console.log(level);
  if(level == 0) level_name = '404';
  else if(level <= 5) level_name = '입문자';
  else if(level <= 10) level_name = '초보자';
  else if(level <= 20) level_name = '주니어';
  else if(level <= 40) level_name = '미드';
  else if(level <= 70) level_name = '시니어';
  else if(level <= 99) level_name = '고인물';
  else level_name = 'Hacker';

  levelName.innerText = level_name;

  socket.emit(CHECK_BAN_LIST, ip, (result) => {
      if(result) {
        alert("사이트 이용이 정지되었습니다. 정지기간(* 일)");
        window.close();
      }
  });
});

getRandomColor = function(_isAlpha) {
  let r = getRand(0, 255),
  g = getRand(0, 255),
  b = getRand(0, 255),
  a = getRand(0, 10) / 10;

  let rgb = _isAlpha ? 'rgba' : 'rgb';
  rgb += '(' + r + ',' + g + ',' + b;
  rgb += _isAlpha ? ',' + a + ')' : ')';

  return rgb;

  // Return random number from in to max
  function getRand(min, max) {
    if (min >= max) return false;
    return ~~(Math.random() * (max - min + 1)) + min;
  };
};
const chat_color = getRandomColor();

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // 필요한 경우, 옵션 기본값을 설정가능
    // httpOnly: true
  };

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



// ---------

let appendMsg = (data) => {
  let item = document.createElement("li");
  data.name = (data.name || "개미");
  item.innerHTML = `<span style='color: ${data.color}'>${data.name}</span>: ${data.msg}`;

  // let item_child = document.createElement("div");
  // item_child.style.display = "none";
  // // ip 데이터 어떡하지~
  // item_child.setAttribute("data-ip", data.ip);
  // item.appendChild(item_child);

  messages.appendChild(item);
  // 스크롤 기능 추가해야함
  msgBox.scrollTo(0, msgBox.scrollHeight);
};

msgForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if(inputMsg.value){
    let chat_cookie = getCookie('stop_chat');
    if(chat_cookie) {
      let time = new Date();
      let check_time = (time.getHours() * 3600) + (time.getMinutes() * 60) + time.getSeconds();
    
      if(check_time - chat_cookie <= 180) {
        alert("채팅 도배로 인해 3분간 이용할 수 없습니다.");
        return;
      }
    }
    message_count++;
    let time = new Date();
    let message_time = (time.getHours() * 3600) + (time.getMinutes() * 60) + time.getSeconds();
    
    if(message_time - (last_message || message_time) <= 2) { // 메시지 간격이 2초 이하인데
      if(message_count >= 5) { // 5개 이상 메시지를 보냈다
        setCookie('stop_chat', message_time, {'max-age' : 180});
        return;
      }
    }
    else {
      message_count = 0;
    }
    last_message = message_time;

    let data = {"msg": inputMsg.value, "name": nick_name, "ip": ip_address, "color": chat_color};
    socket.emit(CHAT_MSG, data);
    appendMsg(data);
    inputMsg.value = ''; //input value reset
  }
});

loginForm.onsubmit = () => {return loginSpaceCheck()};

function loginSpaceCheck() {
  if(inputId.value && inputPassword.value){
    return true;
  }
  alert("아이디와 비밀번호를 입력하세요!");
  return false;
} 

// var isLogin = false;
// changeButton.addEventListener('click', (e) => {
//   e.preventDefault();
  // if(isLogin){
  //   var exp = /개미/;
  //   let old_name = document.getElementById('nick_name').textContent;
  //   let nick_name = prompt('사용할 별명을 입력해주세요. (개미는 사용할 수 없는 단어입니다) (8자리)');
  //   if(nick_name) {
  //     if(!exp.test(nick_name)){
  //       socket.emit(CHECK_NICKNAME, {new :nick_name, old: old_name}, (unique) => {
  //         if(unique){
  //           alert(nick_name + ' 으로 설정되었습니다.');
  //           setNickname(nick_name);
  //         }
  //         else{
  //           alert(nick_name + '은 이미 존재하는 별명입니다.');
  //           changeButton.click();
  //         }
  //       });
  //     }
  //     else{
  //       alert('개미는 사용할 수 없는 단어입니다');
  //     }
  //   }
  //   else{
  //     alert('별명을 입력하세요.');
  //   }
  // }
  // else {
  //   alert('로그인 또는 회원가입을 하면 사용할 수 있습니다.');
  // }
// });

signUpPage.addEventListener('click', (e) =>{
  e.preventDefault();
  location.href = '/signup';
});

mypageButton.addEventListener('click', (e) => {
  e.preventDefault();
  // window.name = "parentPage";

  // child_window = window.open("/article", "마이페이지", "height=800");
  // child_window.document.getElementById("author").value = nickName;
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

socket.on(GET_ALERT, (msg) => {
  alert(msg);
});



// guide function
const guideMent = document.getElementById('guide');
const guideBubble = document.getElementById('guide-bubble');

guideMent.addEventListener('mouseover' || 'focus', (e) => {
  guideBubble.style.display = 'block';
});
guideMent.addEventListener('mouseout' || 'blur', (e) => {
  guideBubble.style.display = 'none';
});

guideBubble.addEventListener('mouseover' || 'focus', (e) => {
  guideBubble.style.display = 'block';
});
guideBubble.addEventListener('mouseout' || 'blur', (e) => {
  guideBubble.style.display = 'none';
});

// card pop-up function
$('#board').on("click", "#card-img", (e) => {
  e.preventDefault();

  window.name = "parentPage";
  let status = "toolbar=no,scrollbars=yes,resizable=yes,status=no,menubar=no,width=810,height=800,top=0,left=0"; 

  console.log(e);

  child_window = window.open(e.target.dataset.href, e.target.dataset.name, status);
});