var buttonPost = document.getElementById("post-button");

(() => {
    document.getElementById("author").value = window.opener.document.getElementById("nick_name").textContent;
})();

buttonPost.addEventListener('click', (e) => {
    e.preventDefault();
    // document.domain = "localhost";
    // opener.name = "parentPage"; // 부모창의 이름 설정
    document.form.target = opener.window.name; // 타켓을 부모창으로 설정
    document.form.submit();
    // opener.parent.location.reload(); // 부모창 새로고침
    
    // self.close();
    window.close();
});