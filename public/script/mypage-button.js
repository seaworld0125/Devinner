// mypage
const mypageButton = document.getElementById('button-mypage');

mypageButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.name = "parentPage";
  child_window = window.open("/users/mypage", "마이페이지", status_);
});