const commentList = document.getElementById("comment-list");
const contentButtonBox = document.getElementById("content-button-box");

let prev_event; 
let prev_event_id;
let put_url;

commentList.addEventListener("click", function(e) {
    let buttonName = e.target.innerText;

    if(buttonName === "답글" || buttonName === "수정") {
        let brotherNode = e.target.parentNode.parentNode.childNodes;
        let replyForm = document.getElementById("reply-form-" + e.target.value);
        let childNodes = replyForm.childNodes;

        if(buttonName === "답글") {
            childNodes[1].innerText = "";
            childNodes[1].placeholder = "비방/욕설 자제";
        }
        else if(buttonName === "수정") {
            childNodes[1].innerText = brotherNode[5].innerText;

            prev_event = buttonName;
            prev_event_id = e.target.value;
            put_url = "/article/" + e.target.value + "/comment";
        }

        if(replyForm.style.display === "none") {
            closeAllReplyForm();
            replyForm.style.display = "block";
        }
        else {
            closeAllReplyForm();
            replyForm.style.display = "block";
        }
    }
    else if(buttonName === "삭제") {
        deleteMethod(e.target.value, true);
    }
    else if(buttonName === "등록" && prev_event === "수정") {
        e.preventDefault();

        let textarea = document.getElementById("textarea-" + prev_event_id);
        putMethod(put_url, textarea.value);
    }
});

contentButtonBox.addEventListener("click", function(e) {
    let buttonName = e.target.innerText;
    console.log(buttonName);

    if(buttonName === "삭제") {
        deleteMethod(e.target.value, false);
    }
});

function closeAllReplyForm() {
    let allReplyForm = document.getElementsByClassName("reply-form");

    for(let i = 0; i < allReplyForm.length; i++) {
        let tmpForm = document.getElementById(allReplyForm[i].id);

        if(tmpForm.style.display === "block")
            tmpForm.style.display = "none";
    }
}

function deleteMethod(reqUrl, ifReload) {
    if(confirm("정말 삭제 하시겠습니까?")) {
        $.ajax({
            url : reqUrl,
            method : "DELETE",
            dataType : "text"
        }).done((response) => {
            if(ifReload)
                window.location.reload(true);
            else{
                opener.location.reload();
                window.close();
            }
        });
    }
}

function putMethod(reqUrl, comment) {
    $.ajax({
        url : reqUrl,
        method : "PUT",
        dataType : "text",
        data : {"data" : comment},
    }).done((response) => {
        window.location.reload(true);
    });
}

const hitButton = document.getElementById('hit-button');
const hitCountTop = document.getElementById('hit-count-top');
const hitCountBottom = document.getElementById('hit-count-bottom');

hitButton.addEventListener('click', (e) => {
    e.preventDefault();

    $.ajax({
        url : e.target.value,
        method : "GET",
    }).done((response) => {
        if(response) {
            hitCountTop.innerText = Number(hitCountTop.innerText) + 1;
            hitCountBottom.innerText = Number(hitCountBottom.innerText) + 1;
        }
        else{
            alert('이미 추천했습니다');
        }
    });
});