const nicknameButton = document.getElementById('nickname-button');
const githubButton = document.getElementById('github-button');

function getGithubInfo(github) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: "https://api.github.com/users/" + github,
        success: (result) => {
          resolve(result);
        }
      });
    });
};
function checkNicknameUnique(nickname) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: "/users/nicknames/" + nickname + "/unique",
            success: (result) => {
                resolve(result);
            }
        }); 
    });
}
function changeNickname(nickname) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "PUT",
            url: "/users/nicknames/" + nickname,
            success: (result) => {
                resolve(result);
            },
            error: (jqXHR) => {
                alert('서버 에러(' + jqXHR.statusText + ') :' + jqXHR.status);
            }
        }); 
    });
}
function changeGithubId(github) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "PUT",
            url: "/users/github/" + github,
            success: (result) => {
                resolve(result);
            },
            error: (jqXHR) => {
                alert('서버 에러(' + jqXHR.statusText + ') :' + jqXHR.status);
            }
        }); 
    });
}

nicknameButton.addEventListener('click', async (e) => {
    let nickname = prompt('닉네임을 입력하세요', '4글자 이상 10글자 이하입니다');

    let length_ = nickname.length;
    if(length_ <= 3 || length_ >= 11) {
        alert('4글자 이상 10글자 이하입니다');
        return;
    }
    try {
        let result = await checkNicknameUnique(nickname);
        if(!result) {
            alert(nickname + '은 이미 존재하는 별명입니다');
            return;
        }
        if(confirm(nickname + '은 사용가능한 별명입니다.\n사용하시겠습니까?')) {
            await changeNickname(nickname);
            alert('변경되었습니다');

            window.opener.location.reload();
            location.reload();
        }
    }
    catch(error) {
        alert(error);
    }
});

githubButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    let github = prompt('깃허브 아이디를 입력하세요');
    if(github.length == 0) return;
    try {
        let result = await getGithubInfo(github);
        if(result.message) {
            alert('아이디를 다시 확인해주세요');
            return;
        }
        await changeGithubId(github);
        alert('변경되었습니다');

        window.opener.location.reload();
        location.reload();
    }
    catch(error) {
        alert(error);
    }
});

const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    let checkList = [];
    let checkList_length = document.getElementsByName('projectId').length;

    for (let i = 0; i < checkList_length; i++)
        if(document.getElementsByName('projectId')[i].checked)
            checkList.push(document.getElementsByName('projectId')[i].value);

    if(confirm('정말 삭제하시겠습니까?')) {
        $.ajax({
            url : "/project",
            method : "DELETE",
            traditional : true,
            data : {"list" : checkList}
        }).done((response) => {
            alert('삭제되었습니다');
            window.opener.location.reload(true);
            window.location.reload(true);
        });
    }
});