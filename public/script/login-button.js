// login/logout area 
const loginForm = document.getElementById('form-login');
const inputId = document.getElementById('input-id');
const inputPassword = document.getElementById('input-password');
const signUpPage = document.getElementById('button-create-account');

loginForm.onsubmit = () => {return loginSpaceCheck()};

function loginSpaceCheck() {
  if(inputId.value && inputPassword.value){
    return true;
  }
  alert("아이디와 비밀번호를 입력하세요!");
  return false;
};

signUpPage.addEventListener('click', (e) =>{
  e.preventDefault();
  location.href = '/signup';
});