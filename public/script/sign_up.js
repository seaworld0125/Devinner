// make account form area
const username = document.getElementById('username');
const password = document.getElementById('password');
const nickname = document.getElementById('nickname');
const button01 = document.getElementById('button01');
const button02 = document.getElementById('button02');
const github = document.getElementById('github');

const submitButton = document.getElementById('submit-button');

// account check values
let username_check = false;
let nickname_check = false;
let password_user_check = false;
let password_length_check = false;
let username_length_check = false;
let nickname_length_check = false;

// get ip
let ip = "";
$.getJSON('https://ipapi.co/json/', function(result){
    ip =  result.ip;
});

// Real-time Input Value Change Detection
var old_username = "";       
$("#username").on("propertychange change keyup paste input", function() {
    var currentVal = $(this).val();
    if(currentVal == old_username) {
        return;
    }
    old_username = currentVal;

    let pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if(pattern.test(currentVal)) {
        $("label[for='username']").text('한글은 사용할 수 없습니다');
        password_length_check = false;
        return;
    }
    let length_ = old_username.length;
    if(length_ == 0){
        $("label[for='username']").text('아이디');
        username_length_check = false;
    }
    else if(length_ < 6 || length_ > 15){
        $("label[for='username']").text('6글자 이상 15글자 이하입니다.');
        username_length_check = false;
    }
    else if(length_ > 5 && length_ < 16){
        $("label[for='username']").text('적당한 길이네요!');
        username_length_check = true;
    }
});      
var old_password = "";      
$("#password").on("propertychange change keyup paste input", function() {
    let currentVal = $(this).val();
    if(currentVal == old_password) {
        return;
    }
    old_password = currentVal;
    let length_ = old_password.length;
    if(length_ == 0){
        $("label[for='password']").text('비밀번호');
        password_length_check = false;
    }
    else if(length_ < 6 || length_ > 20){
        $("label[for='password']").text('6글자 이상 20글자 이하입니다.');
        password_length_check = false;
    }
    else if(length_ > 5 && length_ < 21){
        $("label[for='password']").text('적당한 길이네요!');
        password_length_check = true;
    }
});
$("#password-check").on("propertychange change keyup paste input", function() {
    var currentVal = $(this).val();

    if(currentVal === password.value && currentVal.length > 0) {
        $("label[for='password-check']").text('비밀번호가 일치합니다');
        password_user_check = true;
    }
    else {
        $("label[for='password-check']").text('비밀번호가 일치하지 않습니다');
        password_user_check = false;
    }
});
var old_nickname = "";      
$("#nickname").on("propertychange change keyup paste input", function() {
    var currentVal = $(this).val();
    if(currentVal == old_nickname) {
        return;
    }
    old_nickname = currentVal;
 
    let pattern = /[ㄱ-ㅎ|ㅏ-ㅣ]/;
    if(pattern.test(currentVal)) {
        $("label[for='nickname']").text('자음과 모음은 따로 사용할 수 없습니다');
        nickname_length_check = false;
        return;
    }
    let length_ = old_nickname.length;
    if(length_ == 0){
        $("label[for='nickname']").text('닉네임');
        nickname_length_check = false;
    }
    else if(length_ < 4 || length_ > 10){
        $("label[for='nickname']").text('4글자 이상 10글자 이하입니다.');
        nickname_length_check = false;
    }
    else if(length_ > 3 && length_ < 11){
        $("label[for='nickname']").text('적당한 길이네요!');
        nickname_length_check = true;
    }
});

// check Id unique
button01.addEventListener('click', (e) => {
    e.preventDefault();
    if(username_length_check){
        let username_ = username.value;
        $.ajax({
            type: "GET",
            url: "/signup/id",
            data: {"id" : username_},
            success: (result) => {
                if(result) {
                    alert(username_ + ' 은 사용가능한 ID입니다.');
                    username_check = true;
                }
                else {
                    alert(username_ + '은 이미 존재하는 ID입니다.');
                    username_check = false;
                }
            }
        });   
    }
    else alert('아이디 조건을 다시 확인해주세요');
});

// check Nickname unique
button02.addEventListener('click', (e) => {
    e.preventDefault();
    if(nickname_length_check){
        let nickname_ = nickname.value;
        $.ajax({
            type: "GET",
            url: "/signup/nickname",
            data: {"nickname" : nickname_},
            success: (result) => {
                if(result) {
                    alert(nickname_ + ' 은 사용가능한 별명입니다.');
                    nickname_check = true;
                }
                else {
                    alert(nickname_ + '은 이미 존재하는 별명입니다.');
                    nickname_check = false;
                }
            }
        });  
    }
    else alert('닉네임 조건을 다시 확인해주세요');              
});

submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    // check input
    if(!username_length_check) {alert('아이디 조건을 확인해주세요'); return;}
    if(!password_length_check) {alert('비밀번호를 확인해주세요'); return;}
    if(!password_user_check) {alert('비밀번호가 일치하지 않습니다'); return;}
    if(!nickname_length_check) {alert('닉네임 길이를 확인해주세요'); return;}
    if(!username_check) {alert('아이디 중복을 확인해주세요'); return;}
    if(!nickname_check) {alert('닉네임 중복을 확인해주세요'); return;}
    
    document.getElementById('ip').value = ip;

    document.createForm.submit();
});
    