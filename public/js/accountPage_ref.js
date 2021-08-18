// const socket = io('http://localhost:3000');
const socket = io.connect('http://121.127.175.142/', { transports: ['websocket'] });

// make account form area
const username = document.getElementById('username');
const password = document.getElementById('password');
const nickname = document.getElementById('nickname');
const button01 = document.getElementById('button01');
const button02 = document.getElementById('button02');
const createAccountForm = document.getElementById('form-new-account');

// socket.io Event naming
const CHECK_USERNAME = 'check-username';
const CHECK_NICKNAME = 'check-nickname';
const CREATE_ACCOUNT = 'create-account';
const SET_NICKNAME = 'set-nickname';

// account check values
let password_check = false;
let username_check = false;
let nickname_check = false;
let username_length_check = false;
let nickname_length_check = false;
let ip_check = false;