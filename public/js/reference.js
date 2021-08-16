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
    const accountPage = document.getElementById('button-create-account');
    
    // sector already login area 
    const logoutForm = document.getElementById('form-logout');
    const commentForm = document.getElementById('form-comment');
    const logoutButton = document.getElementById('button-logout');
    
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