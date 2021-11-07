// import { io } from "socket.io-client";
// const socket = io();
const socket = io.connect('http://121.127.175.142/', { transports: ['websocket'] });

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
getIp().then((result) => {
    socket.emit(CHECK_BAN_LIST, result);
});

// 뉴스 추가 // 이부분도 라우터가 처리할 것
(function (){
  socket.emit(GET_NEWS, (news) => {
    for (let i = 0; i < news.length; i++) {
      let title = news[i].title;
      let link = news[i].link;
      let description = news[i].description;
      let item = document.createElement("li");
      item.innerHTML = 
        `<article class="uk-article">
            <h1 class="uk-article-title">오늘 KOSPI 뉴스</h1>
            <p class="uk-article-meta">${title}</p>
            <p class="uk-text-lead" style="color: rgba(255, 255, 255, 0.61);">${description}</p>
            <div class="uk-grid-small uk-child-width-auto" uk-grid>
                <div>
                    <a class="uk-button uk-button-text" href="${link}" target="_blank" style="font-weight: 900;">더 읽기</a>
                </div>
            </div>
        </article>`
      articleForm.appendChild(item);
    }
  });
})();

let appendMsg = (msg, align) => {
  let item = document.createElement('li');
  if(align == 'right')
  {
    item.style.textAlign="right";
  }
  item.textContent = msg;
  messages.appendChild(item);
  msgBox.scrollTo(0, msgBox.scrollHeight);
};

msgForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if(inputMsg.value){
    socket.emit(CHAT_MSG, inputMsg.value);
    appendMsg(inputMsg.value, 'right');
    inputMsg.value = ''; //input value reset
  }
});

var isLogin = true;
loginForm.onsubmit = () => {loginSpaceCheck()};

function loginSpaceCheck() {
  if(inputId.value && inputPassword.value){
    return true;
  }
  return false;
} 

changeButton.addEventListener('click', (e) => {
  e.preventDefault();
  if(isLogin){
    var exp = /개미/;
    let old_name = document.getElementById('nick_name').textContent;
    let nick_name = prompt('사용할 별명을 입력해주세요. (개미는 사용할 수 없는 단어입니다) (8자리)');
    if(nick_name) {
      if(!exp.test(nick_name)){
        socket.emit(CHECK_NICKNAME, {new :nick_name, old: old_name}, (unique) => {
          if(unique){
            alert(nick_name + ' 으로 설정되었습니다.');
            setNickname(nick_name);
          }
          else{
            alert(nick_name + '은 이미 존재하는 별명입니다.');
            changeButton.click();
          }
        });
      }
      else{
        alert('개미는 사용할 수 없는 단어입니다');
      }
    }
    else{
      alert('별명을 입력하세요.');
    }
  }
  else {
    alert('로그인 또는 회원가입을 하면 사용할 수 있습니다.');
  }
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

socket.on(CONNECTED, (count) => {
  countBox.textContent = "접속자 수 : " + count;
});

socket.on(UPDATE_CLIENTNUM, (count) => {
  countBox.textContent = "접속자 수 : " + count;
});

socket.on(CHAT_MSG, (msg) => {
  appendMsg(msg, 'left');
});

socket.on(GET_ALERT, (msg) => {
  alert(msg);
});