// guide function
const guideMent = document.getElementById('guide');
const guideBubble = document.getElementById('guide-bubble');
const status_ = "toolbar=no,scrollbars=yes,resizable=yes,status=no,menubar=no,width=800,height=500,top=0,left=0";
const mypageButton = document.getElementById('button-mypage');

mypageButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.name = "parentPage";
  child_window = window.open("/users/mypage", "마이페이지", status_);
});
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