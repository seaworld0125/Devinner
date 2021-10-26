var buttonPost = document.getElementById("post-button");

buttonPost.addEventListener('click', (e) => {
    e.preventDefault();
    window.opener.name = "parentPage"; // 부모창의 이름 설정
    document.form.target = "parentPage"; // 타켓을 부모창으로 설정
    document.form.submit();
    self.close();
});