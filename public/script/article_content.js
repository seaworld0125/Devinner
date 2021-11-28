let commentList = document.getElementById("comment-list");

let articleDeleteButton = document.getElementById("delete-button");

commentList.addEventListener("click", function(e) {
    let buttonName = e.target.innerText;

    if(buttonName === "답글" || buttonName === "수정") {
        let brotherNode = e.target.parentNode.parentNode.childNodes;
        let replyForm = document.getElementById("reply-form-" + e.target.value);
        let childNode = replyForm.childNodes;

        if(buttonName === "답글") {
            childNode[1].innerText = "비방/욕설 자제";
            replyForm.method = "post";
            replyForm.action = "/article/" + e.target.value + "/reply";
        }
        else if(buttonName === "수정") {
            childNode[1].innerText = brotherNode[5].innerText;
            replyForm.method = "put";
            replyForm.action = "/article/" + e.target.value + "/comment";
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
    else {
        let reqUrl = e.target.value;
        $.ajax({
            url : reqUrl,
            method : "DELETE",
            dataType : "text"
        });
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