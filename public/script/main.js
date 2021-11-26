// import { io } from "socket.io-client";
// const socket = io();
const socket = io.connect('localhost:3000', { transports: ['websocket'] });

// sector01 under area
const msgForm = document.getElementById('form-msg');
const messages = document.getElementById('messages');
const inputMsg = document.getElementById('input-msg');
const msgBox = document.getElementById('box-msg');

// sector01 top area 
const titleBox = document.getElementById('box-title');
const countBox = document.getElementById('box-count');
const changeButton = document.getElementById('button-change');

// sector02 login area 
const loginForm = document.getElementById('form-login');
const buttonLogin = document.getElementById('button-login');
const inputId = document.getElementById('input-id');
const inputPassword = document.getElementById('input-password');
const signUpPage = document.getElementById('button-create-account');

// sector02 logout area 
// const logoutForm = document.getElementById('form-logout');
const mypageButton = document.getElementById('button-mypage');
// const commentForm = document.getElementById('form-comment');
// const logoutButton = document.getElementById('button-logout');

// sector02 under area
const articleForm = document.getElementById('form-article');
const createButton = document.getElementById('create-button');

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

// get ip adress
let ip_address = "";
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
        alert("사이트로부터 벤 되었습니다.");
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
let chat_color = getRandomColor();

let appendMsg = (data) => {
  let item = document.createElement("li");
  data.name = (data.name || "개미");
  item.innerHTML = `<span style='color: ${data.color}'>${data.name}</span>: ${data.msg}`;

  let item_child = document.createElement("div");
  item_child.style.display = "none";
  // ip 데이터 어떡하지~
  item_child.setAttribute("data-ip", data.ip);
  item.appendChild(item_child);

  messages.appendChild(item);
  // 스크롤 기능 추가해야함
  msgBox.scrollTo(0, msgBox.scrollHeight);
};

msgForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if(inputMsg.value){
    let data = {"msg": inputMsg.value, "name": $("#nick_name").text(), "ip": ip_address, "color": chat_color};
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
changeButton.addEventListener('click', (e) => {
  e.preventDefault();
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
});

signUpPage.addEventListener('click', (e) =>{
  e.preventDefault();
  location.href = '/signup';
});

createButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.name = "parentPage";

  let status = "toolbar=no,scrollbars=yes,resizable=yes,status=no,menubar=no,width=800,height=800,top=0,left=0"; 
  child_window = window.open("/article", "글 쓰기", status);
  child_window.document.getElementById("author").value = nickName;
});

mypageButton.addEventListener('click', (e) => {
  e.preventDefault();
  // window.name = "parentPage";

  // child_window = window.open("/article", "마이페이지", "height=800");
  // child_window.document.getElementById("author").value = nickName;
});

// 부모에게 이벤트를 위임
$(document).on("click", "#article_id", (e) => {
  e.preventDefault();

  window.name = "parentPage";

  let status = "toolbar=no,scrollbars=yes,resizable=yes,status=no,menubar=no,width=800,height=800,top=0,left=0"; 
  child_window = window.open(e.target.href, e.target.innerText, status);
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