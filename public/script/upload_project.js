const buttonPost = document.getElementById("post-button");
const title = document.getElementById("title");
const repos = document.getElementById("repos");
const checkButton = document.getElementById('github-repo-check');
const file = document.getElementById('file');

let check_repos = false;

buttonPost.addEventListener('click', (e) => {
    e.preventDefault();

    if(title.value.length == 0) {
        alert('제목을 입력해주세요');
        return;
    } 
    if(!check_repos) {
        alert('저장소를 확인해주세요');
        return;
    }
    if(!file.value) {
        alert('대표 이미지를 첨부해주세요');
        return;
    }
    
    document.form.target = opener.window.name; // 타켓을 부모창으로 설정
    document.form.submit();

    window.close();
});

const githubId = document.getElementById('github');
(() => {
    console.log(githubId.value.length)
    if(githubId.value.length == 0) {
        alert('깃허브 아이디를 등록하면 이용 가능합니다.\n(마이페이지에서 등록 가능)');
        window.close();
        return;
    }
})();

checkButton.addEventListener('click', (e) => {
    e.preventDefault();

    let url_ = "https://api.github.com/repos/" + githubId.value + "/" + repos.value;

    $.ajax({
        type: "GET",
        url: url_,
        success: (result) => {
            if(result.message) {
                alert('저장소 이름을 다시 확인해주세요');
                return;
            }
            else {
                alert('저장소가 확인되었습니다');
                checkButton.style.backgroundColor = 'rgb(82, 205, 221)';
                repos.readOnly = true;
                check_repos = true;
            }
        }
    });
});