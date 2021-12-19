// article
const createButton = document.getElementById('create-button');

createButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.name = "parentPage";

  let status = "toolbar=no,scrollbars=yes,resizable=yes,status=no,menubar=no,width=800,height=800,top=0,left=0"; 
  child_window = window.open("/article", "글 쓰기", status);
});

// 부모에게 이벤트를 위임
$(document).on("click", "#article_id", (e) => {
  e.preventDefault();

  window.name = "parentPage";

  let status = "toolbar=no,scrollbars=yes,resizable=yes,status=no,menubar=no,width=800,height=800,top=0,left=0"; 
  child_window = window.open(e.target.href, e.target.innerText, status);
});