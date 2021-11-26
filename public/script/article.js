var buttonPost = document.getElementById("post-button");

buttonPost.addEventListener('click', (e) => {
    e.preventDefault();
    
    document.form.target = opener.window.name; // 타켓을 부모창으로 설정
    document.form.submit();

    window.close();
});